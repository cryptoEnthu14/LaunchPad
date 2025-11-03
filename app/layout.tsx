import type { Metadata } from 'next'
import './globals.css'
import { WalletProvider } from './contexts/WalletProvider'

export const metadata: Metadata = {
  title: 'Radium Launchpad - Launch Your Token on Solana',
  description: 'Create, launch, and trade tokens on Solana with bonding curves',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}
