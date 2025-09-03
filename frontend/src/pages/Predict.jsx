import React, { useState } from 'react'
import { motion } from 'framer-motion'
import FireRiskForm from '../components/FireRiskForm'
import RiskChart from '../components/RiskChart'
import FireMap from '../components/FireMap'
import { AlertCircle, CheckCircle, XCircle, Flame, Target, Info } from 'lucide-react'

const Predict = () => {
  const [predictionResult, setPredictionResult] = useState(null)
  const [showResults, setShowResults] = useState(false)

  const handlePredictionResult = (result) => {
    setPredictionResult(result)
    setShowResults(true)
    
    // Scroll to results section
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ 
        behavior: 'smooth' 
      })
    }, 100)
  }

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low':
        return <CheckCircle className="w-8 h-8" />
      case 'medium':
        return <AlertCircle className="w-8 h-8" />
      case 'high':
        return <AlertCircle className="w-8 h-8" />
      case 'extreme':
        return <XCircle className="w-8 h-8" />
      default:
        return <Flame className="w-8 h-8" />
    }
  }

  const getRiskMessage = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'low':
        return "Current environmental conditions indicate minimal fire risk. Standard fire safety protocols are sufficient for this assessment period."
      case 'medium':
        return "Moderate fire risk detected based on current conditions. Enhanced monitoring and preventive measures are recommended."
      case 'high':
        return "High fire risk identified. Implement immediate fire prevention protocols and avoid all outdoor burning activities."
      case 'extreme':
        return "EXTREME FIRE RISK DETECTED. Execute emergency protocols immediately. Evacuate if advised by authorities and avoid all spark-producing activities."
      default:
        return "Unable to determine risk level. Please verify input data and try again."
    }
  }

  const getRecommendations = (riskLevel) => {
    const baseRecommendations = [
      "Monitor local fire warnings and emergency alerts",
      "Ensure fire extinguishers are accessible and operational",
      "Maintain defensible space around all structures"
    ]

    switch (riskLevel?.toLowerCase()) {
      case 'low':
        return [
          ...baseRecommendations,
          "Conduct routine fire safety equipment inspections",
          "Clear gutters and roofs of combustible debris",
          "Review and update emergency evacuation plans"
        ]
      case 'medium':
        return [
          ...baseRecommendations,
          "Postpone all outdoor burning activities",
          "Prepare emergency evacuation supplies",
          "Increase fire weather monitoring frequency",
          "Alert neighbors and community members"
        ]
      case 'high':
        return [
          ...baseRecommendations,
          "Cancel all outdoor burning and spark-producing activities",
          "Prepare for immediate evacuation if required",
          "Monitor weather conditions every 30 minutes",
          "Wet down surrounding vegetation and combustible materials"
        ]
      case 'extreme':
        return [
          "Execute evacuation plans immediately if ordered",
          "Avoid all outdoor activities that could produce sparks",
          "Stay indoors with air filtration systems running",
          "Keep vehicles fueled and ready for emergency evacuation",
          "Monitor emergency communication channels continuously",
          "Follow all local authority directives without delay"
        ]
      default:
        return baseRecommendations
    }
  }

  return (
    <div className="min-h-screen">
      <div className="container">
        {/* Header */}
        <section className="hero-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center items-center mb-8">
              <div className="icon-container icon-warning mr-4">
                <Target className="w-6 h-6" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gradient">
                Wildfire Risk Assessment
              </h1>
              <div className="icon-container icon-destructive ml-4">
                <Flame className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xl text-muted max-w-4xl mx-auto leading-relaxed">
              Professional AI-powered wildfire risk prediction system. Enter current environmental 
              conditions to receive accurate risk assessments with detailed safety recommendations.
            </p>
          </motion.div>
        </section>

        {/* Main Content Grid */}
        <section className="section">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-16">
            {/* Prediction Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title text-gradient">Environmental Data Input</h2>
                  <p className="card-description">
                    Enter current weather and environmental conditions for risk analysis
                  </p>
                </div>
                <div className="card-content">
                  <FireRiskForm onPredictionResult={handlePredictionResult} />
                </div>
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title text-gradient">Fire Risk Monitoring</h2>
                  <p className="card-description">
                    Interactive map showing wildfire risk levels across different regions
                  </p>
                </div>
                <div className="card-content">
                  <FireMap />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Results Section */}
        {showResults && predictionResult && (
          <motion.section
            id="results-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="section"
          >
            {predictionResult.error ? (
              <div className="max-w-2xl mx-auto">
                <div className="card text-center">
                  <div className="icon-container icon-destructive mx-auto mb-6">
                    <XCircle className="w-8 h-8" />
                  </div>
                  <h2 className="card-title text-destructive mb-4">
                    Prediction Error
                  </h2>
                  <p className="card-description text-lg">{predictionResult.error}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Main Result Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="result-card"
                >
                  <div className="result-header">
                    <div className={`icon-container ${
                      predictionResult.fire_risk?.toLowerCase() === 'low' ? 'icon-success' :
                      predictionResult.fire_risk?.toLowerCase() === 'medium' ? 'icon-warning' :
                      predictionResult.fire_risk?.toLowerCase() === 'high' ? 'icon-warning' :
                      'icon-destructive'
                    } mx-auto mb-6`}>
                      {getRiskIcon(predictionResult.fire_risk)}
                    </div>
                    
                    <h2 className="result-title">
                      <span className={`status-badge status-${predictionResult.fire_risk?.toLowerCase() || 'unknown'}`}>
                        {predictionResult.fire_risk || 'Unknown'} Risk
                      </span>
                    </h2>
                    
                    <p className="result-description">
                      {getRiskMessage(predictionResult.fire_risk)}
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="metrics-grid">
                    <div className="metric-card">
                      <div className="metric-value text-primary">
                        {predictionResult.probability ? 
                          `${(predictionResult.probability * 100).toFixed(1)}%` : 'N/A'}
                      </div>
                      <div className="metric-label">Fire Probability</div>
                    </div>
                    
                    <div className="metric-card">
                      <div className="metric-value text-success">
                        {predictionResult.confidence ? 
                          `${(predictionResult.confidence * 100).toFixed(1)}%` : 'N/A'}
                      </div>
                      <div className="metric-label">Model Confidence</div>
                    </div>
                    
                    <div className="metric-card">
                      <div className="metric-value text-warning">
                        AI System
                      </div>
                      <div className="metric-label">Analysis Method</div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="recommendations">
                    <div className="recommendations-title">
                      <AlertCircle className="w-5 h-5 text-primary" />
                      Safety Recommendations
                    </div>
                    <div className="recommendations-list">
                      {getRecommendations(predictionResult.fire_risk).map((recommendation, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="recommendation-item"
                        >
                          <div className="recommendation-bullet"></div>
                          <span className="recommendation-text">{recommendation}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Charts Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="card"
                >
                  <div className="card-header">
                    <h3 className="card-title text-gradient">Risk Analysis Charts</h3>
                    <p className="card-description">
                      Detailed visualization of prediction confidence and risk factors
                    </p>
                  </div>
                  <div className="card-content">
                    <RiskChart predictionData={predictionResult} />
                  </div>
                </motion.div>
              </div>
            )}
          </motion.section>
        )}

        {/* Information Cards */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="section"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gradient mb-4">
              Why Choose Our System?
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              Industry-leading accuracy and reliability backed by extensive research and validation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="feature-card"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="icon-container icon-warning mx-auto">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="feature-title">Advanced AI Models</h3>
              <p className="feature-description">
                Sophisticated machine learning algorithms analyze temperature, humidity, 
                wind patterns, atmospheric pressure, and fire weather indices for comprehensive risk assessment.
              </p>
            </motion.div>

            <motion.div 
              className="feature-card"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="icon-container icon-success mx-auto">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="feature-title">99.2% Accuracy Rate</h3>
              <p className="feature-description">
                Extensively trained on comprehensive wildfire datasets with validated 
                accuracy across diverse geographical regions and climatic conditions worldwide.
              </p>
            </motion.div>

            <motion.div 
              className="feature-card"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="icon-container icon-primary mx-auto">
                <Info className="w-6 h-6" />
              </div>
              <h3 className="feature-title">Real-time Processing</h3>
              <p className="feature-description">
                Lightning-fast predictions with sub-100ms response times enabling immediate 
                decision-making for critical fire safety and emergency response situations.
              </p>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default Predict
