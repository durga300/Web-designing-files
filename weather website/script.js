class WeatherApp {
    constructor() {
        this.apiKey = 'e4512c5a570e3a3b214fa9ac6a1ab6e2'; // Replace with your actual API key
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadDefaultWeather();
    }

    bindEvents() {
        const searchBtn = document.getElementById('searchBtn');
        const cityInput = document.getElementById('cityInput');
        const locationBtn = document.getElementById('locationBtn');

        searchBtn.addEventListener('click', () => this.searchWeather());
        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchWeather();
            }
        });
        locationBtn.addEventListener('click', () => this.getCurrentLocation());
    }

    async searchWeather() {
        const city = document.getElementById('cityInput').value.trim();
        if (!city) {
            this.showError('Please enter a city name');
            return;
        }
        
        this.showLoading();
        try {
            await this.fetchWeatherData(city);
        } catch (error) {
            this.showError('City not found. Please check the spelling and try again.');
        }
    }

    async getCurrentLocation() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by this browser');
            return;
        }

        this.showLoading();
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    await this.fetchWeatherByCoords(latitude, longitude);
                } catch (error) {
                    this.showError('Unable to fetch weather data for your location');
                }
            },
            () => {
                this.showError('Unable to retrieve your location');
            }
        );
    }

    async fetchWeatherData(city) {
        try {
            // For real API implementation, uncomment the following:
            /*
            const response = await fetch(`${this.baseUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric`);
            if (!response.ok) throw new Error('Weather data not found');
            const data = await response.json();
            
            const forecastResponse = await fetch(`${this.baseUrl}/forecast?q=${city}&appid=${this.apiKey}&units=metric`);
            const forecastData = await forecastResponse.json();
            
            this.displayWeatherData(data, forecastData);
            */
            
            // Using mock data for demonstration
            await this.simulateApiCall();
            this.displayWeatherData(this.getMockWeatherData(city));
        } catch (error) {
            throw error;
        }
    }

    async fetchWeatherByCoords(lat, lon) {
        try {
            // For real API implementation, uncomment the following:
            /*
            const response = await fetch(`${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`);
            if (!response.ok) throw new Error('Weather data not found');
            const data = await response.json();
            
            const forecastResponse = await fetch(`${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`);
            const forecastData = await forecastResponse.json();
            
            this.displayWeatherData(data, forecastData);
            */
            
            // Using mock data for demonstration
            await this.simulateApiCall();
            this.displayWeatherData(this.getMockWeatherData('Hyderabad'));
        } catch (error) {
            throw error;
        }
    }

    async simulateApiCall() {
        return new Promise(resolve => setTimeout(resolve, 1000));
    }

    getMockWeatherData(city) {
        const weatherConditions = [
            { icon: 'fas fa-sun', desc: 'sunny', temp: 28 },
            { icon: 'fas fa-cloud-sun', desc: 'partly cloudy', temp: 24 },
            { icon: 'fas fa-cloud-rain', desc: 'rainy', temp: 18 },
            { icon: 'fas fa-cloud', desc: 'cloudy', temp: 20 },
            { icon: 'fas fa-snowflake', desc: 'snowy', temp: -2 }
        ];

        const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
        
        return {
            name: city,
            main: {
                temp: randomWeather.temp,
                feels_like: randomWeather.temp + Math.floor(Math.random() * 6) - 3,
                humidity: Math.floor(Math.random() * 40) + 40,
                pressure: Math.floor(Math.random() * 50) + 1000
            },
            weather: [{
                description: randomWeather.desc,
                icon: randomWeather.icon
            }],
            wind: {
                speed: Math.floor(Math.random() * 20) + 5
            },
            visibility: Math.floor(Math.random() * 15) + 5,
            forecast: this.generateForecast()
        };
    }

    generateForecast() {
        const days = ['Tomorrow', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const icons = ['fas fa-sun', 'fas fa-cloud-sun', 'fas fa-cloud-rain', 'fas fa-cloud', 'fas fa-snowflake'];
        
        return days.map((day, index) => ({
            day: day,
            icon: icons[Math.floor(Math.random() * icons.length)],
            high: Math.floor(Math.random() * 15) + 20,
            low: Math.floor(Math.random() * 10) + 10
        }));
    }

    displayWeatherData(data) {
        this.hideLoading();
        this.hideError();
        
        // Update current weather
        document.getElementById('cityName').textContent = data.name;
        document.getElementById('currentDate').textContent = this.getCurrentDate();
        document.getElementById('mainTemp').textContent = `${Math.round(data.main.temp)}°C`;
        document.getElementById('weatherIcon').className = data.weather[0].icon;
        document.getElementById('weatherDescription').textContent = data.weather[0].description;
        document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
        
        // Update weather stats
        document.getElementById('visibility').textContent = `${data.visibility} km`;
        document.getElementById('humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('windSpeed').textContent = `${Math.round(data.wind.speed)} km/h`;
        document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
        
        // Update forecast
        this.displayForecast(data.forecast);
        
        // Show weather container
        document.getElementById('weatherContainer').classList.add('show');
        
        // Clear search input
        document.getElementById('cityInput').value = '';
    }

    displayForecast(forecast) {
        const forecastList = document.getElementById('forecastList');
        forecastList.innerHTML = '';
        
        forecast.forEach(item => {
            const forecastItem = document.createElement('div');
            forecastItem.className = 'forecast-item';
            forecastItem.innerHTML = `
                <div class="forecast-day">${item.day}</div>
                <div class="forecast-icon">
                    <i class="${item.icon}"></i>
                </div>
                <div class="forecast-temps">
                    <span class="forecast-high">${item.high}°</span>
                    <span class="forecast-low">${item.low}°</span>
                </div>
            `;
            forecastList.appendChild(forecastItem);
        });
    }

    showLoading() {
        document.getElementById('loading').classList.add('show');
        document.getElementById('weatherContainer').classList.remove('show');
        document.getElementById('errorMessage').classList.remove('show');
    }

    hideLoading() {
        document.getElementById('loading').classList.remove('show');
    }

    showError(message) {
        this.hideLoading();
        document.getElementById('errorText').textContent = message;
        document.getElementById('errorMessage').classList.add('show');
        document.getElementById('weatherContainer').classList.remove('show');
    }

    hideError() {
        document.getElementById('errorMessage').classList.remove('show');
    }

    getCurrentDate() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return now.toLocaleDateString('en-US', options);
    }

    loadDefaultWeather() {
        // Load default weather for demonstration
        setTimeout(() => {
            this.displayWeatherData(this.getMockWeatherData('Hyderabad'));
        }, 500);
    }
}

// Initialize the weather app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});