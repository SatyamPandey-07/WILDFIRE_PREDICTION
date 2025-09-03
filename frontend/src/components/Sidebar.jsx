import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Flame, Home, Target, Info, Menu, X, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Sidebar = () => {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    // Update main content margin based on sidebar state
    const mainContent = document.querySelector('.main-content')
    if (mainContent) {
      mainContent.style.marginLeft = isCollapsed ? '64px' : '256px'
    }
  }, [isCollapsed])

  const isActive = (path) => location.pathname === path

  const navigationItems = [
    {
      name: 'Home',
      path: '/',
      icon: Home
    },
    {
      name: 'Predict',
      path: '/predict',
      icon: Target
    },
    {
      name: 'About',
      path: '/about',
      icon: Info
    }
  ]

  const sidebarVariants = {
    expanded: {
      width: '256px',
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    collapsed: {
      width: '64px',
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  }

  const contentVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2, delay: 0.1 }
    },
    collapsed: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 }
    }
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        className="sidebar"
        variants={sidebarVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        initial="expanded"
      >
        {/* Header */}
        <div className="sidebar-header">
          <div className="flex items-center gap-3">
            <div className="icon-container icon-warning flex-shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  variants={contentVariants}
                  initial="expanded"
                  animate="expanded"
                  exit="collapsed"
                  className="flex items-center justify-between w-full"
                >
                  <span className="text-lg font-bold text-gradient">
                    WildfireAI
                  </span>
                  <button
                    onClick={() => setIsCollapsed(true)}
                    className="sidebar-toggle"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {isCollapsed && (
            <button
              onClick={() => setIsCollapsed(false)}
              className="sidebar-toggle mt-2"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-item ${active ? 'active' : ''}`}
                title={isCollapsed ? item.name : undefined}
              >
                <div className="sidebar-item-icon">
                  <Icon className="w-5 h-5" />
                </div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      variants={contentVariants}
                      initial="expanded"
                      animate="expanded"
                      exit="collapsed"
                      className="sidebar-item-text"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
                {active && <div className="sidebar-item-indicator" />}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                variants={contentVariants}
                initial="expanded"
                animate="expanded"
                exit="collapsed"
                className="text-xs text-muted text-center"
              >
                AI-Powered Fire Risk Assessment
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Mobile Menu Button */}
      <div className="mobile-menu-button">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="btn-outline p-2"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              className="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              className="mobile-sidebar"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              {/* Mobile Header */}
              <div className="mobile-sidebar-header">
                <div className="flex items-center gap-3">
                  <div className="icon-container icon-warning">
                    <Flame className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-bold text-gradient">
                    WildfireAI
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="text-muted-foreground hover:text-foreground p-2 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="mobile-sidebar-nav">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.path)
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`mobile-sidebar-item ${active ? 'active' : ''}`}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <div className="mobile-sidebar-item-icon">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="mobile-sidebar-item-text">
                        {item.name}
                      </span>
                    </Link>
                  )
                })}
              </nav>

              {/* Mobile Footer */}
              <div className="mobile-sidebar-footer">
                <div className="text-xs text-muted text-center">
                  AI-Powered Fire Risk Assessment
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar
