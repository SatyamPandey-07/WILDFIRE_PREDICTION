import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Loader2, Thermometer, Droplets, Wind, Gauge, Flame, CloudRain, Sun, Activity } from 'lucide-react'

const FireRiskForm = ({ onPredictionResult }) => {
  const [formData, setFormData] = useState({
    temperature: '',
    relative_humidity: '',
    wind_speed: '',
    atmospheric_pressure: '',
    fire_weather_index: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const fieldConfig = [
    {
      name: 'temperature',
      label: 'Temperature',
      icon: Thermometer,
      placeholder: '15-45',
      suffix: '°C',
      description: 'Ambient air temperature in Celsius',
      min: -10,
      max: 50
    },
    {
      name: 'relative_humidity',
      label: 'Relative Humidity',
      icon: Droplets,
      placeholder: '10-90',
      suffix: '%',
      description: 'Percentage of moisture in the air',
      min: 0,
      max: 100
    },
    {
      name: 'wind_speed',
      label: 'Wind Speed',
      icon: Wind,
      placeholder: '0-30',
      suffix: 'km/h',
      description: 'Average wind speed in kilometers per hour',
      min: 0,
      max: 100
    },
    {
      name: 'atmospheric_pressure',
      label: 'Atmospheric Pressure',
      icon: Gauge,
      placeholder: '950-1050',
      suffix: 'hPa',
      description: 'Barometric pressure in hectopascals',
      min: 900,
      max: 1100
    },
    {
      name: 'fire_weather_index',
      label: 'Fire Weather Index',
      icon: Activity,
      placeholder: '0-50',
      suffix: 'FWI',
      description: 'Composite index of fire danger conditions',
      min: 0,
      max: 100
    }
  ]

  const validateField = (name, value) => {
    const config = fieldConfig.find(field => field.name === name)
    if (!config) return null

    const numValue = parseFloat(value)
    
    if (!value || value.trim() === '') {
      return `${config.label} is required`
    }
    
    if (isNaN(numValue)) {
      return `${config.label} must be a valid number`
    }
    
    if (numValue < config.min || numValue > config.max) {
      return `${config.label} must be between ${config.min} and ${config.max}`
    }
    
    return null
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors = {}
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key])
      if (error) newErrors[key] = error
    })
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          temperature: parseFloat(formData.temperature),
          relative_humidity: parseFloat(formData.relative_humidity),
          wind_speed: parseFloat(formData.wind_speed),
          atmospheric_pressure: parseFloat(formData.atmospheric_pressure),
          fire_weather_index: parseFloat(formData.fire_weather_index)
        }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.error) {
        onPredictionResult({ error: result.error })
      } else {
        onPredictionResult(result)
      }

    } catch (error) {
      console.error('Prediction request failed:', error)
      onPredictionResult({ 
        error: `Failed to get prediction: ${error.message}. Please ensure the backend server is running.` 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fillSampleData = () => {
    const sampleData = {
      temperature: '28.5',
      relative_humidity: '45',
      wind_speed: '15',
      atmospheric_pressure: '1013',
      fire_weather_index: '12'
    }
    setFormData(sampleData)
    setErrors({})
  }

  return (
    <div className="space-y-6">
      {/* Sample Data Button */}
      <div className="text-center">
        <button
          type="button"
          onClick={fillSampleData}
          className="btn-outline"
          disabled={isLoading}
        >
          <Sun className="w-4 h-4 mr-2" />
          Load Sample Data
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Input Fields */}
        <div className="space-y-6">
          {fieldConfig.map((field, index) => (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="space-y-2"
            >
              <label className="input-label">
                <field.icon className="w-4 h-4 mr-2" />
                {field.label}
              </label>
              
              <div className="relative">
                <input
                  type="number"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  step="0.1"
                  min={field.min}
                  max={field.max}
                  className={`input-field pr-12 ${errors[field.name] ? 'input-error' : ''}`}
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted text-sm font-medium">
                  {field.suffix}
                </div>
              </div>
              
              {errors[field.name] && (
                <p className="text-sm text-destructive mt-1">
                  {errors[field.name]}
                </p>
              )}
              
              <p className="text-xs text-muted">
                {field.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="pt-4"
        >
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                Analyzing Risk...
              </>
            ) : (
              <>
                <Flame className="w-5 h-5 mr-3" />
                Predict Fire Risk
              </>
            )}
          </button>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="info-box"
        >
          <CloudRain className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <p className="font-medium text-foreground mb-1">
              Professional Weather Data Required
            </p>
            <p className="text-sm text-muted">
              For optimal accuracy, input current meteorological measurements from certified weather stations. 
              Sample data is provided for demonstration purposes only.
            </p>
          </div>
        </motion.div>
      </form>
    </div>
  )
}

export default FireRiskForm
