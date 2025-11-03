# Radium Launchpad - Solana Token Launchpad

A complete token launchpad platform similar to Raydium's LaunchLab, built on Solana with Anchor framework.

## 🚀 Features

- **Token Creation** - Create tokens with customizable bonding curves
- **Bonding Curves** - Linear, Exponential, and Logarithmic price curves
- **Automatic Trading** - Buy and sell tokens directly from the bonding curve
- **Pool Migration** - Auto-migrate to AMM pools (CPMM/CLMM) when goals are reached
- **Fee Distribution** - 1% trading fee split between creators and community
- **Referral System** - Earn 0.1% on referred trading volume
- **Wallet Support** - Phantom, Solflare, and Torus wallets
- **Real-time UI** - Modern, responsive interface with live price charts

## 📋 Prerequisites

- Node.js 18+
- Rust 1.70+
- Solana CLI 1.17+
- Anchor 0.29+
- Yarn or npm

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd LaunchPad
```

2. **Install dependencies**
```bash
yarn install
```

3. **Build smart contracts**
```bash
anchor build
```

4. **Set up environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

## 🚀 Quick Start

### Development

1. **Start local validator**
```bash
solana-test-validator
```

2. **Deploy to local**
```bash
anchor deploy
```

3. **Run tests**
```bash
anchor test
```

4. **Start frontend**
```bash
yarn dev
```

Visit `http://localhost:3000`

### Deployment to Devnet

```bash
# Configure for devnet
solana config set --url devnet

# Request airdrop
solana airdrop 2

# Deploy
anchor deploy

# Update program ID in:
# - Anchor.toml
# - app/utils/constants.ts
```

## 📖 Documentation

See [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) for comprehensive step-by-step instructions on:
- Smart contract architecture
- Frontend implementation
- Bonding curve mathematics
- Testing strategies
- Deployment procedures
- Advanced customization

## 🏗️ Architecture

### Smart Contracts (Anchor/Rust)

```
programs/launchpad/
├── lib.rs              # Program entry point
├── state.rs            # Account structures
├── errors.rs           # Error definitions
├── utils.rs            # Helper functions
└── instructions/       # Program instructions
    ├── initialize.rs
    ├── create_launch.rs
    ├── buy_tokens.rs
    ├── sell_tokens.rs
    ├── migrate.rs
    ├── fees.rs
    └── referral.rs
```

### Frontend (Next.js/TypeScript)

```
app/
├── components/         # React components
├── contexts/          # Wallet provider
├── hooks/             # Custom hooks
├── utils/             # Helper functions
└── page.tsx           # Main page
```

## 💡 Usage

### Creating a Token Launch

1. Connect your Solana wallet
2. Click "Create Token"
3. Fill in token details:
   - Name, symbol, and metadata URI
   - Total supply
   - Bonding curve parameters
   - Fundraising target (min 30 SOL)
4. Approve transaction
5. Share your launch!

### Trading Tokens

1. Browse active launches
2. Select a token
3. Choose Buy or Sell
4. Enter amount
5. Review price and fees
6. Confirm transaction

### Creator Benefits

- Earn 0.5% of all trading volume
- Automatic fee accumulation
- Claim fees anytime
- Vesting options for team tokens

## 🔧 Configuration

### Bonding Curve Parameters

- **Sell Percentage**: 51-80% of supply
- **Target SOL**: Minimum 30 SOL
- **Curve Types**:
  - Linear: Steady price increase
  - Exponential: Accelerating growth
  - Logarithmic: Decelerating growth

### Fee Structure

- Total Trading Fee: 1%
  - Creator: 0.5%
  - Community Pool: 0.5%
- Referral Fee: 0.1%

### Migration Settings

When bonding curve goal is reached:
- Liquidity migrates to AMM pool
- 90% of LP tokens burned
- 10% locked in Burn & Earn

## 🧪 Testing

```bash
# Run all tests
anchor test

# Run specific test file
anchor test tests/launchpad.ts

# Run with logging
RUST_LOG=debug anchor test
```

## 🔐 Security

- ✅ Slippage protection on trades
- ✅ Rug pull prevention (LP token burn)
- ✅ Input validation
- ✅ Overflow/underflow checks
- ⚠️ **Get audited before mainnet deployment**

## 📝 License

MIT License - see [LICENSE](./LICENSE) file

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

- GitHub Issues: Report bugs and request features
- Discord: Join Solana developer community
- Documentation: See DEVELOPMENT_GUIDE.md

## 🙏 Acknowledgments

- Raydium for inspiration
- Solana Foundation
- Anchor Framework team
- Solana developer community

---

**⚡ Built on Solana | Powered by Anchor**
