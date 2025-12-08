"""
Train LSTM model for stock price prediction
"""
import numpy as np
import pandas as pd
import yfinance as yf
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Dropout
from tensorflow.keras.callbacks import EarlyStopping
import joblib
import os
from datetime import datetime

# Configuration
STOCK_TICKER = 'AAPL'
START_DATE = '2015-01-01'
END_DATE = datetime.now().strftime('%Y-%m-%d')
SEQUENCE_LENGTH = 60
TRAIN_SPLIT = 0.8

def fetch_stock_data(ticker, start_date, end_date):
    """Fetch stock data from Yahoo Finance"""
    print(f"Fetching data for {ticker}...")

    # Try using Ticker object first (more reliable)
    try:
        stock = yf.Ticker(ticker)
        df = stock.history(start=start_date, end=end_date, auto_adjust=False)

        if df.empty:
            print("Trying alternative download method...")
            df = yf.download(ticker, start=start_date, end=end_date, progress=False, auto_adjust=False)
    except Exception as e:
        print(f"Error with Ticker method: {e}")
        print("Trying download method...")
        df = yf.download(ticker, start=start_date, end=end_date, progress=False, auto_adjust=False)

    # Flatten column names if multi-index
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.droplevel(1)

    if df.empty:
        raise ValueError(f"No data downloaded for {ticker}. Please check the ticker symbol and try again.")

    return df

def create_sequences(data, sequence_length):
    """Create sequences for LSTM training"""
    X, y = [], []
    for i in range(sequence_length, len(data)):
        X.append(data[i-sequence_length:i, 0])
        y.append(data[i, 0])
    return np.array(X), np.array(y)

def build_model(sequence_length):
    """Build LSTM model"""
    model = Sequential([
        LSTM(units=50, return_sequences=True, input_shape=(sequence_length, 1)),
        Dropout(0.2),

        LSTM(units=50, return_sequences=True),
        Dropout(0.2),

        LSTM(units=50, return_sequences=False),
        Dropout(0.2),

        Dense(units=25),
        Dense(units=1)
    ])

    model.compile(optimizer='adam', loss='mean_squared_error', metrics=['mae'])
    return model

def train_and_save_model():
    """Main training function"""
    # Fetch data
    df = fetch_stock_data(STOCK_TICKER, START_DATE, END_DATE)
    data = df[['Close']].copy()

    print(f"Data shape: {data.shape}")

    # Scale data
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data)

    # Create sequences
    X, y = create_sequences(scaled_data, SEQUENCE_LENGTH)

    # Split data
    train_size = int(len(X) * TRAIN_SPLIT)
    X_train = X[:train_size]
    y_train = y[:train_size]
    X_test = X[train_size:]
    y_test = y[train_size:]

    # Reshape for LSTM
    X_train = X_train.reshape((X_train.shape[0], X_train.shape[1], 1))
    X_test = X_test.reshape((X_test.shape[0], X_test.shape[1], 1))

    print(f"Training samples: {X_train.shape[0]}")
    print(f"Test samples: {X_test.shape[0]}")

    # Build model
    print("Building model...")
    model = build_model(SEQUENCE_LENGTH)

    # Train model
    print("Training model...")
    early_stopping = EarlyStopping(
        monitor='val_loss',
        patience=10,
        restore_best_weights=True,
        verbose=1
    )

    history = model.fit(
        X_train, y_train,
        batch_size=32,
        epochs=50,
        validation_split=0.1,
        callbacks=[early_stopping],
        verbose=1
    )

    # Evaluate
    test_loss, test_mae = model.evaluate(X_test, y_test, verbose=0)
    print(f"\nTest Loss: {test_loss:.6f}")
    print(f"Test MAE: {test_mae:.6f}")

    # Create models directory if it doesn't exist
    os.makedirs('models', exist_ok=True)

    # Save model and scaler
    model.save('models/stock_model.h5')
    joblib.dump(scaler, 'models/scaler.pkl')

    # Save metadata
    metadata = {
        'ticker': STOCK_TICKER,
        'sequence_length': SEQUENCE_LENGTH,
        'test_loss': float(test_loss),
        'test_mae': float(test_mae),
        'train_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    joblib.dump(metadata, 'models/metadata.pkl')

    print("\nModel and scaler saved successfully!")
    print(f"Model: models/stock_model.h5")
    print(f"Scaler: models/scaler.pkl")
    print(f"Metadata: models/metadata.pkl")

    return model, scaler, metadata

if __name__ == "__main__":
    train_and_save_model()
