const button = document.getElementById("search-btn");
const locationName = document.getElementById("location");
const weatherInfo = document.getElementById("weather-info");

// Weather details elements
const weatherIcon = document.getElementById("weather-img");
const temperatureDiv = document.querySelector(".temp");
const cityDiv = document.querySelector(".city");
const locationTime = document.querySelector(".localtime");
const stateDiv = document.querySelector(".state");
const countryDiv = document.querySelector(".country");

// Weather parameters
const humidityElement = document.getElementById("humidity");
const windSpeedElement = document.getElementById("wind-speed");
const conditionElement = document.getElementById("condition");
const feelsLikeElement = document.getElementById("feels-like");

async function getData(cityName) {
    const promise = await fetch(`http://api.weatherapi.com/v1/current.json?key=9ea4c0c509124ba79d0123251251006&q=${cityName}&aqi=yes`);
    return await promise.json();
}

button.addEventListener("click", async () => {
    const value = locationName.value;
    const result = await getData(value);
        // Show weather info container
    weatherInfo.style.display = "block";
    
    // Update weather icon
    weatherIcon.src = `https:${result.current.condition.icon}`;
    
    // Update main weather info
    temperatureDiv.innerText = `${result.current.temp_c}°C`;
    cityDiv.innerText = result.location.name;
    locationTime.innerText = result.location.localtime;
    
    // Update location details
    stateDiv.innerText = result.location.region || result.location.name;
    countryDiv.innerText = result.location.country;
    
    // Update weather parameters
    humidityElement.innerText = `${result.current.humidity}%`;
    windSpeedElement.innerText = `${result.current.wind_kph} km/h`;
    conditionElement.innerText = result.current.condition.text;
    feelsLikeElement.innerText = `${result.current.feelslike_c}°C`;
});

const favplace = document.getElementsByClassName("favplace");
const addButtonFav = document.getElementById("add-fav-btn");
const childIcon = document.getElementById("weather-img-child");
const childTemp = document.getElementById("temp-child");
const childCity = document.getElementById("city-child");
const childTime = document.getElementById("localtime-child")
const locationArr = [];

addButtonFav.addEventListener("click", async () => {
    const value = locationName.value;
    const result = await getData(value);
    let icon = `https:${result.current.condition.icon}`;
    let temp = result.current.temp_c;
    let city = result.location.name;
    let time = result.location.localtime;
    if(locationArr.length < 4){
        updateArray(icon, temp, city, time);
    }else{
        alert("You can add only 4 favourite places !!!")
    } 
});

function updateArray(icon, temp, city, time){
    locationArr.push({ icon, temp, city, time });
    console.log(locationArr);
    updateChild(icon, temp, city, time);
}
function updateChild(icon, temp, city, time) {
    childIcon.src = icon;
    childTemp.innerText = `${temp}°C`;
    childCity.innerText = city;
    childTime.innerText = time;
}

function removefav() {

}