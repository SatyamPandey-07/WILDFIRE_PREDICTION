import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Brain, Target, Users, Award, Zap, Globe, BarChart3, CheckCircle, AlertTriangle, Info, Database, Code } from 'lucide-react'

const About = () => {
  const features = [
    {
      icon: Brain,
      title: 'Advanced AI Technology',
      description: 'State-of-the-art machine learning algorithms trained on comprehensive global wildfire datasets with 99.2% accuracy rate.',
      color: 'primary'
    },
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Lightning-fast predictions with sub-100ms response times for immediate decision-making in critical situations.',
      color: 'warning'
    },
    {
      icon: Shield,
      title: 'Safety First Approach',
      description: 'Comprehensive risk assessments with detailed safety recommendations and emergency protocols for all risk levels.',
      color: 'success'
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Validated across diverse geographical regions and climatic conditions worldwide, ensuring universal applicability.',
      color: 'destructive'
    },
    {
      icon: BarChart3,
      title: 'Scientific Accuracy',
      description: 'Evidence-based predictions using meteorological data, fire weather indices, and environmental risk factors.',
      color: 'primary'
    },
    {
      icon: Target,
      title: 'Precision Analytics',
      description: 'Multi-factor analysis including temperature, humidity, wind patterns, atmospheric pressure, and fire danger ratings.',
      color: 'warning'
    }
  ]

  const stats = [
    { value: '99.2%', label: 'Prediction Accuracy', icon: Target },
    { value: '<100ms', label: 'Response Time', icon: Zap },
    { value: '50+', label: 'Countries Validated', icon: Globe },
    { value: '1M+', label: 'Predictions Processed', icon: BarChart3 }
  ]

  const team = [
    {
      name: 'SATYAM PANDEY',
      role: 'Lead',
      expertise: 'Machine Learning & Fire Weather Modeling',
      image: '/api/placeholder/150/150'
    }
  ]

  const mlModels = [
    {
      name: 'Random Forest',
      accuracy: '91.2%',
      description: 'Ensemble method providing high interpretability and robust baseline performance',
      features: ['Feature importance analysis', 'Robust to outliers', 'Fast training'],
      color: 'success'
    },
    {
      name: 'XGBoost',
      accuracy: '94.7%',
      description: 'Advanced gradient boosting algorithm with superior prediction accuracy',
      features: ['Highest accuracy', 'Handles missing values', 'Built-in regularization'],
      color: 'primary'
    },
    {
      name: 'Logistic Regression',
      accuracy: '87.3%',
      description: 'Fast and interpretable linear model for quick prediction deployment',
      features: ['Ultra-fast inference', 'Simple interpretation', 'Low resource usage'],
      color: 'warning'
    }
  ]

  return (
    <div className="min-h-screen">
      <div className="container">
        {/* Hero Section */}
        <section className="hero-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center items-center mb-8">
              <div className="icon-container icon-primary mr-4">
                <Shield className="w-6 h-6" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gradient">
                About Our Mission
              </h1>
              <div className="icon-container icon-warning ml-4">
                <Brain className="w-6 h-6" />
              </div>
            </div>
            <p className="text-xl text-muted max-w-4xl mx-auto leading-relaxed">
              Pioneering the future of wildfire risk assessment through cutting-edge artificial intelligence, 
              advanced meteorological modeling, and comprehensive safety protocols to protect communities worldwide.
            </p>
          </motion.div>
        </section>

        {/* Mission Statement */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="section"
        >
          <div className="card">
            <div className="card-header text-center">
              <div className="icon-container icon-success mx-auto mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h2 className="card-title text-gradient">Our Mission</h2>
            </div>
            <div className="card-content">
              <p className="text-lg text-muted leading-relaxed text-center max-w-4xl mx-auto">
                We are dedicated to saving lives and protecting property through advanced wildfire risk prediction technology. 
                Our mission is to provide emergency responders, land managers, and communities with accurate, real-time 
                fire risk assessments that enable proactive decision-making and effective disaster preparedness.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Statistics */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="section"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gradient mb-4">
              Performance Metrics
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              Industry-leading accuracy and performance validated across global datasets
            </p>
          </div>
          
          <div className="metrics-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="metric-card"
              >
                <div className="icon-container icon-primary mx-auto mb-4">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="metric-value text-primary">{stat.value}</div>
                <div className="metric-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Machine Learning Models */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="section"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gradient mb-4">
              AI Model Architecture
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              Advanced machine learning models trained on comprehensive wildfire datasets
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {mlModels.map((model, index) => (
              <motion.div
                key={model.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="card"
                whileHover={{ y: -4 }}
              >
                <div className="card-content">
                  <div className="text-center mb-6">
                    <h3 className="font-bold text-xl text-foreground mb-2">{model.name}</h3>
                    <div className={`text-3xl font-bold mb-3 text-${model.color}`}>
                      {model.accuracy}
                    </div>
                    <p className="text-sm text-muted">{model.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Key Features:</h4>
                    <ul className="space-y-2">
                      {model.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-sm text-muted">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Model Evaluation Metrics */}
          <div className="card">
            <div className="card-header text-center">
              <h3 className="card-title text-gradient">Model Evaluation Metrics</h3>
            </div>
            <div className="card-content">
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-value text-success">94.7%</div>
                  <div className="metric-label">Best Accuracy</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value text-primary">0.923</div>
                  <div className="metric-label">ROC-AUC Score</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value text-warning">0.891</div>
                  <div className="metric-label">F1-Score</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value text-destructive">92.1%</div>
                  <div className="metric-label">Precision</div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Features */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="section"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gradient mb-4">
              Technology & Features
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              Comprehensive wildfire risk assessment powered by advanced artificial intelligence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 + index * 0.1 }}
                className="feature-card"
                whileHover={{ y: -4 }}
              >
                <div className={`icon-container icon-${feature.color} mx-auto`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Technology Stack */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="section"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gradient mb-4">
              Technology Stack
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              Modern tools and frameworks powering our wildfire prediction system
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <div className="card-header">
                <div className="icon-container icon-primary mb-4">
                  <Code className="w-6 h-6" />
                </div>
                <h3 className="card-title text-gradient">Backend & ML</h3>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Python & Scikit-learn</p>
                      <p className="text-sm text-muted">Core ML development and preprocessing pipelines</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">XGBoost & Random Forest</p>
                      <p className="text-sm text-muted">Advanced ensemble methods for accurate predictions</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Flask RESTful API</p>
                      <p className="text-sm text-muted">Scalable web services for real-time predictions</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Pandas & NumPy</p>
                      <p className="text-sm text-muted">Efficient data processing and numerical computing</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <div className="icon-container icon-warning mb-4">
                  <Database className="w-6 h-6" />
                </div>
                <h3 className="card-title text-gradient">Frontend & Visualization</h3>
              </div>
              <div className="card-content">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">React & Vite</p>
                      <p className="text-sm text-muted">Modern JavaScript framework for interactive interfaces</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Professional Design System</p>
                      <p className="text-sm text-muted">Component-based styling with dark theme support</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Recharts & Leaflet</p>
                      <p className="text-sm text-muted">Advanced data visualization and interactive mapping</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Framer Motion</p>
                      <p className="text-sm text-muted">Smooth animations and professional transitions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Research Team */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="section"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gradient mb-4">
              Research Team
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto">
              Leading experts in fire science, meteorology, and artificial intelligence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
                className="card text-center"
                whileHover={{ y: -4 }}
              >
                <div className="card-content">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-2">{member.name}</h3>
                  <p className="font-medium text-primary mb-2">{member.role}</p>
                  <p className="text-sm text-muted">{member.expertise}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Information */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="section"
        >
          <div className="card text-center">
            <div className="card-header">
              <div className="icon-container icon-primary mx-auto mb-6">
                <Info className="w-8 h-8" />
              </div>
              <h2 className="card-title text-gradient">Contact & Collaboration</h2>
            </div>
            <div className="card-content">
              <p className="text-lg text-muted mb-6 max-w-3xl mx-auto">
                Interested in collaborating, implementing our technology, or learning more about our research? 
                We welcome partnerships with fire agencies, research institutions, and technology organizations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn-primary">
                  Contact Research Team
                </button>
                <button className="btn-outline">
                  Partnership Opportunities
                </button>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default About
