// Variables
const o3 = document.querySelector("#o3");
const so2 = document.querySelector("#so2");
const no2 = document.querySelector("#no2");
const day = document.querySelector("#day");
const body = document.querySelector("body");
const date = document.querySelector("#date");
const list = document.querySelector("#list");
const time = document.querySelector("#time");
const input = document.querySelector("#input");
const pm2_5 = document.querySelector("#pm2_5");
const search = document.querySelector("#search");
const sunset = document.querySelector("#sunset");
const sunrise = document.querySelector("#sunrise");
const loading = document.querySelector("#loading");
const celsius = document.querySelector("#celsius");
const not = document.querySelector("#notification");
const pressure = document.querySelector("#pressure");
const humidity = document.querySelector("#humidity");
const localName = document.querySelector("#localName");
const otherDay = document.querySelectorAll(".otherDay");
const fahrenheit = document.querySelector("#fahrenheit");
const visibility = document.querySelector("#visibility");
const feels_like = document.querySelector("#feels_like");
const typeWeather = document.querySelector("#typeWeather");
const temperature = document.querySelector("#temperature");
const iconWeather = document.querySelector("#iconWeather");
const introduction = document.querySelector("#introduction");
const directionAir = document.querySelectorAll(".directionAir");
const itemsForecast = document.querySelectorAll(".itemsForecast");
const btnIntroduction = document.querySelector("#btnIntroduction");
const currentLocation = document.querySelector("#currentLocation");
const locationAndCountry = document.querySelector("#locationAndCountry");
let isCelsius = true;
const types = {
  bad: Symbol.for("bad"),
  good: Symbol.for("good"),
};

// Events
// Keypress
celsius.addEventListener("keypress", function (e) {
  e.key === "Enter" ? changeType(e) : null;
});
fahrenheit.addEventListener("keypress", function (e) {
  e.key === "Enter" ? changeType(e) : null;
});
currentLocation.addEventListener("keypress", (e) => {
  e.key === "Enter" ? getPermissionGeolocation : null;
});
input.addEventListener("keypress", (e) =>
  e.key === "Enter" ? getPossiblesLocations() : null
);
search.addEventListener("keypress", (e) =>
  e.key === "Enter" ? getPossiblesLocations() : null
);
btnIntroduction.addEventListener("keypress", (e) => {
  e.key === "Enter" ? hiddenIntroduction : null;
});
// Click
celsius.addEventListener("click", function (e) {
  changeType(e);
});
fahrenheit.addEventListener("click", function (e) {
  changeType(e);
});
currentLocation.addEventListener("click", getPermissionGeolocation);
search.addEventListener("click", getPossiblesLocations);
btnIntroduction.addEventListener("click", hiddenIntroduction);

// Functions
/**
 * Notificate about some thing
 * @param {string} content
 * @param {string} type
 */
function notificate(content, type) {
  if (types[type]) {
    not.classList = "";
    not.classList.add(type);

    not.textContent = content;
    not.style.display = "block";

    setTimeout(() => {
      not.style.display = "none";
    }, 3000);
  } else {
    alert("Use wrong of notificate");
  }
}

/**
 * Get permission to access the geolocation
 */
function getPermissionGeolocation() {
  if ("geolocation" in navigator) {
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state === "granted") {
        navigator.geolocation.getCurrentPosition(getGeolocation);
      } else if (result.state === "prompt") {
        navigator.geolocation.getCurrentPosition(getGeolocation, handleError);
      } else if (result.state === "denied") {
        notificate(
          "Geolocation permission was denied. Please enable it in your browser settings.",
          "bad"
        );
      }
    });
  } else {
    notificate("Your browser doesn't support geolocation.", "bad");
  }
}

/**
 * Get the geolocation
 * @param {*} position
 */
async function getGeolocation(position) {
  let lat = await position.coords.latitude;
  let lon = await position.coords.longitude;

  requestWeatherAPI(lat, lon);
}

/**
 * Show error in Geolocation
 * @param {*} error
 */
function handleError(error) {
  console.error("Error getting geolocation:", error);
}

/**
 * hidden introduction
 * @param {*} error
 */
function hiddenIntroduction() {
  introduction.style.display = "none";
}

/**
 * Get data in server
 * @param {Double} lat
 * @param {Double} lon
 */
