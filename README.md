# Stock Price Prediction using LSTM

A comprehensive Jupyter notebook implementation for predicting stock prices using Long Short-Term Memory (LSTM) neural networks.

## Features

- Fetch real-time stock data using Yahoo Finance API
- Data preprocessing and normalization
- Exploratory data analysis with visualizations
- LSTM neural network model for time series prediction
- Model evaluation with multiple metrics (RMSE, MAE, R2, MAPE)
- Future price predictions (30-day forecast)
- Model saving and loading capabilities

## Installation

1. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install required packages:
```bash
pip install -r requirements.txt
```

## Usage

1. Launch Jupyter Notebook:
```bash
jupyter notebook
```

2. Open `stock_prediction.ipynb`

3. Run all cells sequentially or customize:
   - Change `STOCK_TICKER` variable to any stock symbol (e.g., 'AAPL', 'GOOGL', 'TSLA')
   - Adjust `START_DATE` and `END_DATE` for different time periods
   - Modify `SEQUENCE_LENGTH` to use different historical windows
   - Change `n_future_days` to predict different time horizons

## Model Architecture

The LSTM model consists of:
- 3 LSTM layers (50 units each) with dropout (0.2)
- 2 Dense layers for output
- Adam optimizer
- Mean Squared Error loss function

## Metrics Explained

- **RMSE** (Root Mean Squared Error): Lower is better, measures average prediction error
- **MAE** (Mean Absolute Error): Lower is better, average absolute difference
- **R2 Score**: Closer to 1 is better, explains variance in predictions
- **MAPE** (Mean Absolute Percentage Error): Lower is better, percentage error

## Output Files

After running the notebook:
- `stock_price_prediction_model.h5`: Trained model
- `scaler.pkl`: Data scaler for future predictions

## Important Disclaimer

This project is for **educational purposes only**. Stock price prediction is inherently uncertain and influenced by many unpredictable factors. Do not use these predictions for actual trading or investment decisions without:

- Additional fundamental and technical analysis
- Consulting with financial advisors
- Understanding the risks involved
- Conducting your own research

Past performance does not guarantee future results.

## Potential Improvements

- Add more features (technical indicators, volume patterns)
- Implement ensemble models
- Include sentiment analysis from news/social media
- Add attention mechanisms
- Try different architectures (GRU, Transformer)
- Implement walk-forward validation

## Requirements

- Python 3.8+
- TensorFlow 2.10+
- See `requirements.txt` for complete list

## License

This project is open source and available for educational use.
