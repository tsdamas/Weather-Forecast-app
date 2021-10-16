function hourNow(response) {
  let now = new Date();
  let h2 = document.querySelector("h2.hour");
  let h3 = document.querySelector("h3.date");
  let hours = now.getHours();
  let minutes = (now.getMinutes() < 10 ? "0" : "") + now.getMinutes();

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[now.getDay()];
  h2.innerHTML = `${hours}:${minutes}`;
  h3.innerHTML = `${day}`;
}
hourNow();

function formatDay(timestamp){
  let date = new Date (timestamp * 1000);
  let day = date.getDay();
  let days = ["S", "M", "T", "W", "T", "F", "S"];

  return days[day];
}

function displayForecast (response){
    console.log(response.data);
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

let forecastHTML = `<div class="col-sm-9">`;
forecast.forEach(function (forecastDay, index){
  if(index < 6) {
  forecastHTML = forecastHTML +
`<div class="row row-8">
  <div class="col-3 col-sm-2">
    <p class="date1">
      ${formatDay(forecastDay.dt)}
    </p>
  </div>
  <div class="col-4 col-sm-2">
    <img 
      src ="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
      alt=""
      width="45" 
      />
  </div>
  <div class="col-5 col-sm-2">
    <p id="first-max-temp">
      ${Math.round(forecastDay.temp.max)}º
    </p>
  </div>
  <div class="col-6 col-sm-2">
    <p class="scale1">
      scale
    </p>
  </div>
  <div class="col-7 col-sm-2">
    <p id="first-min-temp">
     ${Math.round(forecastDay.temp.min)}º
    </p>
  </div>`;}

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML
}
);


}

function getForecast(coordinates){
let apiKey ="0581a5c52e36d81c89d13f976ae61d0c"
let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`
axios.get(apiUrl).then(displayForecast); 
}

function displayWeatherCondition(response) {
  document.querySelector("#search-engine").innerHTML = response.data.name;
  document.querySelector(".now-temperature").innerHTML =
    Math.round(celsiusTemperature);
  document.querySelector(".feels").innerHTML =
    Math.round(response.data.main.feels_like) + "º";
  document.querySelector("#humidity").innerHTML =
    response.data.main.humidity + "%";
  document.querySelector("#wind").innerHTML =
    Math.round(response.data.wind.speed) + "m/s";
  document.querySelector(".visibility").innerHTML = response.data.visibility;
  document.querySelector(".description").innerHTML =
    response.data.weather[0].main;
  document.querySelector("#search-engine").value = response.data.name;
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  iconElement.setAttribute("alt", response.data.weather[0].description)
  
  celsiusTemperature = response.data.main.temp;

  getForecast(response.data.coord);

}

function searchCity(city) {
  let apiKey = "0581a5c52e36d81c89d13f976ae61d0c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-engine").value;
  searchCity(city);
}

function searchLocation(position) {
  let apiKey = "0581a5c52e36d81c89d13f976ae61d0c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCondition);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(
    searchLocation);
}

function displayFahrenheitTemperature (event) {
event.preventDefault();
let temperatureElement = document.querySelector(".now-temperature");
celsiusLink.classList.remove("active");
fahrenheitLink.classList.add("active");
let fahrenheitTemperature = (celsiusTemperature * 9)/ 5 + 32;
temperatureElement.innerHTML = Math.round(fahrenheitTemperature); 
}

function displayCelsiusTemperature(event){
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active"); 
  let temperatureElement = document.querySelector(".now-temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link"); 
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.querySelector("click", displayCelsiusTemperature); 

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

searchCity("Vancouver");