async function requestWeatherAPI(lat, lon) {
  try {
    list.style.display = "none";
    showLoading();
    const data = await fetch(
      "https://render-express-deployment-app-weather.onrender.com/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lat: lat, // Latitude
          lon: lon, // Longitude
          unit: isCelsius ? "metric" : "imperial", // Celsius or Fahrenheit
        }),
      }
    )
      .then((r) => r.json())
      .then((d) => d)
      .catch((e) => {
        console.error("Error in request with an API", e);
        hiddenLoading();
      });

    if (data) {
      const skills = {
        day: data.weather.date,
        time: data.weather.date,
        date: data.weather.date,
        o3: data.airPollution.o3,
        so2: data.airPollution.so2,
        no2: data.airPollution.no2,
        pm2_5: data.airPollution.pm2_5,
        humidity: data.weather.humidity,
        pressure: data.weather.pressure,
        localName: data.weather.localName,
        iconWeather: data.weather.codeIcon,
        otherDay: data.forecast.listWeather,
        visibility: data.weather.visibility,
        feels_like: data.weather.feels_like,
        directionAir: data.forecast.listWind,
        temperature: data.weather.temperature,
        typeWeather: data.weather.typeWeather,
        itemsForecast: data.forecast.listWeather,
        locationAndCountry: [data.weather.localName, data.weather.countryName],
      };

      setSuns(sunrise, data.weather.sunrise);
      setSuns(sunset, data.weather.sunset);
      setSomeData("o3", skills["o3"]);
      setSomeData("so2", skills["so2"]);
      setSomeData("no2", skills["no2"]);
      setSomeData("day", skills["day"]);
      setSomeData("time", skills["time"]);
      setSomeData("date", skills["date"]);
      setSomeData("pm2_5", skills["pm2_5"]);
      setSomeData("humidity", skills["humidity"]);
      setSomeData("pressure", skills["pressure"]);
      setSomeData("otherDay", skills["otherDay"]);
      setSomeData("localName", skills["localName"]);
      setSomeData("visibility", skills["visibility"]);
      setSomeData("feels_like", skills["feels_like"]);
      setSomeData("typeWeather", skills["typeWeather"]);
      setSomeData("iconWeather", skills["iconWeather"]);
      setSomeData("temperature", skills["temperature"]);
      setSomeData("directionAir", skills["directionAir"]);
      setSomeData("itemsForecast", skills["itemsForecast"]);
      setSomeData("locationAndCountry", skills["locationAndCountry"]);
    }

    hiddenLoading();
    input.value = "";
  } catch (err) {
    console.error("Error in request", err);
    notificate("Error in request to API", "bad");
    hiddenLoading();
  }
}

/**
 * Hidden loading
 */
function hiddenLoading() {
  loading.style.display = "none";
  body.style.overflow = "visible";
}

/**
 * Show loading
 */
function showLoading() {
  loading.style.display = "block";
  body.style.overflow = "hidden";
}

/**
 * Get the possibles locations to according the search
 * @returns {Promise}
 */
async function getPossiblesLocations() {
  try {
    showLoading();

    let local = input.value.trim();
    if (!local) {
      notificate("Insert something in input", "bad");
      hiddenLoading();
      return;
    }

    let data = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${local}&format=json&addressdetails=1&accept-language=en`
    )
      .then((r) => r.json())
      .then((d) => d)
      .catch((e) => {
        console.error(`Error in get locations in API request: ${e}`);
        notificate("Failed to fetch locations in API", "bad");
        hiddenLoading();
      });

    if (!data[0]) {
      notificate("No results for this location", "bad");
    }

    hiddenLoading();
    showPossibleLocations(data);
  } catch (e) {
    console.error(`Error fetching locations: ${e}`);
    notificate("Failed to fetch locations", "bad");
    hiddenLoading();
  }
}

/**
 * Get the weather icon
 * @param {string} code
 * @returns {string}
 */
function getIconWeather(code) {
  const linkIcon = {
    DynamicLinkToIcon(code) {
      return `https://openweathermap.org/img/wn/${code}@2x.png`;
    },
  };

  return linkIcon.DynamicLinkToIcon(code);
}

/**
 * Show the possibles locations to search
 * @param {Element} arr
 */
function showPossibleLocations(arr) {
  list.style.display = "block";
  list.replaceChildren();

  for (const elem of arr) {
    let option = document.createElement("div");
    let moreData =
      elem.address.state || elem.address.region || elem.address.region;
    moreData
      ? (option.textContent = `${elem.name}, ${moreData}, ${elem.address.country}`)
      : (option.textContent = `${elem.name}, ${elem.address.country}`);

    option.tabIndex = "0";

    option.addEventListener("click", () => {
      let lat = elem.lat,
        lon = elem.lon;

      requestWeatherAPI(lat, lon);
    });

    option.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        let lat = elem.lat,
          lon = elem.lon;

        requestWeatherAPI(lat, lon);
      }
    });

    list.appendChild(option);
  }
}

