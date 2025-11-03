'use client'

interface LaunchCardProps {
  launch: {
    name: string
    symbol: string
    progress: number
    solRaised: number
    targetSol: number
    curveType: string
    status: string
  }
  onClick: () => void
}

export default function LaunchCard({ launch, onClick }: LaunchCardProps) {
  return (
    <div
      onClick={onClick}
      className="glass p-6 cursor-pointer card-hover"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold">{launch.name}</h3>
          <p className="text-gray-400">{launch.symbol}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          launch.status === 'active'
            ? 'bg-green-500/20 text-green-400'
            : 'bg-blue-500/20 text-blue-400'
        }`}>
          {launch.status.toUpperCase()}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Progress</span>
          <span className="font-semibold">{launch.progress}%</span>
        </div>
        <div className="w-full h-2 bg-radium-darker rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-radium transition-all duration-500"
            style={{ width: `${launch.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Raised</span>
          <span className="font-semibold">{launch.solRaised.toFixed(2)} SOL</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Target</span>
          <span className="font-semibold">{launch.targetSol} SOL</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Curve</span>
          <span className="font-semibold text-radium-purple">{launch.curveType}</span>
        </div>
      </div>

      <button className="w-full mt-4 btn-primary">
        View Details
      </button>
    </div>
  )
}
