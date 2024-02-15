const img = document.getElementById("test");
const toggle = document.getElementById("toggle");
const searchBar = document.getElementById("searchBar");
const errorText = document.getElementById("error");
const all = {};
// async function currentWeather() {
//   try {
//     let respont = await fetch(
//       "http://api.weatherapi.com/v1/current.json?key=c9e30f3fc921477da02155056241302&q=Bogota",
//       {
//         mode: "cors",
//       }
//     );
//     let result = await respont.json();
//     console.log(result);
//     console.log(result.current.feelslike_c);
//     img.src = result.current.condition.icon;
//   } catch (error) {
//     console.log(error);
//   }
// }
// currentWeather();
let validate = true;
async function currentDayWeather(city) {
  try {
    let respont = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=c9e30f3fc921477da02155056241302&q=${city}&days=3`,
      {
        mode: "cors",
      }
    );
    let result = await respont.json();
    errorText.innerHTML = "";
    all.ubication = result.location.name;
    all.day = result.location.localtime;
    all.currentLogo = result.current.condition.icon;
    all.temperatureC = result.current.temp_c;
    all.temperatureF = result.current.temp_f;
    all.days = [];
    all.hours = [];
    result.forecast.forecastday.map((e) => {
      all.days.push(e.day);
      all.hours.push(e.hour);
    });
    createDay(validate);
    createMoreDays(validate);
  } catch (error) {
    console.log(error);
    errorText.textContent = "Location no found, search must be a 'City'";
  }
}
currentDayWeather("bogota");

let createDay = (tem) => {
  let mainBox = document.getElementById("mainBox");
  mainBox.innerHTML = "";
  let ubication = document.createElement("h3");
  let day = document.createElement("p");
  let img = document.createElement("img");
  let temperature = document.createElement("p");

  //add elementes from api
  let dateNow = Date().split(" ");
  ubication.textContent = all.ubication;
  let time = all.day.split(" ");
  day.textContent = `${dateNow[0]}, ${time}`;
  img.src = all.currentLogo;
  temperature.textContent = tem
    ? `${all.temperatureC}°C`
    : `${all.temperatureF}°F`;
  console.log(all.day);
  mainBox.append(ubication, day, img, temperature);
};

let createMoreDays = (tem) => {
  let carrusel = document.getElementById("carrusel");
  carrusel.innerHTML = "";

  //add elementes from api
  all.hours[0].map((e, i) => {
    let div = document.createElement("div");
    div.setAttribute("class", "box");
    let hour = document.createElement("h4");
    let img = document.createElement("img");
    let temperature = document.createElement("p");
    let time = e.time.split(" ");
    console.log(time[1]);
    hour.textContent = time[1];
    img.src = e.condition.icon;
    temperature.textContent = tem ? `${e.temp_c} °C` : `${e.temp_f} °F`;
    div.append(hour, img, temperature);
    carrusel.appendChild(div);
  });
};

let changeTypeTemp = (e) => {
  e.preventDefault();
  if (validate) {
    createDay(false);
    createMoreDays(false);
    validate = false;
    toggle.textContent = "Display °C";
  } else if (validate === false) {
    createDay(true);
    createMoreDays(true);
    validate = true;
    toggle.textContent = "Display °F";
  }
};

let searchCity = (e) => {
  let search = document.getElementById("searchCity");
  e.preventDefault();
  currentDayWeather(search.value);
};

toggle.addEventListener("click", changeTypeTemp);
searchBar.addEventListener("submit", searchCity);
