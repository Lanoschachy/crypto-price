<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CRYPTO SIMPLE PRICE</title>
    <link rel="icon" href="logo.ico" type="image/x-icon">
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <h1>Bitcoin (BTC)</h1>
        <p style="text-align: center;"><span id="main-btc-price">Loading...</span></p>
        <div class="currency-toggle">
            <button class="currency-btn active" data-currency="USD">USD</button>
            <button class="currency-btn" data-currency="IDR">IDR</button>
        </div>
        <div class="crypto-grid">
            <div class="crypto-card">
                <h2>Ethereum (ETH)</h2>
                <p><span id="emas-price">Loading...</span></p>
                <p class="error-indicator" id="emas-error" style="display: none;">Gagal memuat indikator.</p>
            </div>
            <div class="crypto-card">
                <h2>XRP</h2>
                <p><span id="xrp-price">Loading...</span></p>
                <p class="error-indicator" id="xrp-error" style="display: none;">Gagal memuat indikator.</p>
            </div>
            <div class="crypto-card">
                <h2>USD/IDR</h2>
                <p><span id="usdidr-rate">Loading...</span></p>
                <p class="error-indicator" id="usdidr-error" style="display: none;">Gagal memuat indikator.</p>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
