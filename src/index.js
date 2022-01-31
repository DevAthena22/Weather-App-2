function formatDate(timestamp) {
  let now = new Date(timestamp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  let day = now.getDay();
  let today = days[now.getDay()];

  let hours = now.getHours();
  let minutes = now.getMinutes();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `Last updated ${today}, ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2">
        <div class="weather-forecast-date">
        ${formatDay(forecastDay.dt)}</div>
        <div>
          <img
                  src="https://openweathermap.org/img/wn/${
                    forecastDay.weather[0].icon
                  }@2x.png"
                  alt=""
                  id="forecast-icon"
                />
        </div>
        <div class="weather-forecast-temperatures">
         <span class="weather-forecast-temperature-max">${Math.round(
           forecastDay.temp.max
         )}°</span>
         <span class="weather-forecast-temperature-min">${Math.round(
           forecastDay.temp.min
         )}°</span>
        </div>
      </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function retrievePosition(position) {
  let apiKey = "a43a933ee08be334d6f5d62e405ad630";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(url).then(displayTemperature);
}

function startGeolocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(retrievePosition);
}

let currentLocationIconButton = document.querySelector(
  "#current-location-icon"
);
currentLocationIconButton.addEventListener("click", startGeolocation);

function getForecast(coordinates) {
  let apiKey = "a43a933ee08be334d6f5d62e405ad630";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#main-temperature");
  let cityElement = document.querySelector("#show-location");
  let dateElement = document.querySelector("#app-date");
  let weatherIcon = document.querySelector("#main-weather-icon");
  let descriptionElement = document.querySelector("#description");
  let feelsLikeElement = document.querySelector("#feelsLike");
  let windspeedElement = document.querySelector("#wind-speed");
  let humidityElement = document.querySelector("#humidity");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  document.querySelector("#celsius-link").innerHTML = `<strong>°C</strong>`;
  document.querySelector("#fahrenheit-link").innerHTML = `°F`;

  celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = `${Math.round(celsiusTemperature)}°`;
  cityElement.innerHTML = response.data.name;

  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  weatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  descriptionElement.innerHTML = `${response.data.weather[0].description}`;
  feelsLikeElement.innerHTML = `Feels like ${Math.round(
    response.data.main.feels_like
  )}°C`;
  windspeedElement.innerHTML = `<br/>Wind Speed: ${
    Math.round(response.data.wind.speed) * 3.6
  } km/hr`;
  humidityElement.innerHTML = `Humidity: ${response.data.main.humidity}%`;

  getForecast(response.data.coord);
}

function search(city) {
  let apiKey = "a43a933ee08be334d6f5d62e405ad630";
  let unitMetric = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unitMetric}`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#enter-location");
  search(cityInputElement.value);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#main-temperature");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = `${Math.round(fahrenheitTemperature)}°`;
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  document.querySelector("#fahrenheit-link").innerHTML = `<strong>°F</strong>`;
  document.querySelector("#celsius-link").innerHTML = `°C`;
}

function displaycelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#main-temperature");
  temperatureElement.innerHTML = `${Math.round(celsiusTemperature)}°`;
  document.querySelector("#celsius-link").innerHTML = `<strong>°C</strong>`;
  document.querySelector("#fahrenheit-link").innerHTML = `°F`;
}

let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displaycelsiusTemperature);

search("Melbourne");
