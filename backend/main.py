#!/usr/bin/env python3
"""
Wildfire Risk Prediction API
A Flask-based REST API for predicting wildfire risk based on environmental conditions.
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'utils'))

from utils.app import app

if __name__ == '__main__':
    print("🔥 Starting Wildfire Risk Prediction API...")
    print("🌐 API will be available at http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
