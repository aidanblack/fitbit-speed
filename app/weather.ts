import * as weather from 'fitbit-weather/app';
import document from "document";

class Weather {
    temp;
    icon;
    firstRun;
    tempUnit = "0";
    timestamp = 0;
    weatherRunning = false;
    weatherColor = document.getElementById("weatherColor") as ImageElement;

    constructor(temp, icon) {
        this.temp = temp;
        this.icon = icon;
        this.firstRun = 1;
    }

    processWeather(weather) {
        if (this.tempUnit == "1")
            this.temp.text = `${Math.round(weather.temperatureF)}°`;
        else
            this.temp.text = `${Math.round(weather.temperatureC)}°`;
        var weatherIcon = this.icon;
        var weatherCode = weather.conditionCode;
        var dayNight;
        if (weather.timestamp > weather.sunrise && weather.timestamp < weather.sunset) {
            dayNight = "d";
            this.weatherColor.style.fill = "#0066CC";
            this.weatherColor.style.opacity = 0.6;
        }
        else {
            dayNight = "n";
            this.weatherColor.style.fill = "#000022";
            this.weatherColor.style.opacity = 0.8;
        }
        weatherIcon.href = `weather/${weatherCode}${dayNight}.png`;
        this.timestamp = weather.timestamp;

        this.firstRun = 30;
        this.weatherRunning = false;
        console.log("Weather Updated");
    }

    updateWeather() {
        weather.fetch(this.firstRun * 60 * 1000) // return the cached value if it is less than 30 minutes old 
        .then(weather => this.processWeather(weather))
        .catch(error => console.log(error.message));
    }
}
  
export default Weather;
