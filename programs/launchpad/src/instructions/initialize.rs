use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = LaunchpadConfig::LEN,
        seeds = [b"config"],
        bump
    )]
    pub config: Account<'info, LaunchpadConfig>,

    #[account(mut)]
    pub authority: Signer<'info>,

    /// CHECK: Community pool account
    pub community_pool: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

pub fn initialize(ctx: Context<Initialize>, fee_percentage: u16) -> Result<()> {
    require!(fee_percentage <= 1000, LaunchpadError::InvalidFeePercentage); // Max 10%

    let config = &mut ctx.accounts.config;
    config.authority = ctx.accounts.authority.key();
    config.fee_percentage = fee_percentage;
    config.community_pool = ctx.accounts.community_pool.key();
    config.referral_fee = 10; // 0.1%
    config.bump = ctx.bumps.config;

    msg!("Launchpad initialized with {}% fee", fee_percentage as f64 / 100.0);

    Ok(())
}
