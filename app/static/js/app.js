// Stock Prediction App

let predictionChart = null;

// DOM Elements
const form = document.getElementById('predictionForm');
const predictBtn = document.getElementById('predictBtn');
const btnText = document.querySelector('.btn-text');
const loader = document.querySelector('.loader');
const resultsSection = document.getElementById('resultsSection');
const errorAlert = document.getElementById('errorAlert');
const errorMessage = document.getElementById('errorMessage');
const stockInfo = document.getElementById('stockInfo');

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const ticker = document.getElementById('ticker').value.trim().toUpperCase();
    const days = parseInt(document.getElementById('days').value);

    if (!ticker) {
        showError('Please enter a stock ticker symbol');
        return;
    }

    // Hide previous results and errors
    hideError();
    resultsSection.style.display = 'none';
    stockInfo.style.display = 'none';

    // Show loading state
    setLoadingState(true);

    try {
        // Fetch stock info
        await fetchStockInfo(ticker);

        // Fetch prediction
        const response = await fetch('/api/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ticker, days }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Prediction failed');
        }

        const data = await response.json();
        displayResults(data);

    } catch (error) {
        showError(error.message);
    } finally {
        setLoadingState(false);
    }
});

// Fetch stock information
async function fetchStockInfo(ticker) {
    try {
        const response = await fetch(`/api/stock-info/${ticker}`);
        if (response.ok) {
            const info = await response.json();
            displayStockInfo(info);
        }
    } catch (error) {
        // Stock info is optional, don't show error
        console.error('Error fetching stock info:', error);
    }
}

// Display stock information
function displayStockInfo(info) {
    document.getElementById('stockName').textContent = info.name;
    document.getElementById('stockSector').textContent = info.sector;
    document.getElementById('stockIndustry').textContent = info.industry;
    stockInfo.style.display = 'block';
}

// Display prediction results
function displayResults(data) {
    // Update summary cards
    document.getElementById('currentPrice').textContent = `$${data.current_price.toFixed(2)}`;
    document.getElementById('predictedPrice').textContent = `$${data.predicted_price.toFixed(2)}`;

    const changeElement = document.getElementById('priceChange');
    const changeText = `$${Math.abs(data.price_change).toFixed(2)} (${data.percent_change >= 0 ? '+' : ''}${data.percent_change.toFixed(2)}%)`;
    changeElement.textContent = changeText;

    // Add color class based on change
    changeElement.classList.remove('positive', 'negative');
    changeElement.classList.add(data.percent_change >= 0 ? 'positive' : 'negative');

    // Create chart
    createChart(data);

    // Show results
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Create prediction chart
function createChart(data) {
    const ctx = document.getElementById('predictionChart').getContext('2d');

    // Destroy previous chart if exists
    if (predictionChart) {
        predictionChart.destroy();
    }

    // Combine historical and future data
    const allDates = [...data.historical_data.dates, ...data.future_data.dates];
    const historicalPrices = data.historical_data.prices;
    const futurePrices = Array(data.historical_data.dates.length).fill(null).concat(data.future_data.prices);

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');

    const futureGradient = ctx.createLinearGradient(0, 0, 0, 400);
    futureGradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
    futureGradient.addColorStop(1, 'rgba(139, 92, 246, 0.0)');

    predictionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: allDates,
            datasets: [
                {
                    label: 'Historical Price',
                    data: historicalPrices,
                    borderColor: '#6366f1',
                    backgroundColor: gradient,
                    borderWidth: 2,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    fill: true,
                    tension: 0.4,
                },
                {
                    label: 'Predicted Price',
                    data: futurePrices,
                    borderColor: '#8b5cf6',
                    backgroundColor: futureGradient,
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    fill: true,
                    tension: 0.4,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index',
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#f1f5f9',
                        padding: 15,
                        font: {
                            size: 12,
                            family: 'Inter'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    titleColor: '#f1f5f9',
                    bodyColor: '#f1f5f9',
                    borderColor: '#334155',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += '$' + context.parsed.y.toFixed(2);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: '#334155',
                        drawBorder: false,
                    },
                    ticks: {
                        color: '#94a3b8',
                        maxTicksLimit: 8,
                        font: {
                            size: 11
                        }
                    }
                },
                y: {
                    grid: {
                        color: '#334155',
                        drawBorder: false,
                    },
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) {
                            return '$' + value.toFixed(0);
                        },
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorAlert.style.display = 'flex';
    errorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    setTimeout(() => {
        hideError();
    }, 5000);
}

// Hide error message
function hideError() {
    errorAlert.style.display = 'none';
}

// Set loading state
function setLoadingState(loading) {
    if (loading) {
        predictBtn.disabled = true;
        btnText.style.display = 'none';
        loader.style.display = 'inline-block';
        form.classList.add('loading');
    } else {
        predictBtn.disabled = false;
        btnText.style.display = 'inline';
        loader.style.display = 'none';
        form.classList.remove('loading');
    }
}

// Format ticker input to uppercase
document.getElementById('ticker').addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase();
});
