'use client'

import { useState } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'

interface CreateLaunchModalProps {
  onClose: () => void
}

export default function CreateLaunchModal({ onClose }: CreateLaunchModalProps) {
  const { publicKey, signTransaction } = useWallet()
  const { connection } = useConnection()

  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    uri: '',
    supply: '',
    sellPercentage: '70',
    targetSOL: '85',
    curveType: 'linear',
    migrateType: 'cpmm',
    cliffPeriod: '0',
    unlockPeriod: '0',
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!publicKey || !signTransaction) {
      alert('Please connect your wallet')
      return
    }

    setLoading(true)

    try {
      // In production, this would interact with the Anchor program
      console.log('Creating launch with data:', formData)

      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000))

      alert('Launch created successfully!')
      onClose()
    } catch (error) {
      console.error('Error creating launch:', error)
      alert('Error creating launch. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="glass max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Create Token Launch</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Token Name</label>
              <input
                type="text"
                required
                maxLength={32}
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 bg-radium-dark border border-radium-purple/30 rounded-lg focus:border-radium-purple outline-none"
                placeholder="e.g. My Amazing Token"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Symbol</label>
              <input
                type="text"
                required
                maxLength={10}
                value={formData.symbol}
                onChange={(e) => setFormData({...formData, symbol: e.target.value.toUpperCase()})}
                className="w-full px-4 py-2 bg-radium-dark border border-radium-purple/30 rounded-lg focus:border-radium-purple outline-none"
                placeholder="e.g. MAT"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Metadata URI</label>
              <input
                type="url"
                required
                value={formData.uri}
                onChange={(e) => setFormData({...formData, uri: e.target.value})}
                className="w-full px-4 py-2 bg-radium-dark border border-radium-purple/30 rounded-lg focus:border-radium-purple outline-none"
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Total Supply</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.supply}
                  onChange={(e) => setFormData({...formData, supply: e.target.value})}
                  className="w-full px-4 py-2 bg-radium-dark border border-radium-purple/30 rounded-lg focus:border-radium-purple outline-none"
                  placeholder="1000000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sell % (51-80%)</label>
                <input
                  type="number"
                  required
                  min="51"
                  max="80"
                  value={formData.sellPercentage}
                  onChange={(e) => setFormData({...formData, sellPercentage: e.target.value})}
                  className="w-full px-4 py-2 bg-radium-dark border border-radium-purple/30 rounded-lg focus:border-radium-purple outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Target SOL (min 30)</label>
              <input
                type="number"
                required
                min="30"
                value={formData.targetSOL}
                onChange={(e) => setFormData({...formData, targetSOL: e.target.value})}
                className="w-full px-4 py-2 bg-radium-dark border border-radium-purple/30 rounded-lg focus:border-radium-purple outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Bonding Curve</label>
                <select
                  value={formData.curveType}
                  onChange={(e) => setFormData({...formData, curveType: e.target.value})}
                  className="w-full px-4 py-2 bg-radium-dark border border-radium-purple/30 rounded-lg focus:border-radium-purple outline-none"
                >
                  <option value="linear">Linear</option>
                  <option value="exponential">Exponential</option>
                  <option value="logarithmic">Logarithmic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Pool Type</label>
                <select
                  value={formData.migrateType}
                  onChange={(e) => setFormData({...formData, migrateType: e.target.value})}
                  className="w-full px-4 py-2 bg-radium-dark border border-radium-purple/30 rounded-lg focus:border-radium-purple outline-none"
                >
                  <option value="cpmm">CPMM</option>
                  <option value="clmm">CLMM</option>
                </select>
              </div>
            </div>

            <div className="bg-radium-purple/10 border border-radium-purple/30 rounded-lg p-4">
              <p className="text-sm text-gray-300">
                <strong>Note:</strong> Once the bonding curve reaches {formData.targetSOL} SOL,
                liquidity will automatically migrate to a {formData.migrateType.toUpperCase()} pool.
                90% of LP tokens will be burned, 10% locked.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn-secondary"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Launch'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
