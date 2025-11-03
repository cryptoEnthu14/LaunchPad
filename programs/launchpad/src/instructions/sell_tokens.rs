use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct SellTokens<'info> {
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

    #[account(
        mut,
        seeds = [b"position", launch.key().as_ref(), seller.key().as_ref()],
        bump = user_position.bump
    )]
    pub user_position: Account<'info, UserPosition>,

    #[account(
        mut,
        associated_token::mint = launch.mint,
        associated_token::authority = seller,
    )]
    pub seller_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub seller: Signer<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn sell_tokens(ctx: Context<SellTokens>, token_amount: u64, min_sol_out: u64) -> Result<()> {
    let launch = &mut ctx.accounts.launch;

    require!(token_amount > 0, LaunchpadError::AmountTooSmall);

    // Calculate SOL to receive based on bonding curve
    let sol_to_receive = launch.calculate_sol_for_tokens(token_amount)?;

    // Check slippage
    require!(sol_to_receive >= min_sol_out, LaunchpadError::SlippageExceeded);

    // Check if launch has enough SOL
    let launch_balance = launch.to_account_info().lamports();
    require!(sol_to_receive <= launch_balance, LaunchpadError::InsufficientSOL);

    // Transfer tokens from seller to launch
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.seller_token_account.to_account_info(),
                to: ctx.accounts.launch_token_account.to_account_info(),
                authority: ctx.accounts.seller.to_account_info(),
            },
        ),
        token_amount,
    )?;

    // Transfer SOL from launch to seller
    **launch.to_account_info().try_borrow_mut_lamports()? -= sol_to_receive;
    **ctx.accounts.seller.to_account_info().try_borrow_mut_lamports()? += sol_to_receive;

    // Update launch state
    launch.tokens_sold = launch.tokens_sold
        .checked_sub(token_amount)
        .ok_or(LaunchpadError::ArithmeticUnderflow)?;

    launch.sol_raised = launch.sol_raised
        .checked_sub(sol_to_receive)
        .ok_or(LaunchpadError::ArithmeticUnderflow)?;

    // Update user position
    let position = &mut ctx.accounts.user_position;
    position.tokens_sold = position.tokens_sold
        .checked_add(token_amount)
        .ok_or(LaunchpadError::ArithmeticOverflow)?;

    position.sol_received = position.sol_received
        .checked_add(sol_to_receive)
        .ok_or(LaunchpadError::ArithmeticOverflow)?;

    msg!("Sold {} tokens for {} SOL", token_amount, sol_to_receive as f64 / 1_000_000_000.0);

    Ok(())
}
