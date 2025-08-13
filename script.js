const apiKey = 'b42236ba0aef516dd0ae1e2fdad44696';

const searchForm = document.querySelector('#search-form');
const cityInput = document.querySelector('#city-input');
const weatherInfoContainer = document.querySelector('#weather-info-container');
const forecastContainer = document.querySelector('#forecast');

// โหลดเมืองล่าสุด
window.addEventListener('load', () => {
    const lastCity = localStorage.getItem('lastCity');
    if(lastCity) {
        cityInput.value = lastCity;
        getWeather(lastCity);
    }
});

//-- Event Listener --//
searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const cityName = cityInput.value.trim();
    if(cityName) {
        localStorage.setItem('lastCity', cityName);
        getWeather(cityName);
    } else {
        alert('กรุณาป้อนชื่อเมือง');
    }
});

//-- getWeather --//
async function getWeather(city) {
    weatherInfoContainer.innerHTML = `<p>กำลังโหลดข้อมูล...</p>`;
    forecastContainer.innerHTML = '';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=th`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('ไม่พบข้อมูลเมืองนี้');
        const data = await response.json();
        displayWeather(data);
        getForecast(data.name);
    } catch (error) {
        weatherInfoContainer.innerHTML = `<p class="error">${error.message}</p>`;
    }
}

//-- displayWeather --//
function displayWeather(data) {
    const { name, main, weather } = data;
    const { temp, humidity } = main;
    const { description, icon } = weather[0];

    updateBackground(description);

    const weatherHtml = `
        <h2>${name}</h2>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
        <p class="temp">${temp.toFixed(1)}°C</p>
        <p>${description}</p>
        <p>ความชื้น: ${humidity}%</p>
    `;
    weatherInfoContainer.innerHTML = weatherHtml;
}

//-- เปลี่ยน Background --//
function updateBackground(weather) {
    const body = document.body;
    body.className = '';
    weather = weather.toLowerCase();
    if(weather.includes('rain')) body.classList.add('rainy');
    else if(weather.includes('cloud')) body.classList.add('cloudy');
    else if(weather.includes('clear')) body.classList.add('sunny');
    else body.classList.add('night');
}

//-- พยากรณ์อากาศ 5 วัน --//
async function getForecast(city) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=th`;
    try {
        const res = await fetch(forecastUrl);
        const data = await res.json();
        displayForecast(data);
    } catch(err) {
        console.error('Forecast error', err);
    }
}

function displayForecast(data) {
    const forecastList = data.list.filter(item => item.dt_txt.includes('12:00:00'));
    let html = '';
    forecastList.forEach(f => {
        const date = new Date(f.dt_txt).toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric', month: 'short' });
        html += `
            <div class="forecast-card">
                <h4>${date}</h4>
                <img src="https://openweathermap.org/img/wn/${f.weather[0].icon}@2x.png" alt="${f.weather[0].description}">
                <p>${f.weather[0].description}</p>
                <p>${f.main.temp.toFixed(1)}°C</p>
            </div>
        `;
    });
    forecastContainer.innerHTML = html;
}



