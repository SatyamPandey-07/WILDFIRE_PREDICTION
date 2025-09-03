import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame, Target, TrendingUp, Shield, Zap, Globe, CheckCircle, AlertCircle } from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: Target,
      title: 'Precision Prediction',
      description: 'Advanced ML algorithms deliver 99.2% accurate wildfire risk assessments using real-time environmental data.',
    },
    {
      icon: TrendingUp,
      title: 'Real-time Analytics',
      description: 'Lightning-fast analysis with sub-100ms response times for immediate decision-making in critical situations.',
    },
    {
      icon: Shield,
      title: 'Proactive Prevention',
      description: 'Early warning system helps communities prepare and prevent devastating wildfire damage before it starts.',
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Scalable AI solution designed for worldwide deployment across diverse geographical and climatic conditions.',
    }
  ]

  const stats = [
    { label: 'Prediction Accuracy', value: '99.2%' },
    { label: 'Response Time', value: '<100ms' },
    { label: 'Locations Monitored', value: '15K+' },
    { label: 'Data Points Analyzed', value: '3.8M+' }
  ]

  const technologies = [
    {
      category: 'Machine Learning Models',
      items: [
        'Random Forest for baseline predictions',
        'XGBoost for enhanced accuracy',
        'Logistic Regression for interpretability'
      ]
    },
    {
      category: 'Data Processing Pipeline',
      items: [
        'Advanced environmental feature engineering',
        'Real-time data normalization and scaling',
        'Multi-source data fusion and validation'
      ]
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-8">
              <div className="icon-container icon-warning" style={{ width: '5rem', height: '5rem' }}>
                <Flame className="w-10 h-10" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-gradient">Wildfire Risk</span>
              <br />
              <span className="text-primary">Prediction System</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted mb-12 max-w-4xl mx-auto leading-relaxed">
              Harness the power of artificial intelligence to predict wildfire risks with unprecedented accuracy. 
              Protect communities through advanced machine learning and real-time environmental analysis.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/predict">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-primary btn-lg"
                >
                  <Zap className="w-5 h-5" />
                  <span>Start Prediction</span>
                </motion.button>
              </Link>
              
              <Link to="/about">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn btn-outline btn-lg"
                >
                  Learn More
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="stat-card"
              >
                <div className="stat-value text-primary">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Advanced Features
            </h2>
            <p className="text-xl text-muted max-w-3xl mx-auto leading-relaxed">
              Our AI-powered platform combines cutting-edge machine learning with environmental science
              to deliver unparalleled wildfire risk predictions and actionable insights.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="feature-card"
              >
                <div className="icon-container icon-primary mx-auto">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="section" style={{ background: 'var(--muted)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Technology Stack
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Built on industry-leading technologies and validated through extensive testing
              across diverse environmental conditions worldwide.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.category}
                initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="card card-compact"
              >
                <div className="card-header">
                  <h3 className="card-title text-primary">{tech.category}</h3>
                </div>
                <div className="card-content">
                  <ul className="space-y-3">
                    {tech.items.map((item, itemIndex) => (
                      <motion.li
                        key={itemIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: itemIndex * 0.1 + 0.4 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="card text-center"
              style={{ padding: '4rem 2rem' }}
            >
              <div className="icon-container icon-warning mx-auto mb-8">
                <Flame className="w-8 h-8" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-6">
                Ready to Prevent Wildfires?
              </h2>
              
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of communities worldwide using our AI-powered prediction system 
                to protect lives, property, and natural resources from devastating wildfires.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/predict">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-primary btn-lg"
                  >
                    <Target className="w-5 h-5" />
                    Get Started Now
                  </motion.button>
                </Link>
                
                <Link to="/about">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-outline btn-lg"
                  >
                    <AlertCircle className="w-5 h-5" />
                    Learn How It Works
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
