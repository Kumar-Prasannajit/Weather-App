const main = document.getElementById("main");
const button = document.getElementById("search-btn");
const favContainer = document.getElementById("child");
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

const addButtonFav = document.getElementById("add-fav-btn");

let locationArr = [];

// Fetch data
async function getData(cityName) {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=9ea4c0c509124ba79d0123251251006&q=${cityName}&aqi=yes`);
    const data = await response.json();
    return data;
}

// Update main weather panel
button.addEventListener("click", async () => {
    const value = locationName.value.trim();
    if (!value) return;

    try {
        const result = await getData(value);
        weatherInfo.style.display = "block";
        weatherIcon.src = `https:${result.current.condition.icon}`;
        temperatureDiv.innerText = `${result.current.temp_c}°C`;
        cityDiv.innerText = result.location.name;
        locationTime.innerText = result.location.localtime;
        stateDiv.innerText = result.location.region || result.location.name;
        countryDiv.innerText = result.location.country;
        humidityElement.innerText = `${result.current.humidity}%`;
        windSpeedElement.innerText = `${result.current.wind_kph} km/h`;
        conditionElement.innerText = result.current.condition.text;
        feelsLikeElement.innerText = `${result.current.feelslike_c}°C`;
    } catch (error) {
        alert("Failed to fetch weather data.");
        console.error(error);
    }
});

// Add to favorites
addButtonFav.addEventListener("click", async () => {
    const value = locationName.value.trim();
    if (!value) return;

    if (locationArr.length >= 4) {
        alert("You can add only 4 favourite places!");
        return;
    }

    try {
        const result = await getData(value);
        const city = result.location.name;

        // Avoid duplicate city entries
        if (locationArr.some(loc => loc.city === city)) {
            alert("City already added to favorites!");
            return;
        }

        locationArr.push({
            icon: `https:${result.current.condition.icon}`,
            temp: result.current.temp_c,
            city: city,
            time: result.location.localtime
        });

        storeFav();
        updateChild();
        main.style.justifyContent = "space-evenly";
    } catch (error) {
        alert("Could not add to favorites.");
        console.error(error);
    }
});

//  Render favorite cards
function updateChild() {
    favContainer.innerHTML = "";
    locationArr.forEach((location, index) => {
        const favDiv = document.createElement("div");
        favDiv.classList.add("favPlace");
        favDiv.innerHTML = `
            <div id="weather-icon-child">
                <img src="${location.icon}" alt="weather icon">
            </div>
            <div id="temp-child">${location.temp}°C</div>
            <div id="city-child">${location.city}</div>
            <div id="localtime-child">${location.time}</div>
            <i class="fas fa-times close-btn" onclick="removeFav(${index})"></i>
        `;
        favContainer.appendChild(favDiv);
    });
}

//  Remove favorite
function removeFav(index) {
    locationArr.splice(index, 1);
    storeFav();
    updateChild();
}

// Store entire object
function storeFav() {
    localStorage.setItem("favLocations", JSON.stringify(locationArr));
}

async function updateFavoritePlaces() {
    const updatedLocations = [];
    
    for (const location of locationArr) {
        try {
            const result = await getData(location.city);
            updatedLocations.push({
                icon: `https:${result.current.condition.icon}`,
                temp: result.current.temp_c,
                city: result.location.name,
                time: result.location.localtime
            });
        } catch (error) {
            console.error(`Failed to update ${location.city}:`, error);
            updatedLocations.push(location);
        }
    }
    
    locationArr = updatedLocations;
    storeFav();
    updateChild();
}

// Load on page refresh
window.addEventListener("load", async () => {
    const stored = JSON.parse(localStorage.getItem("favLocations"));
    if (stored && Array.isArray(stored)) {
        locationArr = stored;
        await updateFavoritePlaces(); // Initial update
        if (locationArr.length > 0) {
            main.style.justifyContent = "space-evenly";
        }
        
        // Update every minute (60 seconds * 1000 milliseconds)
        setInterval(updateFavoritePlaces, 60 * 1000);
    }
});
