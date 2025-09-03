#!/usr/bin/env python3
"""
Simple Flask API for wildfire risk prediction
Uses minimal dependencies to avoid import issues
"""

try:
    from flask import Flask, request, jsonify
    from flask_cors import CORS
    FLASK_AVAILABLE = True
except ImportError:
    FLASK_AVAILABLE = False
    print("⚠️  Flask not available, running in test mode")

import json
import logging
import os
from pathlib import Path
from simple_predict import SimpleWildfirePredictionService

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if FLASK_AVAILABLE:
    app = Flask(__name__)
    CORS(app)  # Enable CORS for frontend communication

    # Initialize prediction service
    predictor = SimpleWildfirePredictionService()

    @app.route('/health', methods=['GET'])
    def health_check():
        """Health check endpoint"""
        return jsonify({
            "status": "healthy",
            "message": "Wildfire Risk Prediction API is running",
            "version": "1.0.0",
            "model_info": predictor.get_model_info()
        })

    @app.route('/predict', methods=['POST'])
    def predict_fire_risk():
        """
        Predict wildfire risk based on environmental conditions
        """
        try:
            # Get JSON data from request
            data = request.get_json()
            
            if not data:
                return jsonify({"error": "No data provided"}), 400
            
            # Validate that at least some data is provided
            required_any = ['temperature', 'temp_mean', 'humidity', 'humidity_min', 'wind_speed', 'wind_speed_max']
            if not any(field in data for field in required_any):
                return jsonify({
                    "error": "Please provide at least temperature, humidity, and wind speed data"
                }), 400
            
            # Make prediction
            prediction_result = predictor.predict(data)
            
            return jsonify(prediction_result)
            
        except ValueError as ve:
            logger.error(f"Validation error: {str(ve)}")
            return jsonify({"error": f"Invalid input: {str(ve)}"}), 400
        except Exception as e:
            logger.error(f"Prediction error: {str(e)}")
            return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

    @app.route('/predict/batch', methods=['POST'])
    def predict_batch():
        """
        Predict wildfire risk for multiple locations
        """
        try:
            request_data = request.get_json()
            
            if not request_data or 'data' not in request_data:
                return jsonify({"error": "No data array provided"}), 400
            
            data_list = request_data['data']
            predictions = []
            
            for i, data_point in enumerate(data_list):
                try:
                    result = predictor.predict(data_point)
                    result['index'] = i
                    predictions.append(result)
                except Exception as e:
                    predictions.append({
                        'index': i,
                        'error': str(e),
                        'fire_risk': 'Unknown',
                        'probability': None
                    })
            
            return jsonify({
                "predictions": predictions,
                "total_processed": len(predictions)
            })
            
        except Exception as e:
            logger.error(f"Batch prediction error: {str(e)}")
            return jsonify({"error": f"Batch prediction failed: {str(e)}"}), 500

    @app.route('/model/info', methods=['GET'])
    def model_info():
        """Get information about the current model"""
        try:
            info = predictor.get_model_info()
            return jsonify(info)
        except Exception as e:
            logger.error(f"Model info error: {str(e)}")
            return jsonify({"error": f"Could not retrieve model info: {str(e)}"}), 500

def test_api():
    """Test the API without Flask"""
    print("🧪 Testing API without Flask...")
    
    predictor = SimpleWildfirePredictionService()
    
    # Test health check equivalent
    health_info = {
        "status": "healthy",
        "message": "Wildfire Risk Prediction API is running",
        "version": "1.0.0",
        "model_info": predictor.get_model_info()
    }
    print("Health check:", json.dumps(health_info, indent=2))
    
    # Test prediction
    test_data = {
        "temperature": 32.5,
        "humidity": 28.3,
        "wind_speed": 15.7,
        "pressure": 1008.2,
        "fire_weather_index": 16.8
    }
    
    result = predictor.predict(test_data)
    print("Prediction result:", json.dumps(result, indent=2))
    
    # Test batch prediction
    batch_data = {
        "data": [
            {"temperature": 25.5, "humidity": 45.2, "wind_speed": 12.3, "pressure": 1013.25, "fire_weather_index": 10.2},
            {"temperature": 35.1, "humidity": 25.8, "wind_speed": 18.7, "pressure": 1008.1, "fire_weather_index": 18.5}
        ]
    }
    
    batch_predictions = []
    for i, data_point in enumerate(batch_data['data']):
        try:
            result = predictor.predict(data_point)
            result['index'] = i
            batch_predictions.append(result)
        except Exception as e:
            batch_predictions.append({
                'index': i,
                'error': str(e),
                'fire_risk': 'Unknown',
                'probability': None
            })
    
    batch_result = {
        "predictions": batch_predictions,
        "total_processed": len(batch_predictions)
    }
    
    print("Batch prediction result:", json.dumps(batch_result, indent=2))

if __name__ == '__main__':
    if FLASK_AVAILABLE:
        print("🚀 Starting Flask API server...")
        print("📊 Model loaded and ready")
        print("🌐 API will be available at http://localhost:5000")
        print("\n📋 Available endpoints:")
        print("  GET  /health       - Health check and model info")
        print("  POST /predict      - Single prediction")
        print("  POST /predict/batch - Batch predictions")
        print("  GET  /model/info   - Model information")
        print("\n🔥 Starting server...")
        
        app.run(debug=True, host='0.0.0.0', port=5000)
    else:
        print("⚠️  Flask not available, running in test mode...")
        test_api()
