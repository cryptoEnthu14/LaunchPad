'use client'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

interface HeaderProps {
  onCreateClick: () => void
}

export default function Header({ onCreateClick }: HeaderProps) {
  return (
    <header className="glass sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-radium rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold">R</span>
            </div>
            <span className="text-2xl font-bold">Radium Launchpad</span>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Launches
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              My Tokens
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Docs
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={onCreateClick}
              className="btn-primary"
            >
              Create Token
            </button>
            <WalletMultiButton className="!bg-gradient-radium" />
          </div>
        </div>
      </div>
    </header>
  )
}
