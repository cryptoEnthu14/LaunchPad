'use client'

import { useState } from 'react'
import Header from './components/Header'
import LaunchList from './components/LaunchList'
import CreateLaunchModal from './components/CreateLaunchModal'
import LaunchDetail from './components/LaunchDetail'

export default function Home() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedLaunch, setSelectedLaunch] = useState<string | null>(null)

  return (
    <main className="min-h-screen">
      <Header onCreateClick={() => setShowCreateModal(true)} />

      <div className="container mx-auto px-4 py-8">
        {selectedLaunch ? (
          <LaunchDetail
            launchAddress={selectedLaunch}
            onBack={() => setSelectedLaunch(null)}
          />
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-radium bg-clip-text text-transparent mb-4">
                Token Launchpad
              </h1>
              <p className="text-gray-400">
                Launch your token with customizable bonding curves on Solana
              </p>
            </div>

            <LaunchList onSelectLaunch={setSelectedLaunch} />
          </>
        )}
      </div>

      {showCreateModal && (
        <CreateLaunchModal onClose={() => setShowCreateModal(false)} />
      )}
    </main>
  )
}
