import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import { AnchorWallet } from '@solana/wallet-adapter-react'

// Program ID (update with your deployed program ID)
export const PROGRAM_ID = new PublicKey('DRay6fNdQ5J82H7xV6uq2aV3mNrUZ1J4PgSKsWgptcm6')

export const getProvider = (connection: Connection, wallet: AnchorWallet) => {
  return new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
  })
}

export const getProgram = (provider: AnchorProvider, idl: Idl) => {
  return new Program(idl, PROGRAM_ID, provider)
}

// PDA helpers
export const getConfigPDA = () => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('config')],
    PROGRAM_ID
  )
}

export const getLaunchPDA = (mint: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('launch'), mint.toBuffer()],
    PROGRAM_ID
  )
}

export const getMintPDA = (creator: PublicKey, name: string) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('mint'), creator.toBuffer(), Buffer.from(name)],
    PROGRAM_ID
  )
}

export const getUserPositionPDA = (launch: PublicKey, user: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('position'), launch.toBuffer(), user.toBuffer()],
    PROGRAM_ID
  )
}

export const getReferralPDA = (launch: PublicKey, referrer: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('referral'), launch.toBuffer(), referrer.toBuffer()],
    PROGRAM_ID
  )
}
