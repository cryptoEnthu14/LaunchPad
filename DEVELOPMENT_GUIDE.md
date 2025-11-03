# Radium-Style Launchpad - Complete Development Guide

This comprehensive guide will walk you through building, testing, and deploying a complete token launchpad similar to Raydium's LaunchLab on Solana.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Project Structure](#project-structure)
4. [Step-by-Step Development](#step-by-step-development)
5. [Smart Contract Architecture](#smart-contract-architecture)
6. [Frontend Implementation](#frontend-implementation)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Usage](#usage)

## Overview

This launchpad enables users to:
- Create tokens with customizable bonding curves (Linear, Exponential, Logarithmic)
- Launch tokens with automatic price discovery
- Trade tokens on bonding curves
- Auto-migrate to AMM pools when fundraising goals are reached
- Earn creator fees and referral rewards

### Key Features

✅ **Two Launch Modes**
- JustSendIt: Quick launch with default settings
- Custom: Full control over parameters

✅ **Bonding Curves**
- Linear: Constant price increase
- Exponential: Accelerating price growth
- Logarithmic: Decelerating price growth

✅ **Automatic Pool Migration**
- Migrates to CPMM or CLMM when target SOL reached
- Burns 90% of LP tokens
- Locks 10% in Burn & Earn

✅ **Fee Distribution**
- 1% total trading fee
- 50% to creators
- 50% to community pool
- 0.1% referral rewards

## Prerequisites

### Required Software

```bash
# Node.js (v18 or higher)
node --version

# Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup --version

# Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"
solana --version

# Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install 0.29.0
avm use 0.29.0
anchor --version

# Yarn
npm install -g yarn
```

### Solana Wallet Setup

```bash
# Generate a new keypair
solana-keygen new

# Set to devnet
solana config set --url devnet

# Get devnet SOL
solana airdrop 2
```

## Project Structure

```
LaunchPad/
├── programs/
│   └── launchpad/
│       ├── src/
│       │   ├── lib.rs              # Main program entry
│       │   ├── state.rs            # Account structures
│       │   ├── errors.rs           # Error definitions
│       │   ├── utils.rs            # Utility functions
│       │   └── instructions/
│       │       ├── mod.rs
│       │       ├── initialize.rs   # Initialize launchpad
│       │       ├── create_launch.rs # Create token launch
│       │       ├── buy_tokens.rs   # Buy from bonding curve
│       │       ├── sell_tokens.rs  # Sell to bonding curve
│       │       ├── migrate.rs      # Migrate to AMM
│       │       ├── fees.rs         # Fee claims
│       │       └── referral.rs     # Referral system
│       └── Cargo.toml
├── app/
│   ├── components/                 # React components
│   ├── contexts/                   # React contexts
│   ├── hooks/                      # Custom hooks
│   ├── utils/                      # Utility functions
│   ├── page.tsx                    # Main page
│   └── globals.css                 # Global styles
├── tests/
│   └── launchpad.ts               # Anchor tests
├── Anchor.toml                    # Anchor configuration
├── package.json                   # Node dependencies
└── README.md                      # Documentation
```

## Step-by-Step Development

### Step 1: Initialize Anchor Project

The project is already initialized with Anchor. Verify the setup:

```bash
# Build the program
anchor build

# This will compile the Rust smart contracts
```

### Step 2: Understanding Smart Contract Architecture

#### State Structures

**LaunchpadConfig** - Global configuration
```rust
pub struct LaunchpadConfig {
    pub authority: Pubkey,
    pub fee_percentage: u16,
    pub community_pool: Pubkey,
    pub referral_fee: u16,
    pub bump: u8,
}
```

**Launch** - Individual token launch
```rust
pub struct Launch {
    pub creator: Pubkey,
    pub mint: Pubkey,
    pub name: String,
    pub symbol: String,
    pub total_supply: u64,
    pub total_sell_amount: u64,
    pub total_fund_raising: u64,
    pub tokens_sold: u64,
    pub sol_raised: u64,
    pub curve_type: CurveType,
    pub migrate_type: MigrateType,
    pub status: LaunchStatus,
    // ... more fields
}
```

#### Key Instructions

1. **initialize** - Set up the launchpad
2. **create_launch** - Create a new token with bonding curve
3. **buy_tokens** - Purchase tokens from the curve
4. **sell_tokens** - Sell tokens back to the curve
5. **migrate_to_pool** - Migrate to AMM when goal reached
6. **claim_creator_fees** - Claim accumulated fees
7. **add_referral** - Set up referral tracking
8. **claim_referral_rewards** - Claim referral earnings

### Step 3: Bonding Curve Implementation

The bonding curve determines token price based on supply sold:

**Linear Curve**
```rust
Price = base_price * (1 + progress)
```

**Exponential Curve**
```rust
Price = base_price * (1 + progress)^2
```

**Logarithmic Curve**
```rust
Price = base_price * log(1 + progress)
```

### Step 4: Frontend Setup

Install dependencies:

```bash
# Install Node packages
yarn install

# This installs:
# - Next.js for the framework
# - Solana wallet adapters
# - Anchor client libraries
# - Tailwind CSS for styling
# - Recharts for bonding curve visualization
```

### Step 5: Wallet Integration

The app uses multiple wallet adapters:

```typescript
// Phantom, Solflare, and Torus wallets supported
const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
  new TorusWalletAdapter(),
]
```

### Step 6: Component Architecture

**Main Components:**

1. **Header** - Navigation and wallet connection
2. **LaunchList** - Display all token launches
3. **LaunchCard** - Individual launch preview
4. **CreateLaunchModal** - Form to create new launches
5. **LaunchDetail** - Detailed view of a launch
6. **TradingInterface** - Buy/sell tokens
7. **BondingCurveChart** - Visualize price curve

### Step 7: Connecting Frontend to Smart Contracts

```typescript
// Use the custom hook
const { createLaunch, buyTokens, sellTokens } = useLaunchpad()

// Create a launch
await createLaunch({
  name: "My Token",
  symbol: "MTK",
  supply: 1000000000,
  // ... other params
})

// Buy tokens
await buyTokens(launchAddress, solAmount, slippage)
```

## Testing

### Local Testing

```bash
# Start local validator
solana-test-validator

# In another terminal, run tests
anchor test --skip-local-validator

# Or test with local validator
anchor test
```

### Test Coverage

The test suite covers:
- ✅ Launchpad initialization
- ✅ Token launch creation
- ✅ Buying tokens from bonding curve
- ✅ Selling tokens to bonding curve
- ✅ Pool migration
- ✅ Fee claiming
- ✅ Referral rewards

### Frontend Testing

```bash
# Run development server
yarn dev

# Open http://localhost:3000
```

## Deployment

### Deploy to Devnet

```bash
# Set to devnet
solana config set --url devnet

# Build program
anchor build

# Deploy
anchor deploy

# Note the Program ID and update in:
# - Anchor.toml
# - app/utils/constants.ts
```

### Deploy Frontend

```bash
# Build for production
yarn build

# Deploy to Vercel/Netlify
# Or run locally
yarn start
```

### Deploy to Mainnet

⚠️ **Before mainnet deployment:**

1. **Security Audit** - Get smart contracts audited
2. **Testing** - Thorough testing on devnet
3. **Configuration** - Update RPC endpoints
4. **Wallet Setup** - Use a secure deployment wallet

```bash
# Set to mainnet
solana config set --url mainnet-beta

# Deploy (requires SOL for deployment)
anchor deploy --provider.cluster mainnet
```

## Usage

### For Token Creators

1. **Connect Wallet** - Click "Connect Wallet" in header
2. **Create Token** - Click "Create Token" button
3. **Fill Form:**
   - Token name and symbol
   - Total supply
   - Sell percentage (51-80%)
   - Target SOL (minimum 30)
   - Bonding curve type
   - Pool migration type

4. **Approve Transaction** - Sign the transaction in your wallet
5. **Share Launch** - Share your launch link with community

### For Token Buyers

1. **Browse Launches** - View all active launches
2. **Select Token** - Click on a launch to view details
3. **Buy Tokens:**
   - Enter SOL amount
   - Review estimated tokens
   - Click "Buy Tokens"
   - Approve transaction

4. **Sell Tokens:**
   - Switch to "Sell" tab
   - Enter token amount
   - Review estimated SOL
   - Click "Sell Tokens"

### For Creators - Claiming Fees

```typescript
// Creators earn 0.5% of each trade
// Claim accumulated fees:
await claimCreatorFees(launchAddress)
```

### For Referrers

```typescript
// Add referral
await addReferral(launchAddress, referrerPublicKey)

// Claim rewards (0.1% of referred volume)
await claimReferralRewards(launchAddress)
```

## Advanced Features

### Custom Bonding Curves

You can modify the bonding curve formulas in `programs/launchpad/src/state.rs`:

```rust
pub fn calculate_price(&self, tokens_sold: u64) -> Result<u64> {
    match self.curve_type {
        CurveType::Linear => {
            // Your custom formula
        }
        CurveType::Exponential => {
            // Your custom formula
        }
        CurveType::Logarithmic => {
            // Your custom formula
        }
    }
}
```

### Fee Customization

Adjust fees in the initialize instruction:

```rust
// In programs/launchpad/src/instructions/initialize.rs
config.fee_percentage = 100; // 1% (in basis points)
config.referral_fee = 10;    // 0.1%
```

### Vesting Schedules

Tokens can have cliff and unlock periods:

```typescript
cliffPeriod: 86400,    // 1 day in seconds
unlockPeriod: 2592000, // 30 days
```

## Security Considerations

1. **Slippage Protection** - Always set appropriate slippage tolerance
2. **Wallet Security** - Never share private keys
3. **Smart Contract Audits** - Get audited before mainnet
4. **Rug Pull Prevention** - 90% of LP tokens are burned
5. **Admin Keys** - Use multi-sig for program authority

## Troubleshooting

### Common Issues

**Build Fails**
```bash
# Clean and rebuild
anchor clean
anchor build
```

**Wallet Not Connecting**
```bash
# Check wallet extension is installed
# Clear browser cache
# Try different wallet
```

**Transaction Fails**
```bash
# Check SOL balance
solana balance

# Get more SOL
solana airdrop 2
```

**Frontend Errors**
```bash
# Clear node modules
rm -rf node_modules
yarn install
```

## Resources

- [Solana Documentation](https://docs.solana.com/)
- [Anchor Documentation](https://www.anchor-lang.com/)
- [Raydium Docs](https://docs.raydium.io/)
- [SPL Token](https://spl.solana.com/token)

## Support

For issues and questions:
- Create an issue on GitHub
- Join Solana Discord
- Check Anchor community forums

## License

MIT License - see LICENSE file for details

---

**Built with ❤️ on Solana**
