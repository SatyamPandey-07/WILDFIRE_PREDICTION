import json
import logging
from typing import Dict, Any, Optional
from pathlib import Path

class SimpleWildfirePredictionService:
    """
    Simple wildfire prediction service using the trained logistic regression model
    """
    
    def __init__(self, model_path="../simple_wildfire_model.json"):
        self.model_data = None
        self.model_path = model_path
        
        # Load model on initialization
        self.load_model()
    
    def load_model(self):
        """
        Load trained model from JSON file
        """
        try:
            model_file = Path(self.model_path)
            if model_file.exists():
                with open(model_file, 'r') as f:
                    self.model_data = json.load(f)
                logging.info(f"✅ Model loaded successfully: {self.model_data['model_type']}")
                logging.info(f"Model accuracy: {self.model_data['accuracy']:.3f}")
            else:
                logging.warning(f"Model file not found: {model_file}")
                self._create_dummy_model()
                
        except Exception as e:
            logging.error(f"Error loading model: {str(e)}")
            self._create_dummy_model()
    
    def _create_dummy_model(self):
        """
        Create a dummy model for testing when real model is not available
        """
        self.model_data = {
            'model_type': 'DummyModel',
            'features': ['temp_mean', 'humidity_min', 'wind_speed_max', 'pressure_mean', 'fire_weather_index'],
            'accuracy': 0.85
        }
        logging.info("Using dummy model for testing purposes")
    
    def _normalize_features(self, input_data: Dict[str, Any]) -> list:
        """
        Normalize input features using saved statistics
        """
        if not self.model_data or 'means' not in self.model_data:
            # If no normalization data, return raw features
            features = self.model_data['features']
            return [float(input_data.get(feature, 0)) for feature in features]
        
        means = self.model_data['means']
        stds = self.model_data['stds']
        features = self.model_data['features']
        
        normalized_features = []
        for feature in features:
            # Handle different input field names
            value = self._get_feature_value(input_data, feature)
            if feature in means and feature in stds:
                normalized_val = (value - means[feature]) / stds[feature]
            else:
                normalized_val = value
            normalized_features.append(normalized_val)
        
        return normalized_features
    
    def _get_feature_value(self, input_data: Dict[str, Any], feature: str) -> float:
        """
        Get feature value from input data, handling different field name formats
        """
        # Direct match
        if feature in input_data:
            return float(input_data[feature])
        
        # Handle common field name variations
        field_mappings = {
            'temp_mean': ['temperature', 'temp'],
            'humidity_min': ['humidity'],
            'wind_speed_max': ['wind_speed', 'wind'],
            'pressure_mean': ['pressure'],
            'fire_weather_index': ['fwi', 'fire_weather_index']
        }
        
        if feature in field_mappings:
            for alt_name in field_mappings[feature]:
                if alt_name in input_data:
                    return float(input_data[alt_name])
        
        # Default values if not found
        defaults = {
            'temp_mean': 20.0,
            'humidity_min': 50.0,
            'wind_speed_max': 10.0,
            'pressure_mean': 1013.25,
            'fire_weather_index': 10.0
        }
        
        return defaults.get(feature, 0.0)
    
    def _predict_with_weights(self, features: list, weights: list) -> tuple:
        """
        Make prediction using logistic regression weights
        """
        import math
        
        # Calculate weighted sum (z)
        z = weights[0]  # bias term
        for i, feature in enumerate(features):
            z += weights[i + 1] * feature
        
        # Apply sigmoid function
        try:
            probability = 1 / (1 + math.exp(-max(min(z, 250), -250)))
        except:
            probability = 0.5
        
        prediction = 1 if probability > 0.5 else 0
        
        return prediction, probability
    
    def predict(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Make wildfire risk prediction
        """
        try:
            # Handle dummy model
            if not self.model_data or self.model_data.get('model_type') == 'DummyModel':
                return self._dummy_predict(input_data)
            
            # Normalize input features
            normalized_features = self._normalize_features(input_data)
            
            # Make prediction using trained weights
            weights = self.model_data['weights']
            prediction, probability = self._predict_with_weights(normalized_features, weights)
            
            # Determine risk level
            risk_level = self._get_risk_level(probability)
            
            result = {
                "fire_risk": risk_level,
                "probability": probability,
                "prediction": int(prediction),
                "confidence": abs(probability - 0.5) + 0.5,  # Confidence based on distance from 0.5
                "model_used": self.model_data.get('model_type', 'SimpleLogisticRegression'),
                "input_processed": True
            }
            
            return result
            
        except Exception as e:
            logging.error(f"Prediction error: {str(e)}")
            return {
                "fire_risk": "Unknown",
                "probability": None,
                "prediction": None,
                "confidence": 0.0,
                "model_used": self.model_data.get('model_type', 'Unknown') if self.model_data else 'Unknown',
                "error": str(e),
                "input_processed": False
            }
    
    def _dummy_predict(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Dummy prediction for testing
        """
        # Simple rule-based prediction
        temp = input_data.get('temperature', input_data.get('temp_mean', 20))
        humidity = input_data.get('humidity', input_data.get('humidity_min', 50))
        wind = input_data.get('wind_speed', input_data.get('wind_speed_max', 10))
        fwi = input_data.get('fire_weather_index', 10)
        
        # Simple risk calculation
        risk_score = 0.0
        
        if temp > 30:
            risk_score += 0.3
        elif temp > 25:
            risk_score += 0.2
        
        if humidity < 30:
            risk_score += 0.3
        elif humidity < 50:
            risk_score += 0.2
        
        if wind > 20:
            risk_score += 0.2
        elif wind > 15:
            risk_score += 0.1
        
        if fwi > 15:
            risk_score += 0.3
        elif fwi > 10:
            risk_score += 0.2
        
        probability = min(risk_score, 0.95)
        prediction = 1 if probability > 0.5 else 0
        risk_level = self._get_risk_level(probability)
        
        return {
            "fire_risk": risk_level,
            "probability": probability,
            "prediction": prediction,
            "confidence": abs(probability - 0.5) + 0.5,
            "model_used": "DummyModel",
            "input_processed": True
        }
    
    def _get_risk_level(self, probability: float) -> str:
        """
        Convert probability to risk level
        """
        if probability < 0.25:
            return "Low"
        elif probability < 0.5:
            return "Medium"
        elif probability < 0.75:
            return "High"
        else:
            return "Extreme"
    
    def get_model_info(self) -> Dict[str, Any]:
        """
        Get information about the loaded model
        """
        if not self.model_data:
            return {"error": "No model loaded"}
        
        return {
            "model_name": self.model_data.get('model_type', 'Unknown'),
            "features": self.model_data.get('features', []),
            "feature_count": len(self.model_data.get('features', [])),
            "accuracy": self.model_data.get('accuracy', 'Unknown'),
            "model_loaded": True
        }

# For backward compatibility, create an alias
WildfirePredictionService = SimpleWildfirePredictionService

if __name__ == "__main__":
    # Test the prediction service
    logging.basicConfig(level=logging.INFO)
    
    predictor = SimpleWildfirePredictionService()
    
    # Test prediction
    test_input = {
        "temperature": 35.5,
        "humidity": 25.0,
        "wind_speed": 18.5,
        "pressure": 1010.0,
        "fire_weather_index": 18.2
    }
    
    result = predictor.predict(test_input)
    print(f"Test prediction result: {json.dumps(result, indent=2)}")
    
    # Get model info
    info = predictor.get_model_info()
    print(f"Model info: {json.dumps(info, indent=2)}")
