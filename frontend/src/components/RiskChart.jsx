import React from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart 
} from 'recharts'

const RiskChart = ({ predictionData, historicalData = [] }) => {
  // Sample historical data if none provided
  const defaultHistoricalData = [
    { month: 'Jan', riskLevel: 25, fires: 12 },
    { month: 'Feb', riskLevel: 30, fires: 18 },
    { month: 'Mar', riskLevel: 45, fires: 28 },
    { month: 'Apr', riskLevel: 65, fires: 42 },
    { month: 'May', riskLevel: 75, fires: 58 },
    { month: 'Jun', riskLevel: 85, fires: 73 },
    { month: 'Jul', riskLevel: 92, fires: 89 },
    { month: 'Aug', riskLevel: 88, fires: 81 },
    { month: 'Sep', riskLevel: 70, fires: 64 },
    { month: 'Oct', riskLevel: 55, fires: 38 },
    { month: 'Nov', riskLevel: 35, fires: 22 },
    { month: 'Dec', riskLevel: 28, fires: 15 }
  ]

  const riskDistributionData = [
    { name: 'Low Risk', value: 25, color: '#10b981' },
    { name: 'Medium Risk', value: 35, color: '#f59e0b' },
    { name: 'High Risk', value: 30, color: '#fb923c' },
    { name: 'Extreme Risk', value: 10, color: '#ef4444' }
  ]

  const factorsData = [
    { factor: 'Temperature', impact: 85 },
    { factor: 'Humidity', impact: 75 },
    { factor: 'Wind Speed', impact: 60 },
    { factor: 'Fire Weather Index', impact: 90 },
    { factor: 'Pressure', impact: 35 }
  ]

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 p-3 rounded-lg border border-cyan-500/30 shadow-lg">
          <p className="text-cyan-400 font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${entry.value}${entry.dataKey === 'riskLevel' ? '%' : ''}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Current Prediction Display */}
      {predictionData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="modern-card p-6"
        >
          <h3 className="text-xl font-bold gradient-text mb-4">
            📊 Current Prediction
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 risk-${predictionData.fire_risk?.toLowerCase() || 'unknown'}`}>
                {predictionData.fire_risk || 'Unknown'}
              </div>
              <div className="text-gray-400 text-sm">Risk Level</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-400 mb-2">
                {predictionData.probability ? `${(predictionData.probability * 100).toFixed(1)}%` : 'N/A'}
              </div>
              <div className="text-gray-400 text-sm">Fire Probability</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">
                {predictionData.confidence ? `${(predictionData.confidence * 100).toFixed(1)}%` : 'N/A'}
              </div>
              <div className="text-gray-400 text-sm">Model Confidence</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Historical Risk Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="modern-card p-6"
      >
        <h3 className="text-xl font-bold gradient-text mb-4">
          📈 Historical Risk Trends
        </h3>
        
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={historicalData.length ? historicalData : defaultHistoricalData}>
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="month" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip content={customTooltip} />
            <Area 
              type="monotone" 
              dataKey="riskLevel" 
              stroke="#6366f1" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorRisk)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="modern-card p-6"
        >
          <h3 className="text-xl font-bold gradient-text mb-4">
            🥧 Risk Distribution
          </h3>
          
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={riskDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {riskDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Risk Factors Impact */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="modern-card p-6"
        >
          <h3 className="text-xl font-bold gradient-text mb-4">
            🎯 Risk Factors Impact
          </h3>
          
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={factorsData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" domain={[0, 100]} stroke="#ccc" />
              <YAxis dataKey="factor" type="category" stroke="#ccc" />
              <Tooltip content={customTooltip} />
              <Bar dataKey="impact" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Fire Incidents vs Risk Level */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="modern-card p-6"
      >
        <h3 className="text-xl font-bold gradient-text mb-4">
          🔥 Fire Incidents vs Risk Level
        </h3>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historicalData.length ? historicalData : defaultHistoricalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="month" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip content={customTooltip} />
            <Line 
              type="monotone" 
              dataKey="riskLevel" 
              stroke="#6366f1" 
              strokeWidth={3}
              dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="fires" 
              stroke="#fb923c" 
              strokeWidth={3}
              dot={{ fill: '#fb923c', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        <div className="flex justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-indigo-500 rounded"></div>
            <span>Risk Level (%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-400 rounded"></div>
            <span>Fire Incidents</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default RiskChart
