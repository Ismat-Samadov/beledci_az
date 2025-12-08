#!/bin/bash

# Setup script for Stock Predictor AI

echo "🚀 Stock Predictor AI - Setup Script"
echo "====================================="
echo ""

# Check if running in venv
if [[ "$VIRTUAL_ENV" == "" ]]; then
    echo "⚠️  Warning: Not running in a virtual environment"
    echo "Activate your venv first: source venv/bin/activate"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements-deploy.txt

# Check if model exists
if [ ! -f "models/stock_model.h5" ]; then
    echo ""
    echo "🤖 Training model (this may take 5-10 minutes)..."
    python train_model.py
else
    echo ""
    echo "✅ Model already exists. Skipping training."
    read -p "Retrain model? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        python train_model.py
    fi
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "  1. Run locally: uvicorn app.main:app --reload"
echo "  2. Run with Docker: docker-compose up --build"
echo "  3. Deploy to Render: Follow README-DEPLOYMENT.md"
echo ""
