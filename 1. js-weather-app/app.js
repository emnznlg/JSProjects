//VARIABLES
const baseUrl = "http://api.weatherapi.com/v1/forecast.json";
const API_KEY = "PRIVATE_API_KEY";
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
const nextFiveDaysContainer = document.querySelector(".next-5-days__container");
const weatherByHourContainer = document.querySelector(".weather-by-hour__container");

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
    currentTempValue.innerHTML = Math.floor(data.current.temp_c) + `&deg;`;
    currentTempSummary.innerHTML = data.current.condition.text;
  });
}

function setDailyWeatherStats() {
  responsePromise.then((data) => {
    higestTempStat.innerHTML = Math.floor(data.forecast.forecastday[0].day.maxtemp_c) + `&deg;`;
    lowestTempStat.innerHTML = Math.floor(data.forecast.forecastday[0].day.mintemp_c) + `&deg;`;
    humidityStat.innerHTML = `${data.current.humidity} %`;
    windStat.innerHTML = `${data.current.wind_mph} mph`;
    sunriseStat.innerHTML = data.forecast.forecastday[0].astro.sunrise;
    sunsetStat.innerHTML = data.forecast.forecastday[0].astro.sunset;
  });
}

function setHourlyWeatherData() {
  responsePromise.then((data) => {
    for (let i = 3; i < 22; i = i + 3) {
      const e = document.createElement("div");
      const ampm = i < 12 ? "am" : "pm";

      e.className = "weather-by-hour__item";
      e.innerHTML = `
        <div class="weather-by-hour__hour">${i}${ampm}</div>
        <img src="${data.forecast.forecastday[0].hour[i].condition.icon}" />
        <div id="3am">${data.forecast.forecastday[0].hour[i].temp_c}&deg;</div>`;
      weatherByHourContainer.appendChild(e);
    }
  });
}

function setNextFiveDaysData() {
  responsePromise.then((data) => {
    for (let i = 1; i < 6; i++) {
      const date = `${data.forecast.forecastday[i].date}`;
      const formattedDate = dayjs(date).format("D/M");
      const formattedDateName = dayjs(date).format("ddd");
      const e = document.createElement("div");
      e.className = "next-5-days__row";
      e.innerHTML = `<div class="next-5-days__date">
    ${formattedDateName}
    <div class="next-5-days__label">${formattedDate}</div>
    </div>
    <div class="next-5-days__low">
      ${data.forecast.forecastday[i].day.mintemp_c}&deg;
      <div class="next-5-days__label">Low</div>
    </div>
    <div class="next-5-days__high">
      ${data.forecast.forecastday[i].day.maxtemp_c}&deg;
      <div class="next-5-days__label">High</div>
    </div>
    <div class="next-5-days__icon">
      <img src="${data.forecast.forecastday[i].day.condition.icon}" />
    </div>
    <div class="next-5-days__rain">
      ${data.forecast.forecastday[i].day.avghumidity}%
      <div class="next-5-days__label">Humidity</div>
    </div>
    <div class="next-5-days__wind">
      ${data.forecast.forecastday[i].day.maxwind_kph}mph
      <div class="next-5-days__label">Wind</div>
    </div>`;
      nextFiveDaysContainer.appendChild(e);
    }
  });
}

//FUNCTION CALLS
setCurrentWeatherData();
setDailyWeatherStats();
setHourlyWeatherData();
setNextFiveDaysData();
