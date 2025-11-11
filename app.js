// Simple weather app using OpenWeatherMap API
// Replace 'YOUR_API_KEY' with your OpenWeatherMap API key (https://openweathermap.org/appid)
const API_KEY = 'YOUR_API_KEY';

const elements = {
  useLocationBtn: document.getElementById('use-location'),
  cityForm: document.getElementById('city-form'),
  cityInput: document.getElementById('city-input'),
  weatherCard: document.getElementById('weather-card'),
  locationName: document.getElementById('location-name'),
  weatherDesc: document.getElementById('weather-desc'),
  weatherIcon: document.getElementById('weather-icon'),
  tempValue: document.getElementById('temp-value'),
  feelsLike: document.getElementById('feels-like'),
  humidity: document.getElementById('humidity'),
  wind: document.getElementById('wind'),
  sunrise: document.getElementById('sunrise'),
  sunset: document.getElementById('sunset'),
  message: document.getElementById('message'),
};

function showMessage(msg){
  elements.message.textContent = msg;
}

function kelvinToCelsius(k){ return (k - 273.15).toFixed(1); }
function unixToTime(ts, tzOffset){
  // ts in seconds, tzOffset in seconds
  const d = new Date((ts + tzOffset) * 1000);
  return d.toUTCString().slice(-12,-7) + ' UTC';
}

async function fetchWeatherByCoords(lat, lon){
  showMessage('Fetching weather…');
  try{
    const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    if(!resp.ok) throw new Error('Location not found or invalid API key');
    const data = await resp.json();
    renderWeather(data);
  }catch(err){
    showMessage(err.message);
  }
}

async function fetchWeatherByCity(city){
  showMessage('Fetching weather…');
  try{
    const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}`);
    if(!resp.ok) throw new Error('City not found or invalid API key');
    const data = await resp.json();
    renderWeather(data);
  }catch(err){
    showMessage(err.message);
  }
}

function renderWeather(data){
  elements.weatherCard.classList.remove('hidden');
  elements.locationName.textContent = `${data.name}, ${data.sys.country}`;
  const desc = data.weather && data.weather[0] ? data.weather[0].description : '';
  elements.weatherDesc.textContent = desc;
  const iconCode = data.weather && data.weather[0] ? data.weather[0].icon : '01d';
  elements.weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  elements.tempValue.textContent = (data.main.temp - 273.15).toFixed(1);
  elements.feelsLike.textContent = (data.main.feels_like - 273.15).toFixed(1);
  elements.humidity.textContent = data.main.humidity;
  elements.wind.textContent = data.wind.speed;
  const tz = data.timezone; // seconds offset from UTC
  elements.sunrise.textContent = unixToTime(data.sys.sunrise, tz);
  elements.sunset.textContent = unixToTime(data.sys.sunset, tz);
  showMessage('');
}

// Event listeners
elements.useLocationBtn.addEventListener('click', () => {
  if(!navigator.geolocation){
    showMessage('Geolocation not supported in this browser.');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
    (err) => showMessage('Permission denied or unavailable. Try entering a city manually.')
  );
});

elements.cityForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = elements.cityInput.value.trim();
  if(!city) { showMessage('Please enter a city name.'); return; }
  fetchWeatherByCity(city);
});

// Helpful note shown in console
console.log('Weather app loaded. Remember to replace YOUR_API_KEY in app.js with your OpenWeatherMap API key.');
