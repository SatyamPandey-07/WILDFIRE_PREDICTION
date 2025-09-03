import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart, RadialBarChart, RadialBar 
} from 'recharts'

const RiskChart = ({ predictionData, historicalData = [] }) => {
  const [realData, setRealData] = useState(null)
  const [correlations, setCorrelations] = useState(null)
  const [riskDistribution, setRiskDistribution] = useState(null)
  const [outlierData, setOutlierData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRealData()
  }, [])

  const fetchRealData = async () => {
    try {
      setLoading(true)
      
      // Fetch multiple data sources in parallel
      const [trendsRes, correlationsRes, riskDistRes, outliersRes] = await Promise.all([
        fetch('http://localhost:5000/api/historical-trends'),
        fetch('http://localhost:5000/api/correlations'),
        fetch('http://localhost:5000/api/risk-distribution'),
        fetch('http://localhost:5000/api/outlier-analysis')
      ])

      const trends = await trendsRes.json()
      const correlationsData = await correlationsRes.json()
      const riskDist = await riskDistRes.json()
      const outliers = await outliersRes.json()

      if (trends.success) setRealData(trends.data)
      if (correlationsData.success) setCorrelations(correlationsData.data)
      if (riskDist.success) setRiskDistribution(riskDist.data)
      if (outliers.success) setOutlierData(outliers.data)
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching real data:', error)
      setLoading(false)
    }
  }

  // Use real data if available, fallback to default
  const defaultHistoricalData = realData || [
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

  // Real correlation data for factors
  const factorsData = correlations?.top_positive_correlations?.map(item => ({
    factor: item.feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    impact: Math.abs(item.correlation * 100),
    correlation: item.correlation
  })) || [
    { factor: 'Day Night', impact: 29.3, correlation: 0.293 },
    { factor: 'FRP', impact: 29.0, correlation: 0.290 },
    { factor: 'Humidity Min', impact: 13.8, correlation: 0.138 },
    { factor: 'Fire Weather Index', impact: 12.7, correlation: 0.127 },
    { factor: 'Temp Range', impact: 11.9, correlation: 0.119 }
  ]

  // Real risk distribution data
  const riskDistributionData = riskDistribution?.distribution?.map(item => ({
    name: item.name,
    value: item.percentage,
    count: item.value,
    color: item.color || getDefaultRiskColor(item.name)
  })) || [
    { name: 'Low Risk', value: 25, color: '#10b981' },
    { name: 'Medium Risk', value: 35, color: '#f59e0b' },
    { name: 'High Risk', value: 30, color: '#fb923c' },
    { name: 'Extreme Risk', value: 10, color: '#ef4444' }
  ]

  // Data quality indicators from outlier analysis
  const dataQualityData = outlierData ? Object.entries(outlierData).map(([feature, data]) => ({
    feature: feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    quality: 100 - data.percentage,
    outliers: data.percentage,
    count: data.outlier_count
  })) : [
    { feature: 'Temperature', quality: 97.2, outliers: 2.8, count: 3338 },
    { feature: 'Humidity', quality: 98.9, outliers: 1.1, count: 1358 },
    { feature: 'Wind Speed', quality: 96.9, outliers: 3.1, count: 3735 },
    { feature: 'Fire Weather Index', quality: 92.6, outliers: 7.4, count: 8855 }
  ]

  function getDefaultRiskColor(riskLevel) {
    switch (riskLevel) {
      case 'Low': return '#10b981'
      case 'Medium': return '#f59e0b'
      case 'High': return '#fb923c'
      case 'Extreme': return '#ef4444'
      default: return '#6b7280'
    }
  }

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
      {loading && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted">Loading real-time data...</p>
        </motion.div>
      )}

      {/* Current Prediction Display */}
      {predictionData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="modern-card p-6"
        >
          <h3 className="text-xl font-bold gradient-text mb-4">
            📊 Current Prediction Analysis
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

      {/* Real Correlation-Based Factor Impact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="modern-card p-6"
      >
        <h3 className="text-xl font-bold gradient-text mb-4">
          🔗 Fire Risk Correlation Analysis
        </h3>
        <p className="text-sm text-muted mb-4">
          Based on analysis of {correlations ? '118K+' : 'sample'} fire incidents - Real correlation data
        </p>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={factorsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="factor" 
              stroke="#9CA3AF" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#9CA3AF" />
            <Tooltip content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="bg-gray-900 p-3 rounded-lg border border-cyan-500/30 shadow-lg">
                    <p className="text-cyan-400 font-medium">{label}</p>
                    <p className="text-white text-sm">
                      Impact: {payload[0].value.toFixed(1)}%
                    </p>
                    {data.correlation && (
                      <p className="text-gray-300 text-xs">
                        Correlation: {data.correlation.toFixed(3)}
                      </p>
                    )}
                  </div>
                )
              }
              return null
            }} />
            <Bar 
              dataKey="impact" 
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Real Risk Distribution and Data Quality */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="modern-card p-6"
        >
          <h3 className="text-xl font-bold gradient-text mb-4">
            📈 Historical Risk Distribution
          </h3>
          <p className="text-sm text-muted mb-4">
            Real data from {riskDistribution ? 'actual dataset' : 'sample analysis'}
          </p>
          
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={riskDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {riskDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="bg-gray-900 p-3 rounded-lg border border-cyan-500/30 shadow-lg">
                      <p className="text-cyan-400 font-medium">{data.name}</p>
                      <p className="text-white text-sm">
                        {data.value.toFixed(1)}% of cases
                      </p>
                      {data.count && (
                        <p className="text-gray-300 text-xs">
                          {data.count.toLocaleString()} incidents
                        </p>
                      )}
                    </div>
                  )
                }
                return null
              }} />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            {riskDistributionData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-300">
                  {item.name}: {item.value.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Data Quality Analysis from Real Outlier Detection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="modern-card p-6"
        >
          <h3 className="text-xl font-bold gradient-text mb-4">
            🎯 Data Quality Indicators
          </h3>
          <p className="text-sm text-muted mb-4">
            Real outlier analysis from notebook data
          </p>
          
          <div className="space-y-4">
            {dataQualityData.slice(0, 4).map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-300">{item.feature}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-green-400">{item.quality.toFixed(1)}% Clean</span>
                    <span className="text-xs text-yellow-400">{item.outliers.toFixed(1)}% Outliers</span>
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full"
                    style={{ width: `${item.quality}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Clean data: {((item.quality/100) * 118858).toFixed(0)} records</span>
                  <span>Outliers: {item.count?.toLocaleString() || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Historical Trends with Real Seasonal Data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="modern-card p-6"
      >
        <h3 className="text-xl font-bold gradient-text mb-4">
          📅 Seasonal Fire Risk Patterns
        </h3>
        <p className="text-sm text-muted mb-4">
          {realData ? 'Analysis based on real seasonal patterns' : 'Simulated seasonal fire patterns based on climate data'}
        </p>
        
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={historicalData.length > 0 ? historicalData : defaultHistoricalData}>
            <defs>
              <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fireGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip content={customTooltip} />
            <Area 
              type="monotone" 
              dataKey="riskLevel" 
              stroke="#f59e0b" 
              fill="url(#riskGradient)"
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="fires" 
              stroke="#ef4444" 
              fill="url(#fireGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
        
        <div className="flex justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-amber-500 rounded"></div>
            <span>Risk Level (%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Fire Incidents</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default RiskChart
