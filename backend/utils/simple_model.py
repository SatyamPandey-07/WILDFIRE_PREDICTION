#!/usr/bin/env python3
"""
Simple wildfire model training script
This version uses minimal dependencies to avoid import issues
"""

import os
import sys
import csv
import json
from pathlib import Path

def load_csv_data(file_path):
    """Load CSV data without pandas"""
    data = []
    with open(file_path, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Convert numeric strings to floats
            numeric_row = {}
            for key, value in row.items():
                try:
                    numeric_row[key] = float(value)
                except ValueError:
                    numeric_row[key] = value
            data.append(numeric_row)
    return data

def simple_logistic_regression(X, y, learning_rate=0.01, epochs=100):
    """Simple logistic regression implementation"""
    import math
    import random
    
    # Initialize weights
    n_features = len(X[0])
    weights = [random.random() * 0.01 for _ in range(n_features + 1)]  # +1 for bias
    
    # Training
    for epoch in range(epochs):
        for i, features in enumerate(X):
            # Forward pass
            z = weights[0]  # bias
            for j, feature in enumerate(features):
                z += weights[j + 1] * feature
            
            # Sigmoid activation
            prediction = 1 / (1 + math.exp(-max(min(z, 250), -250)))  # Clip to avoid overflow
            
            # Error
            error = y[i] - prediction
            
            # Update weights
            weights[0] += learning_rate * error * prediction * (1 - prediction)
            for j, feature in enumerate(features):
                weights[j + 1] += learning_rate * error * prediction * (1 - prediction) * feature
    
    return weights

def predict(features, weights):
    """Make prediction using trained weights"""
    import math
    z = weights[0]  # bias
    for i, feature in enumerate(features):
        z += weights[i + 1] * feature
    
    probability = 1 / (1 + math.exp(-max(min(z, 250), -250)))
    prediction = 1 if probability > 0.5 else 0
    return prediction, probability

def normalize_features(data, feature_names):
    """Simple feature normalization"""
    # Calculate means and stds
    means = {}
    stds = {}
    
    for feature in feature_names:
        values = [row[feature] for row in data]
        mean = sum(values) / len(values)
        variance = sum((x - mean) ** 2 for x in values) / len(values)
        std = variance ** 0.5
        means[feature] = mean
        stds[feature] = std if std > 0 else 1.0
    
    # Normalize data
    normalized_data = []
    for row in data:
        normalized_row = {}
        for key, value in row.items():
            if key in feature_names:
                normalized_row[key] = (value - means[key]) / stds[key]
            else:
                normalized_row[key] = value
        normalized_data.append(normalized_row)
    
    return normalized_data, means, stds

def main():
    print("🚀 Starting simple wildfire model training...")
    
    # Define paths
    data_dir = Path("../data/raw")
    model_dir = Path("..")
    
    # Load data
    data_file = data_dir / "wildfire_dataset.csv"
    if not data_file.exists():
        print(f"❌ Data file not found: {data_file}")
        return
    
    print(f"📊 Loading data from {data_file}...")
    data = load_csv_data(data_file)
    print(f"✅ Loaded {len(data)} records")
    
    # Select key features for simple model
    key_features = [
        'temp_mean', 'humidity_min', 'wind_speed_max', 
        'pressure_mean', 'fire_weather_index'
    ]
    
    # Filter data to only include records with all required features
    filtered_data = []
    for row in data:
        if all(feature in row and isinstance(row[feature], (int, float)) for feature in key_features):
            if 'occured' in row:
                filtered_data.append(row)
    
    print(f"📋 Filtered to {len(filtered_data)} complete records")
    
    # Normalize features
    print("🔧 Normalizing features...")
    normalized_data, means, stds = normalize_features(filtered_data, key_features)
    
    # Prepare training data
    X = []
    y = []
    for row in normalized_data:
        features = [row[feature] for feature in key_features]
        X.append(features)
        y.append(int(row['occured']))
    
    # Simple train/test split (80/20)
    split_idx = int(0.8 * len(X))
    X_train, X_test = X[:split_idx], X[split_idx:]
    y_train, y_test = y[:split_idx], y[split_idx:]
    
    print(f"🎯 Training set: {len(X_train)} samples")
    print(f"🎯 Test set: {len(X_test)} samples")
    
    # Train model
    print("🧠 Training logistic regression model...")
    weights = simple_logistic_regression(X_train, y_train, learning_rate=0.1, epochs=200)
    
    # Evaluate model
    print("📊 Evaluating model...")
    correct = 0
    total_prob = 0
    
    for i, features in enumerate(X_test):
        pred, prob = predict(features, weights)
        if pred == y_test[i]:
            correct += 1
        total_prob += prob if y_test[i] == 1 else (1 - prob)
    
    accuracy = correct / len(X_test)
    avg_prob = total_prob / len(X_test)
    
    print(f"✅ Model trained successfully!")
    print(f"📈 Test Accuracy: {accuracy:.3f}")
    print(f"📈 Average Probability: {avg_prob:.3f}")
    
    # Save model
    model_data = {
        'weights': weights,
        'features': key_features,
        'means': means,
        'stds': stds,
        'accuracy': accuracy,
        'model_type': 'SimpleLogisticRegression'
    }
    
    # Save as JSON (more reliable than pickle)
    model_file = model_dir / "simple_wildfire_model.json"
    with open(model_file, 'w') as f:
        json.dump(model_data, f, indent=2)
    
    print(f"💾 Model saved to {model_file}")
    
    # Test the model with sample data
    print("\n🧪 Testing model with sample data:")
    test_cases = [
        {"temp_mean": 35, "humidity_min": 20, "wind_speed_max": 25, "pressure_mean": 1010, "fire_weather_index": 20},
        {"temp_mean": 15, "humidity_min": 70, "wind_speed_max": 5, "pressure_mean": 1015, "fire_weather_index": 5},
        {"temp_mean": 28, "humidity_min": 40, "wind_speed_max": 15, "pressure_mean": 1008, "fire_weather_index": 15}
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        # Normalize test features
        normalized_features = []
        for feature in key_features:
            normalized_val = (test_case[feature] - means[feature]) / stds[feature]
            normalized_features.append(normalized_val)
        
        pred, prob = predict(normalized_features, weights)
        risk_level = "High" if prob > 0.7 else "Medium" if prob > 0.4 else "Low"
        
        print(f"  Test {i}: Risk={risk_level}, Probability={prob:.3f}, Prediction={'Fire' if pred else 'No Fire'}")
    
    print("\n🎉 Model training completed successfully!")
    return model_file

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"❌ Error during training: {str(e)}")
        import traceback
        traceback.print_exc()
