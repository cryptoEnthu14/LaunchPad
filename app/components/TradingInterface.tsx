'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'

interface TradingInterfaceProps {
  launch: any
}

export default function TradingInterface({ launch }: TradingInterfaceProps) {
  const { publicKey, signTransaction } = useWallet()
  const [mode, setMode] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTrade = async () => {
    if (!publicKey || !signTransaction) {
      alert('Please connect your wallet')
      return
    }

    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount')
      return
    }

    setLoading(true)

    try {
      // In production, interact with the Anchor program
      console.log(`${mode} ${amount} ${mode === 'buy' ? 'SOL' : 'tokens'}`)

      await new Promise(resolve => setTimeout(resolve, 2000))

      alert(`${mode === 'buy' ? 'Buy' : 'Sell'} successful!`)
      setAmount('')
    } catch (error) {
      console.error('Trade error:', error)
      alert('Trade failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const estimatedOutput = amount
    ? mode === 'buy'
      ? (parseFloat(amount) / launch.currentPrice).toFixed(2)
      : (parseFloat(amount) * launch.currentPrice).toFixed(6)
    : '0'

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('buy')}
          className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
            mode === 'buy'
              ? 'bg-green-500 text-white'
              : 'bg-radium-dark text-gray-400 hover:text-white'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setMode('sell')}
          className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
            mode === 'sell'
              ? 'bg-red-500 text-white'
              : 'bg-radium-dark text-gray-400 hover:text-white'
          }`}
        >
          Sell
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            You {mode === 'buy' ? 'pay' : 'sell'}
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="w-full px-4 py-3 bg-radium-dark border border-radium-purple/30 rounded-lg focus:border-radium-purple outline-none pr-20"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {mode === 'buy' ? 'SOL' : launch.symbol}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-8 h-8 bg-radium-purple/20 rounded-full flex items-center justify-center">
            ↓
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            You receive (estimated)
          </label>
          <div className="relative">
            <input
              type="text"
              value={estimatedOutput}
              readOnly
              className="w-full px-4 py-3 bg-radium-darker border border-radium-purple/20 rounded-lg outline-none pr-20 text-gray-300"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {mode === 'buy' ? launch.symbol : 'SOL'}
            </span>
          </div>
        </div>

        <div className="bg-radium-purple/10 border border-radium-purple/30 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Price Impact</span>
            <span className="text-white">~0.5%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Fee (1%)</span>
            <span className="text-white">
              {amount ? (parseFloat(amount) * 0.01).toFixed(6) : '0'} {mode === 'buy' ? 'SOL' : launch.symbol}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Slippage Tolerance</span>
            <span className="text-white">2%</span>
          </div>
        </div>

        <button
          onClick={handleTrade}
          disabled={loading || !amount || !publicKey}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!publicKey
            ? 'Connect Wallet'
            : loading
            ? 'Processing...'
            : mode === 'buy'
            ? 'Buy Tokens'
            : 'Sell Tokens'}
        </button>

        {publicKey && (
          <div className="text-center text-sm text-gray-400">
            <p>Balance: 10.5 {mode === 'buy' ? 'SOL' : launch.symbol}</p>
          </div>
        )}
      </div>
    </div>
  )
}
