const API_KEY = "dc75819e59914b85b88145527232804";
const place = document.querySelector("#place");
const date = document.querySelector("#date");
const weatherIcon = document.querySelector(".weather-icon");
const degree = document.querySelector("#degree");
const degreeInfo = document.querySelector("#degree-info");
const high = document.querySelector("#highest-temp");
const low = document.querySelector("#lowest-temp");
const wind = document.querySelector("#wind");
const sunrise = document.querySelector("#sunrise");
const sunset = document.querySelector("#sunset");
const rain = document.querySelector("#rain");

function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          resolve({ lat, lon });
        },
        (error) => {
          reject(`Geolocation error: ${error.message}`);
        }
      );
    } else {
      reject("Geolocation is not supported by this browser");
    }
  });
}

function getWeatherDataCurrent(lat, lon) {
  const url = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=no`;
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

getUserLocation()
  .then((location) => {
    return getWeatherDataCurrent(location.lat, location.lon);
  })
  .then((data) => {
    place.innerHTML = data.location.name + ", " + data.location.country;
    date.innerHTML = dayjs().locale("en").format("dddd, DD MMMM");
    weatherIcon.src = data.current.condition.icon;
    degree.innerHTML = data.current.temp_c + `&deg;`;
    degreeInfo.innerHTML = data.current.condition.text;
    high.innerHTML = data.current.condition.text;
  })
  .catch((error) => console.error(error));

function getWeatherDataAdditionalInfo(lat, lon) {
  const url = `http://api.weatherapi.com/v1/history.json?key=${API_KEY}&q=${lat},${lon}&dt=${dayjs().format("YYYY-MM-DD")}`;
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error));
}

getUserLocation()
  .then((location) => {
    return getWeatherDataAdditionalInfo(location.lat, location.lon);
  })
  .then((data) => {
    high.innerHTML = data.forecast.forecastday[0].day.maxtemp_c + `&deg;`;
    low.innerHTML = data.forecast.forecastday[0].day.mintemp_c + `&deg;`;
    wind.innerHTML = data.forecast.forecastday[0].day.maxwind_mph + ` kmh`;
    sunrise.innerHTML = data.forecast.forecastday[0].astro.sunrise;
    sunset.innerHTML = data.forecast.forecastday[0].astro.sunset;
    rain.innerHTML = data.forecast.forecastday[0].day.totalprecip_mm + ` mm`;
  })
  .catch((error) => console.error(error));
