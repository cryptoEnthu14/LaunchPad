use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use anchor_spl::associated_token::AssociatedToken;
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct BuyTokens<'info> {
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
        init_if_needed,
        payer = buyer,
        space = UserPosition::LEN,
        seeds = [b"position", launch.key().as_ref(), buyer.key().as_ref()],
        bump
    )]
    pub user_position: Account<'info, UserPosition>,

    #[account(
        init_if_needed,
        payer = buyer,
        associated_token::mint = launch.mint,
        associated_token::authority = buyer,
    )]
    pub buyer_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(
        seeds = [b"config"],
        bump = config.bump
    )]
    pub config: Account<'info, LaunchpadConfig>,

    /// CHECK: Community pool receiving fees
    #[account(mut)]
    pub community_pool: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn buy_tokens(ctx: Context<BuyTokens>, sol_amount: u64, min_tokens_out: u64) -> Result<()> {
    let launch = &mut ctx.accounts.launch;

    require!(sol_amount > 0, LaunchpadError::AmountTooSmall);

    // Calculate tokens to receive based on bonding curve
    let tokens_to_receive = launch.calculate_tokens_for_sol(sol_amount)?;

    // Check slippage
    require!(tokens_to_receive >= min_tokens_out, LaunchpadError::SlippageExceeded);

    // Check if enough tokens available
    let remaining_tokens = launch.total_sell_amount
        .checked_sub(launch.tokens_sold)
        .ok_or(LaunchpadError::ArithmeticUnderflow)?;

    require!(tokens_to_receive <= remaining_tokens, LaunchpadError::InsufficientTokens);

    // Calculate fees (1% total)
    let fee_amount = sol_amount
        .checked_mul(ctx.accounts.config.fee_percentage as u64)
        .ok_or(LaunchpadError::ArithmeticOverflow)?
        .checked_div(10000)
        .ok_or(LaunchpadError::ArithmeticOverflow)?;

    let creator_fee = fee_amount / 2; // 50% to creator
    let community_fee = fee_amount - creator_fee; // 50% to community pool

    let net_sol = sol_amount
        .checked_sub(fee_amount)
        .ok_or(LaunchpadError::ArithmeticUnderflow)?;

    // Transfer SOL from buyer to launch
    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: launch.to_account_info(),
            },
        ),
        net_sol,
    )?;

    // Transfer community fee
    if community_fee > 0 {
        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.buyer.to_account_info(),
                    to: ctx.accounts.community_pool.to_account_info(),
                },
            ),
            community_fee,
        )?;
    }

    // Transfer tokens from launch to buyer
    let seeds = &[
        b"launch",
        launch.mint.as_ref(),
        &[launch.bump],
    ];
    let signer = &[&seeds[..]];

    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.launch_token_account.to_account_info(),
                to: ctx.accounts.buyer_token_account.to_account_info(),
                authority: launch.to_account_info(),
            },
            signer,
        ),
        tokens_to_receive,
    )?;

    // Update launch state
    launch.tokens_sold = launch.tokens_sold
        .checked_add(tokens_to_receive)
        .ok_or(LaunchpadError::ArithmeticOverflow)?;

    launch.sol_raised = launch.sol_raised
        .checked_add(net_sol)
        .ok_or(LaunchpadError::ArithmeticOverflow)?;

    launch.creator_fee_earned = launch.creator_fee_earned
        .checked_add(creator_fee)
        .ok_or(LaunchpadError::ArithmeticOverflow)?;

    // Update user position
    let position = &mut ctx.accounts.user_position;
    if position.user == Pubkey::default() {
        position.user = ctx.accounts.buyer.key();
        position.launch = launch.key();
        position.bump = ctx.bumps.user_position;
    }

    position.tokens_bought = position.tokens_bought
        .checked_add(tokens_to_receive)
        .ok_or(LaunchpadError::ArithmeticOverflow)?;

    position.sol_spent = position.sol_spent
        .checked_add(sol_amount)
        .ok_or(LaunchpadError::ArithmeticOverflow)?;

    msg!("Bought {} tokens for {} SOL", tokens_to_receive, sol_amount as f64 / 1_000_000_000.0);
    msg!("Progress: {}%", launch.get_progress());

    Ok(())
}
