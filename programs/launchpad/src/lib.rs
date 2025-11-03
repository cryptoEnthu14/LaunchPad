use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("DRay6fNdQ5J82H7xV6uq2aV3mNrUZ1J4PgSKsWgptcm6");

pub mod state;
pub mod instructions;
pub mod errors;
pub mod utils;

use state::*;
use instructions::*;
use errors::*;

#[program]
pub mod launchpad {
    use super::*;

    /// Initialize the launchpad program
    pub fn initialize(ctx: Context<Initialize>, fee_percentage: u16) -> Result<()> {
        instructions::initialize(ctx, fee_percentage)
    }

    /// Create a new token launch with bonding curve
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
        instructions::create_launch(
            ctx,
            name,
            symbol,
            uri,
            supply,
            total_sell_amount,
            total_fund_raising,
            curve_type,
            migrate_type,
            cliff_period,
            unlock_period,
        )
    }

    /// Buy tokens from bonding curve
    pub fn buy_tokens(ctx: Context<BuyTokens>, sol_amount: u64, min_tokens_out: u64) -> Result<()> {
        instructions::buy_tokens(ctx, sol_amount, min_tokens_out)
    }

    /// Sell tokens to bonding curve
    pub fn sell_tokens(ctx: Context<SellTokens>, token_amount: u64, min_sol_out: u64) -> Result<()> {
        instructions::sell_tokens(ctx, token_amount, min_sol_out)
    }

    /// Migrate liquidity to AMM pool when bonding curve goal is reached
    pub fn migrate_to_pool(ctx: Context<MigrateToPool>) -> Result<()> {
        instructions::migrate_to_pool(ctx)
    }

    /// Claim creator fees
    pub fn claim_creator_fees(ctx: Context<ClaimCreatorFees>) -> Result<()> {
        instructions::claim_creator_fees(ctx)
    }

    /// Add referral for fee sharing
    pub fn add_referral(ctx: Context<AddReferral>, referrer: Pubkey) -> Result<()> {
        instructions::add_referral(ctx, referrer)
    }

    /// Claim referral rewards
    pub fn claim_referral_rewards(ctx: Context<ClaimReferralRewards>) -> Result<()> {
        instructions::claim_referral_rewards(ctx)
    }
}
