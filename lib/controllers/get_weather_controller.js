import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["input", "city", "date", "description", "icon", "temperature"]

  connect() {
    const baseUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";
    const token = config.apiKey;
    navigator.geolocation.getCurrentPosition((currentPosition) => {
      const lat = currentPosition.coords.latitude;
      const long = currentPosition.coords.longitude;
      fetch(`${baseUrl}&lat=${lat}&lon=${long}&appid=${token}`)
        .then(res => res.json())
        .then((data) => {
          this.addData(data);
        });
    });
  }

  getWeather(event) {
    event.preventDefault();
    const location = this.inputTarget.value;
    console.log(location);
    this.cityWeather(location);
  }

  cityWeather = (location) => {
    const baseUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric";
    const token = config.apiKey;

    fetch(`${baseUrl}&q=${location}&appid=${token}`)
      .then(res => res.json())
      .then((data) => {
        this.addData(data);
      });
  }

  addData(data) {
    const weekday = new Date().toLocaleString('default', { weekday: 'long' });
    const date = new Date().toUTCString().slice(5, 16);

    this.cityTarget.innerText = data.name;
    this.dateTarget.innerText = `${weekday}, ${date}`;
    this.descriptionTarget.innerText = data.weather[0].description;
    this.temperatureTarget.innerText = `${Math.round(Number(data.main.temp))}°C`;
    this.iconTarget.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  }
}
