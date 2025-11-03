use anchor_lang::prelude::*;

#[error_code]
pub enum LaunchpadError {
    #[msg("Invalid fee percentage")]
    InvalidFeePercentage,

    #[msg("Invalid supply amount")]
    InvalidSupply,

    #[msg("Invalid sell amount - must be between 51% and 80% of supply")]
    InvalidSellAmount,

    #[msg("Invalid fund raising target")]
    InvalidFundRaisingTarget,

    #[msg("Launch is not active")]
    LaunchNotActive,

    #[msg("Launch already migrated")]
    AlreadyMigrated,

    #[msg("Bonding curve goal not reached yet")]
    GoalNotReached,

    #[msg("Insufficient tokens in bonding curve")]
    InsufficientTokens,

    #[msg("Insufficient SOL in bonding curve")]
    InsufficientSOL,

    #[msg("Slippage tolerance exceeded")]
    SlippageExceeded,

    #[msg("Amount too small")]
    AmountTooSmall,

    #[msg("Amount too large")]
    AmountTooLarge,

    #[msg("Arithmetic overflow")]
    ArithmeticOverflow,

    #[msg("Arithmetic underflow")]
    ArithmeticUnderflow,

    #[msg("Invalid authority")]
    InvalidAuthority,

    #[msg("Name too long")]
    NameTooLong,

    #[msg("Symbol too long")]
    SymbolTooLong,

    #[msg("URI too long")]
    URITooLong,

    #[msg("No fees to claim")]
    NoFeesToClaim,

    #[msg("No rewards to claim")]
    NoRewardsToClaim,

    #[msg("Vesting period not ended")]
    VestingNotEnded,
}