/**
 * Change between celsius e fahrenheit (variable)
 * @param {Element} e
 */
function changeType(e) {
  const buttons = { celsius, fahrenheit };

  isCelsius = e.target.id === "celsius"; // Verify if the Celsius or fahrenheit

  Object.values(buttons).forEach((btn) =>
    btn.classList.toggle("actived", btn === e.target)
  );
}

/**
 * Set sunrise and sunset
 * @param {Element} e
 * @param {Date} date
 */
function setSuns(e, date) {
  let isSunrise = e.id === sunrise.id;
  let d = new Date(date);

  const hours = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours(),
    minutes = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();

  isSunrise
    ? (sunrise.textContent = `${hours}:${minutes}`)
    : (sunset.textContent = `${hours}:${minutes}`);
}

/**
 * Get the unique days of a array
 * @param {Object} array
 * @returns
 */
function getUniqueDates(array) {
  return array.filter(
    (item, index, arr) => index === 0 || item.date !== arr[index - 1].date
  );
}

/**
 * Set the content of some element
 * @param {string} type
 * @param {string} content
 */
function setSomeData(type, content) {
  let types = {
    o3,
    no2,
    so2,
    day,
    time,
    date,
    pm2_5,
    humidity,
    otherDay,
    pressure,
    localName,
    visibility,
    feels_like,
    temperature,
    typeWeather,
    iconWeather,
    directionAir,
    itemsForecast,
    locationAndCountry,
  };
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (types[type]) {
    switch (type) {
      case "humidity":
        types[type].textContent = `${content}%`;
        break;

      case "pressure":
        types[type].textContent = `${content}hPa`;
        break;

      case "visibility":
        content = content >= 1000 ? `${content / 1000}km` : `${content}m`;
        types[type].textContent = content;
        break;

      case "feels_like":
      case "temperature":
        content = parseInt(content);
        types[type].textContent = isCelsius ? `${content}°C` : `${content}°F`;
        break;

      case "time":
        let dateTime = new Date(content);
        let hours =
          dateTime.getHours() < 10
            ? `0${dateTime.getHours()}`
            : dateTime.getHours();
        let min =
          dateTime.getMinutes() < 10
            ? `0${dateTime.getMinutes()}`
            : dateTime.getMinutes();
        types[type].textContent = `${hours}:${min}`;
        break;

      case "day":
        let day = new Date(content).getDay();
        types[type].textContent = `${days[day]}`;
        break;

      case "date":
        let date = new Date(content);
        types[type].textContent = `${days[date.getDay()]} ${date.getDate()}, ${
          month[date.getMonth()]
        }`;
        break;

      case "otherDay":
        for (let i = 0; i < otherDay.length; i++) {
          let date = otherDay[i].children[0],
            time = otherDay[i].children[1],
            icon = otherDay[i].children[2],
            temp = otherDay[i].children[3];

          date.textContent = content[i].date;
          time.textContent = content[i].time;
          icon.src = getIconWeather(content[i].icon) || icon.src;
          temp.textContent = isCelsius
            ? `${content[i].temp}°C`
            : `${content[i].temp}°F`;
        }
        break;

      case "directionAir":
        for (let i = 0; i < directionAir.length; i++) {
          let date = directionAir[i].children[0],
            time = directionAir[i].children[1],
            icon = directionAir[i].children[2],
            speed = directionAir[i].children[3];

          date.textContent = content[i].date;
          time.textContent = content[i].time;
          icon.style.transform = `rotate(${content[i].degWind}deg)`;
          speed.textContent = isCelsius
            ? `${content[i].speedWind.toFixed(1)}km/h`
            : `${content[i].speedWind.toFixed(1)}mph`;
        }
        break;

      case "itemsForecast":
        let itemsForecastArrayUniqueDays = getUniqueDates(content);

        for (let i = 0; i < itemsForecast.length; i++) {
          let temp = itemsForecast[i].children[0],
            time = itemsForecast[i].children[2],
            dayWeek = itemsForecast[i].children[4],
            date = new Date(itemsForecastArrayUniqueDays[i].dt),
            day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();

          temp.textContent = isCelsius
            ? `${content[i].temp}°C`
            : `${content[i].temp}°F`;
          time.textContent = `${day} ${month[date.getMonth()]}`;
          dayWeek.textContent = days[date.getDay()];
        }
        break;

      case "iconWeather":
        iconWeather.src = getIconWeather(content) || iconWeather.src;
        break;

      case "locationAndCountry":
        let local = content[0],
          country = content[1];
        locationAndCountry.textContent = `${local}, ${country}`;
        break;

      default:
        types[type].textContent = content;
        break;
    }
  }
}
