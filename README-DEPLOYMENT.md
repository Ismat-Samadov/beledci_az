# Stock Predictor AI - Deployment Guide

A beautiful, production-ready stock price prediction app built with FastAPI, TensorFlow LSTM, and modern web technologies.

## Features

- 🤖 **AI-Powered Predictions**: LSTM Neural Network for time series forecasting
- 🎨 **Modern UI**: Beautiful dark-themed interface with smooth animations
- 📊 **Interactive Charts**: Real-time visualization using Chart.js
- 🐳 **Docker Ready**: Fully containerized for easy deployment
- ☁️ **Render Optimized**: One-click deployment to Render
- 📱 **Responsive**: Works perfectly on mobile and desktop

## Project Structure

```
stock_price_prediction/
├── app/
│   ├── main.py              # FastAPI application
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css    # Modern styling
│   │   └── js/
│   │       └── app.js       # Frontend logic
│   └── templates/
│       └── index.html       # Jinja2 template
├── models/                  # Trained models (created after training)
├── train_model.py          # Model training script
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose for local dev
├── render.yaml            # Render deployment config
└── requirements-deploy.txt # Production dependencies
```

## Local Development

### Option 1: Using Docker (Recommended)

1. **Train the model first:**
   ```bash
   # Activate your venv if needed
   source venv/bin/activate
   python train_model.py
   ```

2. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **Access the app:**
   Open http://localhost:8000

### Option 2: Direct Python

1. **Install dependencies:**
   ```bash
   source venv/bin/activate
   pip install -r requirements-deploy.txt
   ```

2. **Train the model:**
   ```bash
   python train_model.py
   ```

3. **Run the app:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

## Deployment to Render

### Prerequisites
- GitHub account
- Render account (free tier available)
- Trained model files in `models/` directory

### Step 1: Prepare Your Repository

1. **Train the model locally:**
   ```bash
   python train_model.py
   ```

2. **Commit the trained models:**
   ```bash
   git add models/
   git commit -m "Add trained model files"
   git push
   ```

### Step 2: Deploy to Render

#### Method 1: Using render.yaml (Automated)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml` and deploy your app
5. Wait for the build to complete (~5-10 minutes)

#### Method 2: Manual Setup

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: stock-predictor-ai
   - **Environment**: Docker
   - **Plan**: Free
   - **Health Check Path**: /health
5. Click "Create Web Service"

### Step 3: Access Your App

- Your app will be available at: `https://your-app-name.onrender.com`
- Free tier may sleep after 15 min of inactivity (first request will wake it up)

## Configuration

### Environment Variables (Optional)

You can add these in Render dashboard under "Environment":

```bash
PYTHON_VERSION=3.10
```

### Model Training Configuration

Edit `train_model.py` to customize:

```python
STOCK_TICKER = 'AAPL'  # Change ticker
START_DATE = '2015-01-01'  # Change start date
SEQUENCE_LENGTH = 60  # Days of history to use
TRAIN_SPLIT = 0.8  # Train/test split ratio
```

## API Endpoints

### GET `/`
Returns the main web interface

### GET `/health`
Health check endpoint for monitoring

### POST `/api/predict`
Predict stock prices

**Request Body:**
```json
{
  "ticker": "AAPL",
  "days": 30
}
```

**Response:**
```json
{
  "ticker": "AAPL",
  "current_price": 180.25,
  "predicted_price": 195.80,
  "price_change": 15.55,
  "percent_change": 8.63,
  "prediction_days": 30,
  "historical_data": {...},
  "future_data": {...}
}
```

### GET `/api/stock-info/{ticker}`
Get stock information

## Troubleshooting

### Build Fails on Render

**Issue**: Not enough memory during TensorFlow installation
**Solution**: Use the pre-built requirements-deploy.txt with specific versions

### Model Not Loading

**Issue**: Model files not found
**Solution**: Ensure models/ directory with trained files is committed to git

### Slow First Request

**Issue**: On Render free tier, app sleeps after inactivity
**Solution**: This is normal - subsequent requests will be fast

## Performance Optimization

### For Production

1. **Use persistent storage** for models (Render Disk)
2. **Enable caching** for model predictions
3. **Use Redis** for session management (optional)
4. **Scale up** to paid plan for better performance

### Model Improvements

- Train on more data (increase date range)
- Add more features (volume, technical indicators)
- Try different architectures (GRU, Transformer)
- Implement ensemble methods

## Tech Stack

- **Backend**: FastAPI 0.115.12
- **Frontend**: Vanilla JS, Chart.js, Jinja2
- **ML/AI**: TensorFlow 2.18, LSTM Neural Networks
- **Data**: yfinance, pandas, numpy
- **Containerization**: Docker
- **Deployment**: Render

## License

This project is for educational purposes only. Do not use for actual trading.

## Disclaimer

⚠️ **Important**: This application is for educational and demonstration purposes only. Stock price predictions are inherently uncertain and should not be used as the sole basis for investment decisions. Always conduct your own research and consult with financial advisors before making investment decisions.
