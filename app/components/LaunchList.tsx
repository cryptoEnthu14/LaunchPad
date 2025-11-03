'use client'

import { useState, useEffect } from 'react'
import { useConnection } from '@solana/wallet-adapter-react'
import LaunchCard from './LaunchCard'

interface LaunchListProps {
  onSelectLaunch: (address: string) => void
}

export default function LaunchList({ onSelectLaunch }: LaunchListProps) {
  const { connection } = useConnection()
  const [launches, setLaunches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'migrated'>('all')

  useEffect(() => {
    // In production, fetch actual launches from the blockchain
    // For now, showing mock data
    const mockLaunches = [
      {
        address: '1111111111111111111111111111111111111111',
        name: 'Example Token',
        symbol: 'EXMP',
        progress: 65,
        solRaised: 55.5,
        targetSol: 85,
        curveType: 'Linear',
        status: 'active',
      },
      {
        address: '2222222222222222222222222222222222222222',
        name: 'Demo Coin',
        symbol: 'DEMO',
        progress: 92,
        solRaised: 78.2,
        targetSol: 85,
        curveType: 'Exponential',
        status: 'active',
      },
    ]

    setTimeout(() => {
      setLaunches(mockLaunches)
      setLoading(false)
    }, 1000)
  }, [connection])

  const filteredLaunches = launches.filter(launch => {
    if (filter === 'all') return true
    return launch.status === filter
  })

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-radium-purple text-white'
              : 'bg-radium-dark text-gray-400 hover:text-white'
          }`}
        >
          All Launches
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'active'
              ? 'bg-radium-purple text-white'
              : 'bg-radium-dark text-gray-400 hover:text-white'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('migrated')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'migrated'
              ? 'bg-radium-purple text-white'
              : 'bg-radium-dark text-gray-400 hover:text-white'
          }`}
        >
          Migrated
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass h-64 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLaunches.map(launch => (
            <LaunchCard
              key={launch.address}
              launch={launch}
              onClick={() => onSelectLaunch(launch.address)}
            />
          ))}
        </div>
      )}

      {!loading && filteredLaunches.length === 0 && (
        <div className="glass p-12 text-center">
          <p className="text-gray-400 text-lg">No launches found</p>
        </div>
      )}
    </div>
  )
}
