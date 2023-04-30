//VARIABLES
const baseUrl = "http://api.weatherapi.com/v1/forecast.json";
const API_KEY = "10813b6b12ef4c47be194120233004";
const cityAndCountry = document.querySelector(".location-and-date__location");
const currentDate = document.querySelector(".location-and-date__date");
const currentWeatherImage = document.querySelector(".current-temperature__icon");
const currentTempValue = document.querySelector(".current-temperature__value");
const currentTempSummary = document.querySelector(".current-temperature__summary");
const lowestTempStat = document.getElementById("low");
const higestTempStat = document.getElementById("high");
const windStat = document.getElementById("wind");
const humidityStat = document.getElementById("humidity");
const sunriseStat = document.getElementById("sunrise");
const sunsetStat = document.getElementById("sunset");

const responsePromise = getUserLocation()
  .then((location) => {
    return getWeatherData(location.lat, location.lon);
  })
  .then((data) => {
    return data;
  })
  .catch((error) => console.error(error));

//EVENT LISTENERS
window.addEventListener("load", () => {
  document.querySelector("html").style.filter = "none";
});

//FUNCTIONS
function getUserLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ lat: latitude, lon: longitude });
      },
      (error) => {
        reject(error);
      }
    );
  });
}

function getWeatherData(lat, lon) {
  const url = `${baseUrl}?key=${API_KEY}&q=${lat},${lon}&days=6&aqi=no&alerts=no`;
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

function setCurrentWeatherData() {
  responsePromise.then((data) => {
    cityAndCountry.innerHTML = `${data.location.name}, ${data.location.country}`;
    const dateUnformatted = data.location.localtime.split(" ")[0];
    const date = dayjs(dateUnformatted, "YYYY-MM-DD");
    currentDate.innerHTML = date.format("dddd, D MMMM");
    currentWeatherImage.src = data.current.condition.icon;
    currentTempValue.innerHTML = Math.floor(data.current.temp_c);
    currentTempSummary.innerHTML = data.current.condition.text;
  });
}

function setDailyWeatherStats() {
  responsePromise.then((data) => {
    higestTempStat.innerHTML = Math.floor(data.forecast.forecastday[0].day.maxtemp_c);
    lowestTempStat.innerHTML = Math.floor(data.forecast.forecastday[0].day.mintemp_c);
    humidityStat.innerHTML = `${data.current.humidity} %`;
    windStat.innerHTML = `${data.current.wind_mph} mph`;
    sunriseStat.innerHTML = data.forecast.forecastday[0].astro.sunrise;
    sunsetStat.innerHTML = data.forecast.forecastday[0].astro.sunset;
  });
}

//FUNCTION CALLS
setCurrentWeatherData();
setDailyWeatherStats();
