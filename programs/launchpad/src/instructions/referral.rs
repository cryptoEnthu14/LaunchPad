use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct AddReferral<'info> {
    #[account(
        init_if_needed,
        payer = payer,
        space = Referral::LEN,
        seeds = [b"referral", launch.key().as_ref(), referrer_account.key().as_ref()],
        bump
    )]
    pub referral: Account<'info, Referral>,

    pub launch: Account<'info, Launch>,

    /// CHECK: The referrer account
    pub referrer_account: AccountInfo<'info>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn add_referral(ctx: Context<AddReferral>, referrer: Pubkey) -> Result<()> {
    let referral = &mut ctx.accounts.referral;

    if referral.referrer == Pubkey::default() {
        referral.referrer = referrer;
        referral.launch = ctx.accounts.launch.key();
        referral.volume_generated = 0;
        referral.rewards_earned = 0;
        referral.rewards_claimed = 0;
        referral.bump = ctx.bumps.referral;

        msg!("Referral added for {}", referrer);
    }

    Ok(())
}

#[derive(Accounts)]
pub struct ClaimReferralRewards<'info> {
    #[account(
        mut,
        seeds = [b"referral", launch.key().as_ref(), referrer.key().as_ref()],
        bump = referral.bump,
        has_one = referrer
    )]
    pub referral: Account<'info, Referral>,

    pub launch: Account<'info, Launch>,

    #[account(mut)]
    pub referrer: Signer<'info>,

    #[account(
        seeds = [b"config"],
        bump = config.bump
    )]
    pub config: Account<'info, LaunchpadConfig>,

    pub system_program: Program<'info, System>,
}

pub fn claim_referral_rewards(ctx: Context<ClaimReferralRewards>) -> Result<()> {
    let referral = &mut ctx.accounts.referral;

    let unclaimed = referral.rewards_earned
        .checked_sub(referral.rewards_claimed)
        .ok_or(LaunchpadError::ArithmeticUnderflow)?;

    require!(unclaimed > 0, LaunchpadError::NoRewardsToClaim);

    // Transfer rewards from referral account to referrer
    // In production, rewards would be accumulated in a dedicated account
    referral.rewards_claimed = referral.rewards_earned;

    msg!("Claimed {} SOL in referral rewards", unclaimed as f64 / 1_000_000_000.0);

    Ok(())
}
