use anchor_lang::prelude::*;

/// Global configuration for the launchpad
#[account]
pub struct LaunchpadConfig {
    pub authority: Pubkey,
    pub fee_percentage: u16,        // Base fee in basis points (100 = 1%)
    pub community_pool: Pubkey,     // 50% of fees go here
    pub referral_fee: u16,          // Referral fee in basis points (10 = 0.1%)
    pub bump: u8,
}

impl LaunchpadConfig {
    pub const LEN: usize = 8 + 32 + 2 + 32 + 2 + 1;
}

/// Individual token launch configuration
#[account]
pub struct Launch {
    pub creator: Pubkey,
    pub mint: Pubkey,
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub total_supply: u64,
    pub total_sell_amount: u64,        // Amount to sell on bonding curve
    pub total_fund_raising: u64,       // Target SOL to raise
    pub tokens_sold: u64,
    pub sol_raised: u64,
    pub curve_type: CurveType,
    pub migrate_type: MigrateType,
    pub status: LaunchStatus,
    pub creator_fee_earned: u64,
    pub cliff_period: i64,             // Vesting cliff in seconds
    pub unlock_period: i64,            // Vesting unlock period in seconds
    pub launch_time: i64,
    pub migrate_time: i64,
    pub pool_address: Pubkey,
    pub bump: u8,
}

impl Launch {
    pub const MAX_NAME_LEN: usize = 32;
    pub const MAX_SYMBOL_LEN: usize = 10;
    pub const MAX_URI_LEN: usize = 200;

    pub const LEN: usize = 8 +          // discriminator
        32 +                            // creator
        32 +                            // mint
        4 + Self::MAX_NAME_LEN +        // name
        4 + Self::MAX_SYMBOL_LEN +      // symbol
        4 + Self::MAX_URI_LEN +         // uri
        8 +                             // total_supply
        8 +                             // total_sell_amount
        8 +                             // total_fund_raising
        8 +                             // tokens_sold
        8 +                             // sol_raised
        1 +                             // curve_type
        1 +                             // migrate_type
        1 +                             // status
        8 +                             // creator_fee_earned
        8 +                             // cliff_period
        8 +                             // unlock_period
        8 +                             // launch_time
        8 +                             // migrate_time
        32 +                            // pool_address
        1;                              // bump

    /// Calculate bonding curve progress (0-100)
    pub fn get_progress(&self) -> u64 {
        if self.total_sell_amount == 0 {
            return 0;
        }
        (self.tokens_sold * 100) / self.total_sell_amount
    }

    /// Calculate current token price based on curve type
    pub fn calculate_price(&self, tokens_sold: u64) -> Result<u64> {
        if self.total_sell_amount == 0 {
            return Ok(0);
        }

        let progress = (tokens_sold * 1_000_000) / self.total_sell_amount; // Progress in millionths

        match self.curve_type {
            CurveType::Linear => {
                // Linear: price increases proportionally with progress
                // Price = (total_fund_raising / total_sell_amount) * (1 + progress)
                let base_price = (self.total_fund_raising * 1_000_000) / self.total_sell_amount;
                Ok(base_price + (base_price * progress) / 1_000_000)
            }
            CurveType::Exponential => {
                // Exponential: price grows faster as more tokens are sold
                // Simplified exponential: Price = base_price * (1 + progress)^2
                let base_price = (self.total_fund_raising * 1_000_000) / self.total_sell_amount;
                let multiplier = 1_000_000 + progress;
                let squared = (multiplier * multiplier) / 1_000_000;
                Ok((base_price * squared) / 1_000_000)
            }
            CurveType::Logarithmic => {
                // Logarithmic: price increases slowly at first, then faster
                // Simplified: Price = base_price * log(1 + progress)
                // Using approximation for log
                let base_price = (self.total_fund_raising * 1_000_000) / self.total_sell_amount;
                let log_approx = if progress < 100_000 {
                    progress
                } else {
                    100_000 + ((progress - 100_000) / 2)
                };
                Ok((base_price * (1_000_000 + log_approx)) / 1_000_000)
            }
        }
    }

    /// Calculate tokens to receive for given SOL amount
    pub fn calculate_tokens_for_sol(&self, sol_amount: u64) -> Result<u64> {
        // Simplified calculation - in production, this should integrate over the curve
        let current_price = self.calculate_price(self.tokens_sold)?;
        if current_price == 0 {
            return Ok(0);
        }
        Ok((sol_amount * 1_000_000) / current_price)
    }

    /// Calculate SOL needed for given token amount
    pub fn calculate_sol_for_tokens(&self, token_amount: u64) -> Result<u64> {
        let current_price = self.calculate_price(self.tokens_sold)?;
        Ok((token_amount * current_price) / 1_000_000)
    }
}

/// Bonding curve type
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum CurveType {
    Linear,
    Exponential,
    Logarithmic,
}

/// Migration type when bonding curve completes
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum MigrateType {
    CPMM,      // Constant Product Market Maker
    CLMM,      // Concentrated Liquidity Market Maker
}

/// Launch status
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum LaunchStatus {
    Active,
    Migrated,
    Cancelled,
}

/// Referral tracking
#[account]
pub struct Referral {
    pub referrer: Pubkey,
    pub launch: Pubkey,
    pub volume_generated: u64,
    pub rewards_earned: u64,
    pub rewards_claimed: u64,
    pub bump: u8,
}

impl Referral {
    pub const LEN: usize = 8 + 32 + 32 + 8 + 8 + 8 + 1;
}

/// User position in a launch
#[account]
pub struct UserPosition {
    pub user: Pubkey,
    pub launch: Pubkey,
    pub tokens_bought: u64,
    pub tokens_sold: u64,
    pub sol_spent: u64,
    pub sol_received: u64,
    pub bump: u8,
}

impl UserPosition {
    pub const LEN: usize = 8 + 32 + 32 + 8 + 8 + 8 + 8 + 1;
}
