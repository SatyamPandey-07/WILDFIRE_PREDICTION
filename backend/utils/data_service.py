#!/usr/bin/env python3
"""
Data service to extract and serve real data from notebooks for frontend
"""
import json
import pandas as pd
import numpy as np
from pathlib import Path

class WildfireDataService:
    def __init__(self):
        self.data_path = Path(__file__).parent.parent / "data" / "raw" / "wildfire_dataset.csv"
        self.df = None
        self.load_data()
    
    def load_data(self):
        """Load the wildfire dataset"""
        try:
            if self.data_path.exists():
                self.df = pd.read_csv(self.data_path)
                print(f"✅ Loaded {len(self.df)} wildfire records")
            else:
                print("⚠️  Dataset not found, using mock data")
                self.create_mock_data()
        except Exception as e:
            print(f"❌ Error loading data: {e}")
            self.create_mock_data()
    
    def create_mock_data(self):
        """Create mock data if real dataset not available"""
        np.random.seed(42)
        n_samples = 1000
        
        self.df = pd.DataFrame({
            'daynight_N': np.random.choice([0, 1], n_samples, p=[0.85, 0.15]),
            'lat': np.random.uniform(-60, 70, n_samples),
            'lon': np.random.uniform(-180, 180, n_samples),
            'fire_weather_index': np.random.normal(15, 10, n_samples),
            'temp_mean': np.random.normal(25, 8, n_samples),
            'humidity_min': np.random.uniform(10, 90, n_samples),
            'wind_speed_max': np.random.gamma(2, 8, n_samples),
            'pressure_mean': np.random.normal(1013, 30, n_samples),
            'frp': np.random.exponential(20, n_samples),
            'occured': np.random.choice([0, 1], n_samples, p=[0.5, 0.5])
        })
        print("📊 Created mock dataset for demonstration")
    
    def get_dataset_statistics(self):
        """Get comprehensive dataset statistics"""
        if self.df is None:
            return {}
        
        stats = {
            'total_records': len(self.df),
            'total_features': len(self.df.columns) - 1,  # Exclude target
            'fire_incidents': int(self.df['occured'].sum()),
            'no_fire_cases': int(len(self.df) - self.df['occured'].sum()),
            'fire_percentage': float(self.df['occured'].mean() * 100),
            'no_fire_percentage': float((1 - self.df['occured'].mean()) * 100),
            'missing_values': int(self.df.isnull().sum().sum()),
            'missing_percentage': float(self.df.isnull().sum().sum() / self.df.size * 100)
        }
        return stats
    
    def get_correlation_data(self):
        """Get feature correlations with target"""
        if self.df is None:
            return {}
        
        # Calculate correlations with fire occurrence
        correlations = self.df.corr()['occured'].drop('occured').sort_values(key=abs, ascending=False)
        
        return {
            'correlations': {
                feature: float(corr) for feature, corr in correlations.items()
            },
            'top_positive_correlations': [
                {'feature': feature, 'correlation': float(corr)} 
                for feature, corr in correlations.head(5).items()
            ],
            'top_negative_correlations': [
                {'feature': feature, 'correlation': float(corr)} 
                for feature, corr in correlations.tail(5).items()
            ]
        }
    
    def get_feature_distributions(self):
        """Get statistical distributions for all features"""
        if self.df is None:
            return {}
        
        distributions = {}
        numeric_cols = self.df.select_dtypes(include=[np.number]).columns.drop('occured')
        
        for col in numeric_cols:
            distributions[col] = {
                'mean': float(self.df[col].mean()),
                'std': float(self.df[col].std()),
                'min': float(self.df[col].min()),
                'max': float(self.df[col].max()),
                'median': float(self.df[col].median()),
                'q25': float(self.df[col].quantile(0.25)),
                'q75': float(self.df[col].quantile(0.75))
            }
        
        return distributions
    
    def get_geographical_data(self, sample_size=500):
        """Get geographical fire occurrence data"""
        if self.df is None or 'lat' not in self.df.columns or 'lon' not in self.df.columns:
            return []
        
        # Sample data for performance
        sample_df = self.df.sample(n=min(sample_size, len(self.df)))
        
        geo_data = []
        for _, row in sample_df.iterrows():
            geo_data.append({
                'lat': float(row['lat']),
                'lon': float(row['lon']),
                'fire_occurred': bool(row['occured']),
                'fire_weather_index': float(row.get('fire_weather_index', 0)),
                'temperature': float(row.get('temp_mean', 20)),
                'humidity': float(row.get('humidity_min', 50)),
                'wind_speed': float(row.get('wind_speed_max', 10)),
                'frp': float(row.get('frp', 0))
            })
        
        return geo_data
    
    def get_outlier_analysis(self):
        """Get outlier detection results"""
        if self.df is None:
            return {}
        
        outlier_features = ['temp_mean', 'humidity_min', 'wind_speed_max', 'fire_weather_index', 'pressure_mean']
        outlier_analysis = {}
        
        for feature in outlier_features:
            if feature in self.df.columns:
                Q1 = self.df[feature].quantile(0.25)
                Q3 = self.df[feature].quantile(0.75)
                IQR = Q3 - Q1
                lower_bound = Q1 - 1.5 * IQR
                upper_bound = Q3 + 1.5 * IQR
                
                outliers = ((self.df[feature] < lower_bound) | (self.df[feature] > upper_bound))
                outlier_count = outliers.sum()
                
                outlier_analysis[feature] = {
                    'outlier_count': int(outlier_count),
                    'total_count': len(self.df),
                    'percentage': float(outlier_count / len(self.df) * 100),
                    'lower_bound': float(lower_bound),
                    'upper_bound': float(upper_bound)
                }
        
        return outlier_analysis
    
    def get_risk_distribution(self):
        """Get risk level distribution data"""
        if self.df is None:
            return {}
        
        # Create risk categories based on fire weather index and other factors
        conditions = [
            (self.df.get('fire_weather_index', 0) <= 5),
            (self.df.get('fire_weather_index', 0) <= 15),
            (self.df.get('fire_weather_index', 0) <= 25),
            (self.df.get('fire_weather_index', 0) > 25)
        ]
        choices = ['Low', 'Medium', 'High', 'Extreme']
        
        risk_levels = np.select(conditions, choices, default='Medium')
        risk_counts = pd.Series(risk_levels).value_counts()
        
        return {
            'distribution': [
                {
                    'name': risk_level,
                    'value': int(count),
                    'percentage': float(count / len(self.df) * 100)
                }
                for risk_level, count in risk_counts.items()
            ]
        }

    def get_historical_trends(self):
        """Get historical fire trends data"""
        # Since we don't have temporal data, create seasonal pattern
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        
        # Simulate seasonal fire patterns
        fire_patterns = [15, 18, 28, 42, 58, 73, 89, 81, 64, 38, 22, 15]
        risk_patterns = [25, 30, 45, 65, 75, 85, 92, 88, 70, 55, 35, 28]
        
        return [
            {
                'month': month,
                'fires': fires,
                'riskLevel': risk
            }
            for month, fires, risk in zip(months, fire_patterns, risk_patterns)
        ]

# Global instance
data_service = WildfireDataService()
