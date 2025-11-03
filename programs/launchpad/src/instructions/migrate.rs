use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct MigrateToPool<'info> {
    #[account(
        mut,
        seeds = [b"launch", launch.mint.as_ref()],
        bump = launch.bump,
        constraint = launch.status == LaunchStatus::Active @ LaunchpadError::LaunchNotActive
    )]
    pub launch: Account<'info, Launch>,

    #[account(
        mut,
        associated_token::mint = launch.mint,
        associated_token::authority = launch,
    )]
    pub launch_token_account: Account<'info, TokenAccount>,

    /// CHECK: This will be the AMM pool address (CPMM or CLMM)
    #[account(mut)]
    pub pool: AccountInfo<'info>,

    /// CHECK: Pool token account for the launch token
    #[account(mut)]
    pub pool_token_account: AccountInfo<'info>,

    /// CHECK: Pool SOL/WSOL account
    #[account(mut)]
    pub pool_sol_account: AccountInfo<'info>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn migrate_to_pool(ctx: Context<MigrateToPool>) -> Result<()> {
    let launch = &mut ctx.accounts.launch;

    // Check if bonding curve goal is reached
    require!(
        launch.sol_raised >= launch.total_fund_raising,
        LaunchpadError::GoalNotReached
    );

    require!(
        launch.status == LaunchStatus::Active,
        LaunchpadError::AlreadyMigrated
    );

    // Get remaining tokens and SOL
    let remaining_tokens = ctx.accounts.launch_token_account.amount;
    let sol_balance = launch.to_account_info().lamports();

    // Reserve 5000 lamports for rent
    let sol_to_migrate = sol_balance.saturating_sub(5000);

    // Calculate LP tokens to burn (90%)
    // In a real implementation, this would interact with the actual AMM program

    msg!("Migrating to AMM pool");
    msg!("Tokens: {}, SOL: {}", remaining_tokens, sol_to_migrate as f64 / 1_000_000_000.0);

    // Update launch status
    launch.status = LaunchStatus::Migrated;
    launch.migrate_time = Clock::get()?.unix_timestamp;
    launch.pool_address = ctx.accounts.pool.key();

    // In a production implementation, you would:
    // 1. Create CPMM or CLMM pool
    // 2. Add liquidity (remaining tokens + SOL)
    // 3. Burn 90% of LP tokens
    // 4. Lock 10% of LP tokens in Burn & Earn

    msg!("Migration complete. Pool address: {}", launch.pool_address);

    Ok(())
}
