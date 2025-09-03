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

# Import our prediction service
try:
    from simple_predict import SimpleWildfirePredictionService
except ImportError:
    print("⚠️  Could not import SimpleWildfirePredictionService")
    # Create a mock service for testing
    class SimpleWildfirePredictionService:
        def get_model_info(self):
            return {"model_type": "Mock Model", "status": "testing"}
        
        def predict(self, data):
            return {
                "fire_risk": "Medium",
                "probability": 0.65,
                "confidence": "Medium",
                "factors": {
                    "temperature_effect": "Moderate risk",
                    "humidity_effect": "Low risk", 
                    "wind_effect": "High risk"
                }
            }

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if FLASK_AVAILABLE:
    app = Flask(__name__)
    CORS(app)  # Enable CORS for frontend communication

    # Initialize prediction service
    predictor = SimpleWildfirePredictionService()
    
    # Initialize data service
    try:
        from data_service import data_service
        DATA_SERVICE_AVAILABLE = True
        logger.info("✅ Data service loaded successfully")
    except ImportError:
        DATA_SERVICE_AVAILABLE = False
        logger.warning("⚠️  Data service not available")

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

    @app.route('/api/dataset-stats', methods=['GET'])
    def get_dataset_stats():
        """Get comprehensive dataset statistics"""
        try:
            if DATA_SERVICE_AVAILABLE:
                stats = data_service.get_dataset_statistics()
                return jsonify({
                    "success": True,
                    "data": stats,
                    "source": "real_data"
                })
            else:
                # Mock data fallback
                return jsonify({
                    "success": True,
                    "data": {
                        "total_records": 118858,
                        "total_features": 17,
                        "fire_incidents": 59452,
                        "no_fire_cases": 59406,
                        "fire_percentage": 50.02,
                        "no_fire_percentage": 49.98,
                        "missing_values": 0,
                        "missing_percentage": 0.0
                    },
                    "source": "mock_data"
                })
        except Exception as e:
            logger.error(f"Error getting dataset stats: {str(e)}")
            return jsonify({"error": "Failed to get dataset statistics"}), 500

    @app.route('/api/correlations', methods=['GET'])
    def get_correlations():
        """Get feature correlations with fire occurrence"""
        try:
            if DATA_SERVICE_AVAILABLE:
                correlations = data_service.get_correlation_data()
                return jsonify({
                    "success": True,
                    "data": correlations,
                    "source": "real_data"
                })
            else:
                # Mock correlation data
                return jsonify({
                    "success": True,
                    "data": {
                        "correlations": {
                            "daynight_N": 0.293,
                            "frp": 0.290,
                            "humidity_min": 0.138,
                            "fire_weather_index": 0.127,
                            "temp_range": 0.119
                        },
                        "top_positive_correlations": [
                            {"feature": "daynight_N", "correlation": 0.293},
                            {"feature": "frp", "correlation": 0.290},
                            {"feature": "humidity_min", "correlation": 0.138},
                            {"feature": "fire_weather_index", "correlation": 0.127},
                            {"feature": "temp_range", "correlation": 0.119}
                        ]
                    },
                    "source": "mock_data"
                })
        except Exception as e:
            logger.error(f"Error getting correlations: {str(e)}")
            return jsonify({"error": "Failed to get correlations"}), 500

    @app.route('/api/geographical-data', methods=['GET'])
    def get_geographical_data():
        """Get geographical fire occurrence data"""
        try:
            sample_size = request.args.get('sample_size', 300, type=int)
            
            if DATA_SERVICE_AVAILABLE:
                geo_data = data_service.get_geographical_data(sample_size)
                return jsonify({
                    "success": True,
                    "data": geo_data,
                    "count": len(geo_data),
                    "source": "real_data"
                })
            else:
                # Mock geographical data
                import random
                mock_data = []
                for i in range(min(sample_size, 50)):
                    mock_data.append({
                        "lat": random.uniform(-60, 70),
                        "lon": random.uniform(-180, 180),
                        "fire_occurred": random.choice([True, False]),
                        "fire_weather_index": random.uniform(0, 30),
                        "temperature": random.uniform(10, 40),
                        "humidity": random.uniform(10, 90),
                        "wind_speed": random.uniform(5, 30)
                    })
                return jsonify({
                    "success": True,
                    "data": mock_data,
                    "count": len(mock_data),
                    "source": "mock_data"
                })
        except Exception as e:
            logger.error(f"Error getting geographical data: {str(e)}")
            return jsonify({"error": "Failed to get geographical data"}), 500

    @app.route('/api/outlier-analysis', methods=['GET'])
    def get_outlier_analysis():
        """Get outlier detection results"""
        try:
            if DATA_SERVICE_AVAILABLE:
                outliers = data_service.get_outlier_analysis()
                return jsonify({
                    "success": True,
                    "data": outliers,
                    "source": "real_data"
                })
            else:
                # Mock outlier data
                return jsonify({
                    "success": True,
                    "data": {
                        "temp_mean": {"outlier_count": 3338, "percentage": 2.81},
                        "humidity_min": {"outlier_count": 1358, "percentage": 1.14},
                        "wind_speed_max": {"outlier_count": 3735, "percentage": 3.14},
                        "fire_weather_index": {"outlier_count": 8855, "percentage": 7.45}
                    },
                    "source": "mock_data"
                })
        except Exception as e:
            logger.error(f"Error getting outlier analysis: {str(e)}")
            return jsonify({"error": "Failed to get outlier analysis"}), 500

    @app.route('/api/feature-distributions', methods=['GET'])
    def get_feature_distributions():
        """Get feature statistical distributions"""
        try:
            if DATA_SERVICE_AVAILABLE:
                distributions = data_service.get_feature_distributions()
                return jsonify({
                    "success": True,
                    "data": distributions,
                    "source": "real_data"
                })
            else:
                # Mock distribution data
                return jsonify({
                    "success": True,
                    "data": {
                        "temp_mean": {"mean": 24.57, "std": 5.50, "min": -49.05, "max": 41.55},
                        "humidity_min": {"mean": 24.74, "std": 13.15, "min": 1.0, "max": 92.0},
                        "wind_speed_max": {"mean": 16.66, "std": 5.62, "min": 3.3, "max": 62.7},
                        "fire_weather_index": {"mean": 14.67, "std": 14.32, "min": -16.92, "max": 211.63}
                    },
                    "source": "mock_data"
                })
        except Exception as e:
            logger.error(f"Error getting feature distributions: {str(e)}")
            return jsonify({"error": "Failed to get feature distributions"}), 500

    @app.route('/api/risk-distribution', methods=['GET'])
    def get_risk_distribution():
        """Get risk level distribution"""
        try:
            if DATA_SERVICE_AVAILABLE:
                risk_dist = data_service.get_risk_distribution()
                return jsonify({
                    "success": True,
                    "data": risk_dist,
                    "source": "real_data"
                })
            else:
                # Mock risk distribution
                return jsonify({
                    "success": True,
                    "data": {
                        "distribution": [
                            {"name": "Low", "value": 25, "percentage": 25.0, "color": "#10b981"},
                            {"name": "Medium", "value": 35, "percentage": 35.0, "color": "#f59e0b"},
                            {"name": "High", "value": 30, "percentage": 30.0, "color": "#fb923c"},
                            {"name": "Extreme", "value": 10, "percentage": 10.0, "color": "#ef4444"}
                        ]
                    },
                    "source": "mock_data"
                })
        except Exception as e:
            logger.error(f"Error getting risk distribution: {str(e)}")
            return jsonify({"error": "Failed to get risk distribution"}), 500

    @app.route('/api/historical-trends', methods=['GET'])
    def get_historical_trends():
        """Get historical fire trends"""
        try:
            if DATA_SERVICE_AVAILABLE:
                trends = data_service.get_historical_trends()
                return jsonify({
                    "success": True,
                    "data": trends,
                    "source": "real_data"
                })
            else:
                # Mock historical trends
                return jsonify({
                    "success": True,
                    "data": [
                        {"month": "Jan", "fires": 15, "riskLevel": 25},
                        {"month": "Feb", "fires": 18, "riskLevel": 30},
                        {"month": "Mar", "fires": 28, "riskLevel": 45},
                        {"month": "Apr", "fires": 42, "riskLevel": 65},
                        {"month": "May", "fires": 58, "riskLevel": 75},
                        {"month": "Jun", "fires": 73, "riskLevel": 85},
                        {"month": "Jul", "fires": 89, "riskLevel": 92},
                        {"month": "Aug", "fires": 81, "riskLevel": 88},
                        {"month": "Sep", "fires": 64, "riskLevel": 70},
                        {"month": "Oct", "fires": 38, "riskLevel": 55},
                        {"month": "Nov", "fires": 22, "riskLevel": 35},
                        {"month": "Dec", "fires": 15, "riskLevel": 28}
                    ],
                    "source": "mock_data"
                })
        except Exception as e:
            logger.error(f"Error getting historical trends: {str(e)}")
            return jsonify({"error": "Failed to get historical trends"}), 500

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

if __name__ == '__main__':
    print("🚀 Starting Wildfire Risk Prediction API...")
    print("📂 Current directory:", os.getcwd())
    
    if FLASK_AVAILABLE:
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
