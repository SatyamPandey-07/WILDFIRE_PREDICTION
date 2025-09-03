import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import { motion } from 'framer-motion'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const FireMap = () => {
  const [fireData, setFireData] = useState([])
  const [loading, setLoading] = useState(true)

  // Sample fire risk data (in a real app, this would come from your API)
  useEffect(() => {
    // Simulate loading fire risk data
    setTimeout(() => {
      const sampleData = [
        {
          id: 1,
          lat: 34.0522,
          lon: -118.2437,
          location: 'Los Angeles, CA',
          riskLevel: 'High',
          probability: 0.78,
          temperature: 32.5,
          humidity: 25.3,
          windSpeed: 18.7
        },
        {
          id: 2,
          lat: 37.7749,
          lon: -122.4194,
          location: 'San Francisco, CA',
          riskLevel: 'Medium',
          probability: 0.45,
          temperature: 22.1,
          humidity: 65.2,
          windSpeed: 12.3
        },
        {
          id: 3,
          lat: 39.7392,
          lon: -104.9903,
          location: 'Denver, CO',
          riskLevel: 'Low',
          probability: 0.23,
          temperature: 18.9,
          humidity: 45.6,
          windSpeed: 8.4
        },
        {
          id: 4,
          lat: 33.4484,
          lon: -112.0740,
          location: 'Phoenix, AZ',
          riskLevel: 'Extreme',
          probability: 0.89,
          temperature: 38.7,
          humidity: 15.8,
          windSpeed: 22.1
        },
        {
          id: 5,
          lat: 45.5152,
          lon: -122.6784,
          location: 'Portland, OR',
          riskLevel: 'Medium',
          probability: 0.38,
          temperature: 24.2,
          humidity: 55.4,
          windSpeed: 14.6
        }
      ]
      setFireData(sampleData)
      setLoading(false)
    }, 1000)
  }, [])

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Low':
        return '#10b981'
      case 'Medium':
        return '#f59e0b'
      case 'High':
        return '#fb923c'
      case 'Extreme':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  const getRiskRadius = (probability) => {
    return Math.max(50000, probability * 100000) // Base radius with scaling
  }

  const createCustomIcon = (riskLevel) => {
    const color = getRiskColor(riskLevel)
    return L.divIcon({
      html: `
        <div style="
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: ${color};
          border: 2px solid white;
          box-shadow: 0 0 10px ${color};
          animation: pulse 2s infinite;
        "></div>
        <style>
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
        </style>
      `,
      className: 'custom-fire-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    })
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="modern-card p-8 text-center"
      >
        <div className="loading-spinner mx-auto mb-4"></div>
        <p className="text-gray-400">Loading fire risk map...</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="modern-card overflow-hidden"
    >
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-2xl font-bold gradient-text mb-2">
          🗺️ Fire Risk Map
        </h3>
        <p className="text-gray-400">
          Interactive map showing wildfire risk levels across different locations
        </p>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4">
          {['Low', 'Medium', 'High', 'Extreme'].map(risk => (
            <div key={risk} className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ 
                  backgroundColor: getRiskColor(risk),
                  boxShadow: `0 0 8px ${getRiskColor(risk)}`
                }}
              ></div>
              <span className={`text-sm font-medium risk-${risk.toLowerCase()}`}>
                {risk} Risk
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-96 relative">
        <MapContainer
          center={[39.8283, -98.5795]} // Center of USA
          zoom={4}
          style={{ height: '100%', width: '100%' }}
          className="rounded-b-lg"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {fireData.map((location) => (
            <React.Fragment key={location.id}>
              {/* Risk area circle */}
              <Circle
                center={[location.lat, location.lon]}
                radius={getRiskRadius(location.probability)}
                pathOptions={{
                  fillColor: getRiskColor(location.riskLevel),
                  fillOpacity: 0.2,
                  color: getRiskColor(location.riskLevel),
                  weight: 2,
                  opacity: 0.6
                }}
              />
              
              {/* Location marker */}
              <Marker
                position={[location.lat, location.lon]}
                icon={createCustomIcon(location.riskLevel)}
              >
                <Popup className="custom-popup">
                  <div className="p-3 bg-gray-900 rounded-lg text-white min-w-48">
                    <h4 className="font-bold text-lg gradient-text mb-2">
                      {location.location}
                    </h4>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Risk Level:</span>
                        <span className={`font-bold risk-${location.riskLevel.toLowerCase()}`}>
                          {location.riskLevel}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Probability:</span>
                        <span className="font-bold text-indigo-400">
                          {(location.probability * 100).toFixed(1)}%
                        </span>
                      </div>
                      
                      <div className="border-t border-gray-600 pt-2 mt-2">
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <div className="text-red-400">🌡️</div>
                            <div>{location.temperature}°C</div>
                          </div>
                          <div className="text-center">
                            <div className="text-blue-400">💧</div>
                            <div>{location.humidity}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-400">💨</div>
                            <div>{location.windSpeed} km/h</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}
        </MapContainer>
      </div>
    </motion.div>
  )
}

export default FireMap
