'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import TradingInterface from './TradingInterface'
import BondingCurveChart from './BondingCurveChart'

interface LaunchDetailProps {
  launchAddress: string
  onBack: () => void
}

export default function LaunchDetail({ launchAddress, onBack }: LaunchDetailProps) {
  const { publicKey } = useWallet()
  const [activeTab, setActiveTab] = useState<'trade' | 'info'>('trade')

  // Mock data - in production, fetch from blockchain
  const launch = {
    name: 'Example Token',
    symbol: 'EXMP',
    creator: '7xKXt...9YuLj',
    progress: 65,
    solRaised: 55.5,
    targetSol: 85,
    curveType: 'Linear',
    status: 'active',
    totalSupply: 1000000000,
    sellAmount: 700000000,
    tokensSold: 455000000,
    currentPrice: 0.000000122,
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-gray-400 hover:text-white transition-colors"
      >
        ← Back to Launches
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Token info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-radium rounded-full flex items-center justify-center text-2xl font-bold">
                {launch.symbol[0]}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{launch.name}</h1>
                <p className="text-gray-400">{launch.symbol}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Progress</span>
                  <span className="font-semibold">{launch.progress}%</span>
                </div>
                <div className="w-full h-3 bg-radium-darker rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-radium transition-all duration-500"
                    style={{ width: `${launch.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t border-radium-purple/20 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Raised</span>
                  <span className="font-semibold">{launch.solRaised} SOL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Target</span>
                  <span className="font-semibold">{launch.targetSol} SOL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Price</span>
                  <span className="font-semibold">{launch.currentPrice.toFixed(9)} SOL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Curve Type</span>
                  <span className="font-semibold text-radium-purple">{launch.curveType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Creator</span>
                  <span className="font-mono text-sm">{launch.creator}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-6">
            <h3 className="font-bold mb-4">Tokenomics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Supply</span>
                <span className="font-semibold">{(launch.totalSupply / 1e9).toFixed(2)}B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Bonding Curve</span>
                <span className="font-semibold">{(launch.sellAmount / 1e9).toFixed(2)}B</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tokens Sold</span>
                <span className="font-semibold">{(launch.tokensSold / 1e9).toFixed(2)}B</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Trading and chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-6">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setActiveTab('trade')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'trade'
                    ? 'bg-radium-purple text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Trade
              </button>
              <button
                onClick={() => setActiveTab('info')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'info'
                    ? 'bg-radium-purple text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Info
              </button>
            </div>

            {activeTab === 'trade' ? (
              <TradingInterface launch={launch} />
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">About {launch.name}</h3>
                <p className="text-gray-400">
                  This is a token launched on the Radium Launchpad with a {launch.curveType.toLowerCase()} bonding curve.
                  Once the target of {launch.targetSol} SOL is reached, liquidity will automatically migrate to an AMM pool.
                </p>
              </div>
            )}
          </div>

          <div className="glass p-6">
            <h3 className="text-xl font-bold mb-4">Bonding Curve</h3>
            <BondingCurveChart curveType={launch.curveType} progress={launch.progress} />
          </div>
        </div>
      </div>
    </div>
  )
}
