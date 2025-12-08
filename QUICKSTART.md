# Quick Start Guide

## 1. Train the Model

First, activate your virtual environment and train the model:

```bash
source venv/bin/activate
python train_model.py
```

This will:
- Fetch AAPL stock data from Yahoo Finance
- Train an LSTM neural network
- Save the model to `models/stock_model.h5`
- Save the scaler to `models/scaler.pkl`

Training takes ~5-10 minutes depending on your machine.

## 2. Run Locally

### Option A: Direct Python

```bash
# Activate venv
source venv/bin/activate

# Install production dependencies
pip install -r requirements-deploy.txt

# Run the app
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Option B: Docker Compose

```bash
# Build and run
docker-compose up --build

# Access at http://localhost:8000
```

## 3. Test the App

1. Open http://localhost:8000
2. Enter a stock ticker (e.g., AAPL, GOOGL, MSFT)
3. Select prediction period (1-90 days)
4. Click "Predict Price"
5. View the interactive chart and predictions!

## 4. Deploy to Render

1. **Commit your code including trained models:**
   ```bash
   git add .
   git commit -m "Add stock predictor app"
   git push
   ```

2. **Go to Render Dashboard:**
   - Visit https://dashboard.render.com/
   - Click "New" → "Blueprint"
   - Connect your GitHub repo
   - Render will detect `render.yaml` and deploy automatically

3. **Access your deployed app:**
   - URL: `https://your-app-name.onrender.com`

## API Examples

### Get Prediction

```bash
curl -X POST http://localhost:8000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"ticker": "AAPL", "days": 30}'
```

### Get Stock Info

```bash
curl http://localhost:8000/api/stock-info/AAPL
```

### Health Check

```bash
curl http://localhost:8000/health
```

## Troubleshooting

**Port already in use:**
```bash
# Change port
uvicorn app.main:app --port 8080
```

**Model not found:**
```bash
# Retrain the model
python train_model.py
```

**Dependencies issues:**
```bash
# Reinstall
pip install --upgrade -r requirements-deploy.txt
```

## Next Steps

- Customize the model in `train_model.py`
- Modify the UI in `app/templates/index.html`
- Add new endpoints in `app/main.py`
- Deploy to production on Render!

🎉 Happy predicting!
