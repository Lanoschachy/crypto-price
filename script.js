const mainBtcPriceElement = document.getElementById('main-btc-price');
const ethPriceElement = document.getElementById('emas-price');
const xrpPriceElement = document.getElementById('xrp-price');
const usdidrRateElement = document.getElementById('usdidr-rate');
const btcErrorElement = document.getElementById('btc-error');
const ethErrorElement = document.getElementById('emas-error');
const xrpErrorElement = document.getElementById('xrp-error');
const usdidrErrorElement = document.getElementById('usdidr-error');
const currentCurrencySpan = document.getElementById('current-currency');
const currencyButtons = document.querySelectorAll('.currency-btn');

let currentCurrency = 'USD'; // Set default ke USD
let latestBtcUsdPrice = null;
let latestEthUsdPrice = null;
let latestXrpUsdPrice = null;
let latestUsdIdrRate = null;

const googleSheetCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSkJHV4n7P9jIsu7mPdGX-8wSlXowKcB0hazHa8NJkJ-Hpljl6eiEv8eMFHj_KUhihx87PXVPL_Ya_v/pub?output=csv'; // Ganti dengan URL CSV Anda

async function fetchUsdIdrRate() {
    try {
        const response = await fetch(googleSheetCsvUrl);
        const text = await response.text();

        const firstLine = text.split('\n')[0]; // Ambil baris pertama
        const rawRate = firstLine.replace(/"/g, '').trim(); // Hilangkan tanda kutip dan spasi
        const cleanedText = rawRate.replace(/\./g, '').replace(',', '.'); // "16.294,05" → "16294.05"
        const rate = parseFloat(cleanedText);

        if (!isNaN(rate)) {
            latestUsdIdrRate = rate;
            usdidrRateElement.textContent = `Rp ${formatIdrSimple(latestUsdIdrRate)}`;
            usdidrErrorElement.style.display = 'none';
            updateDisplayedPrices();
            console.log('Nilai Tukar USD/IDR dari Google Sheet:', latestUsdIdrRate);
        } else {
            console.error('Gagal mem-parsing nilai tukar USD/IDR dari Google Sheet:', rawRate);
            usdidrErrorElement.style.display = 'block';
            usdidrRateElement.textContent = 'Gagal memuat...';
        }
    } catch (error) {
        console.error('Gagal mengambil data nilai tukar USD/IDR dari Google Sheet:', error);
        usdidrErrorElement.style.display = 'block';
        usdidrRateElement.textContent = 'Gagal memuat...';
    }
}


// Perbarui nilai tukar setiap beberapa detik (misalnya 10 detik)
setInterval(fetchUsdIdrRate, 10000);
fetchUsdIdrRate(); // Panggil pertama kali saat halaman dimuat

const ws = new WebSocket('wss://stream.binance.com:9443/ws');

ws.onopen = () => {
    console.log('Terhubung ke WebSocket Binance untuk harga kripto');
    ws.send(JSON.stringify({
        method: 'SUBSCRIBE',
        params: [
            'btcusdt@ticker',
            'ethusdt@ticker',
            'xrpusdt@ticker'
        ],
        id: 1
    }));
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.s === 'BTCUSDT') {
        latestBtcUsdPrice = parseFloat(data.c);
        updatePriceDisplay('BITCOIN', latestBtcUsdPrice);
        btcErrorElement.style.display = 'none';
    } else if (data.s === 'ETHUSDT') {
        latestEthUsdPrice = parseFloat(data.c);
        updatePriceDisplay('ETHEREUM', latestEthUsdPrice);
        ethErrorElement.style.display = 'none';
    } else if (data.s === 'XRPUSDT') {
        const usdPrice = parseFloat(data.c);
        updatePriceDisplay('XRP', usdPrice);
        xrpErrorElement.style.display = 'none';
    }
};

ws.onerror = (error) => {
    console.error('WebSocket Error (Kripto):', error);
    btcErrorElement.style.display = 'block';
    ethErrorElement.style.display = 'block';
    xrpErrorElement.style.display = 'block';
};

ws.onclose = () => {
    console.log('Koneksi WebSocket (Kripto) ditutup');
    btcErrorElement.style.display = 'block';
    ethErrorElement.style.display = 'block';
    xrpErrorElement.style.display = 'block';
};

currencyButtons.forEach(button => {
    button.addEventListener('click', () => {
        currencyButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentCurrency = button.getAttribute('data-currency');
        currentCurrencySpan.textContent = currentCurrency;
        updateDisplayedPrices();
    });
});

function updateDisplayedPrices() {
    if (latestBtcUsdPrice !== null) {
        updatePriceDisplay('BITCOIN', latestBtcUsdPrice);
    }
    if (latestEthUsdPrice !== null) {
        updatePriceDisplay('ETHEREUM', latestEthUsdPrice);
    }
    if (latestXrpUsdPrice !== null) {
        updatePriceDisplay('XRP', latestXrpUsdPrice);
    }
    if (latestUsdIdrRate !== null) {
        usdidrRateElement.textContent = `Rp ${formatIdrSimple(latestUsdIdrRate)}`;
    } else {
        usdidrRateElement.textContent = 'Loading...';
    }
}

function updatePriceDisplay(crypto, usdPrice) {
    let formattedPrice = 'Loading...';
    if (!isNaN(usdPrice)) {
        if (currentCurrency === 'USD') {
            formattedPrice = `$${formatUsd(usdPrice)}`;
        } else if (currentCurrency === 'IDR' && latestUsdIdrRate) {
            formattedPrice = formatIdr(usdPrice * latestUsdIdrRate);
        }
    }

    if (crypto === 'BITCOIN') {
        mainBtcPriceElement.textContent = formattedPrice;
    } else if (crypto === 'ETHEREUM') {
        ethPriceElement.textContent = formattedPrice;
    } else if (crypto === 'XRP') {
        xrpPriceElement.textContent = formattedPrice;
    }
}

function formatIdr(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

function formatIdrSimple(amount) {
    return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

function formatUsd(amount) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4
    }).format(amount);
}


// Inisialisasi tampilan mata uang
currentCurrencySpan.textContent = currentCurrency;
currencyButtons.forEach(button => {
    if (button.getAttribute('data-currency') === currentCurrency) {
        button.classList.add('active');
    } else {
        button.classList.remove('active');
    }
});
updateDisplayedPrices();
