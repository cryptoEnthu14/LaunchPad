use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, MintTo};
use anchor_spl::associated_token::AssociatedToken;
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
#[instruction(name: String, symbol: String)]
pub struct CreateLaunch<'info> {
    #[account(
        init,
        payer = creator,
        space = Launch::LEN,
        seeds = [b"launch", mint.key().as_ref()],
        bump
    )]
    pub launch: Account<'info, Launch>,

    #[account(
        init,
        payer = creator,
        mint::decimals = 9,
        mint::authority = launch,
        seeds = [b"mint", creator.key().as_ref(), name.as_bytes()],
        bump
    )]
    pub mint: Account<'info, Mint>,

    #[account(
        init,
        payer = creator,
        associated_token::mint = mint,
        associated_token::authority = launch,
    )]
    pub launch_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn create_launch(
    ctx: Context<CreateLaunch>,
    name: String,
    symbol: String,
    uri: String,
    supply: u64,
    total_sell_amount: u64,
    total_fund_raising: u64,
    curve_type: CurveType,
    migrate_type: MigrateType,
    cliff_period: i64,
    unlock_period: i64,
) -> Result<()> {
    // Validate inputs
    require!(name.len() <= Launch::MAX_NAME_LEN, LaunchpadError::NameTooLong);
    require!(symbol.len() <= Launch::MAX_SYMBOL_LEN, LaunchpadError::SymbolTooLong);
    require!(uri.len() <= Launch::MAX_URI_LEN, LaunchpadError::URITooLong);
    require!(supply > 0, LaunchpadError::InvalidSupply);

    // Validate sell amount is between 51% and 80% of supply
    let min_sell = supply * 51 / 100;
    let max_sell = supply * 80 / 100;
    require!(
        total_sell_amount >= min_sell && total_sell_amount <= max_sell,
        LaunchpadError::InvalidSellAmount
    );

    // Minimum 30 SOL target
    require!(
        total_fund_raising >= 30_000_000_000, // 30 SOL in lamports
        LaunchpadError::InvalidFundRaisingTarget
    );

    let launch = &mut ctx.accounts.launch;
    launch.creator = ctx.accounts.creator.key();
    launch.mint = ctx.accounts.mint.key();
    launch.name = name;
    launch.symbol = symbol;
    launch.uri = uri;
    launch.total_supply = supply;
    launch.total_sell_amount = total_sell_amount;
    launch.total_fund_raising = total_fund_raising;
    launch.tokens_sold = 0;
    launch.sol_raised = 0;
    launch.curve_type = curve_type;
    launch.migrate_type = migrate_type;
    launch.status = LaunchStatus::Active;
    launch.creator_fee_earned = 0;
    launch.cliff_period = cliff_period;
    launch.unlock_period = unlock_period;
    launch.launch_time = Clock::get()?.unix_timestamp;
    launch.migrate_time = 0;
    launch.pool_address = Pubkey::default();
    launch.bump = ctx.bumps.launch;

    // Mint total supply to launch account
    let cpi_accounts = MintTo {
        mint: ctx.accounts.mint.to_account_info(),
        to: ctx.accounts.launch_token_account.to_account_info(),
        authority: launch.to_account_info(),
    };

    let seeds = &[
        b"launch",
        ctx.accounts.mint.key().as_ref(),
        &[launch.bump],
    ];
    let signer = &[&seeds[..]];

    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);

    token::mint_to(cpi_ctx, supply)?;

    msg!("Launch created: {} ({})", launch.name, launch.symbol);
    msg!("Supply: {}, Sell Amount: {}, Target: {} SOL", supply, total_sell_amount, total_fund_raising / 1_000_000_000);

    Ok(())
}
