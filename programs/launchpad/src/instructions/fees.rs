use anchor_lang::prelude::*;
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct ClaimCreatorFees<'info> {
    #[account(
        mut,
        seeds = [b"launch", launch.mint.as_ref()],
        bump = launch.bump,
        has_one = creator
    )]
    pub launch: Account<'info, Launch>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn claim_creator_fees(ctx: Context<ClaimCreatorFees>) -> Result<()> {
    let launch = &mut ctx.accounts.launch;

    require!(launch.creator_fee_earned > 0, LaunchpadError::NoFeesToClaim);

    let fee_amount = launch.creator_fee_earned;

    // Transfer fees from launch to creator
    **launch.to_account_info().try_borrow_mut_lamports()? -= fee_amount;
    **ctx.accounts.creator.to_account_info().try_borrow_mut_lamports()? += fee_amount;

    launch.creator_fee_earned = 0;

    msg!("Claimed {} SOL in creator fees", fee_amount as f64 / 1_000_000_000.0);

    Ok(())
}
