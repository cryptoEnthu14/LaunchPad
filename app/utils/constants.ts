import { PublicKey } from '@solana/web3.js'

export const NETWORK = process.env.NEXT_PUBLIC_NETWORK || 'devnet'

export const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT ||
  NETWORK === 'mainnet-beta'
    ? 'https://api.mainnet-beta.solana.com'
    : 'https://api.devnet.solana.com'

export const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_ID || 'DRay6fNdQ5J82H7xV6uq2aV3mNrUZ1J4PgSKsWgptcm6'
)

export const MIN_SOL_TARGET = 30
export const MIN_SELL_PERCENTAGE = 51
export const MAX_SELL_PERCENTAGE = 80
export const BASE_FEE_PERCENTAGE = 100 // 1% in basis points
export const REFERRAL_FEE_PERCENTAGE = 10 // 0.1% in basis points

export const LAMPORTS_PER_SOL = 1_000_000_000

export enum CurveType {
  Linear,
  Exponential,
  Logarithmic,
}

export enum MigrateType {
  CPMM,
  CLMM,
}

export enum LaunchStatus {
  Active,
  Migrated,
  Cancelled,
}
