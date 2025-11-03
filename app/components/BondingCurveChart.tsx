'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface BondingCurveChartProps {
  curveType: string
  progress: number
}

export default function BondingCurveChart({ curveType, progress }: BondingCurveChartProps) {
  // Generate curve data based on type
  const generateData = () => {
    const points = 100
    const data = []

    for (let i = 0; i <= points; i++) {
      const x = i / points
      let y = 0

      switch (curveType.toLowerCase()) {
        case 'linear':
          y = x
          break
        case 'exponential':
          y = Math.pow(x, 2)
          break
        case 'logarithmic':
          y = x < 0.01 ? 0 : Math.log(1 + x * 9) / Math.log(10)
          break
        default:
          y = x
      }

      data.push({
        supply: (x * 100).toFixed(0),
        price: (y * 100).toFixed(2),
        isCurrent: Math.abs(x * 100 - progress) < 1,
      })
    }

    return data
  }

  const data = generateData()

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8C6BE0" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8C6BE0" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis
            dataKey="supply"
            stroke="#888"
            label={{ value: 'Supply Sold (%)', position: 'insideBottom', offset: -5, fill: '#888' }}
          />
          <YAxis
            stroke="#888"
            label={{ value: 'Price', angle: -90, position: 'insideLeft', fill: '#888' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0F0F1E',
              border: '1px solid #8C6BE0',
              borderRadius: '8px',
            }}
            formatter={(value: any) => [`${value}`, 'Price']}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#8C6BE0"
            strokeWidth={2}
            fill="url(#colorPrice)"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-4 text-center text-sm text-gray-400">
        <p>Current position: {progress}% of bonding curve completed</p>
      </div>
    </div>
  )
}
