import clock from "clock";
import document from "document";
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { me } from "appbit";
import * as messaging from "messaging";
import * as simpleSettings from "./device-settings";
import Clock from "./clock";
import Battery from "./battery";
import Weather from "./weather";
import Face from "./face";
import Goals from "./goals";

// ***** Settings *****
console.log("set up settings");

var settings;

function settingsCallback(data) {
  settings = data;
}

simpleSettings.initialize(settingsCallback);

messaging.peerSocket.addEventListener("message", (evt) => {
  if (evt && evt.data && evt.data.key) {
    settings[evt.data.key] = evt.data.value;
    //console.log(`${evt.data.key} : ${evt.data.value}`); // Good for debugging
    if (evt.data.key === "tempUnit") {
      weather.tempUnit = evt.data.value.selected;
      clockController.weather.updateWeather();
    }
  }
});

// ***** Clock *****
console.log("set up clock");

const dateBox = document.getElementById("trip")
const hourHand = document.getElementById("hourHand");
const minuteHand = document.getElementById("minuteHand");
const secondHand = document.getElementById("secondHand");

var clockController = new Clock(
  dateBox,
  hourHand,
  minuteHand,
  secondHand
);

// ***** Initialize Body & Heart Rate *****
console.log("initialize body and heart rate");

const heartRateLight = document.getElementById("heartRateLight") as ImageElement;
const heartRateText = document.getElementById("heartRateText") as TextElement;
const heartRateImage = document.getElementById("heartRateImage") as ImageElement;
var body = null;
var hrm = null;

function processHeartRate() {
  if (!settings.hideHeartRate && display.on) {
    heartRateLight.animate("enable");
    heartRateText.text = hrm.heartRate ?? "--";
  }
}

function processBodyPresence() {
  if (!settings.hideHeartRate && display.on && body.present) {
    hrm.start();
    heartRateText.style.visibility = "visible";
    heartRateImage.style.visibility = "hidden";
  } else {
    hrm.stop();
    heartRateText.style.visibility = "hidden";
    heartRateImage.style.visibility = "visible";
  }
}

if (HeartRateSensor) {
  hrm = new HeartRateSensor({ frequency: 1 });
  hrm.addEventListener("reading", () => {
    processHeartRate();
  });
}

if (BodyPresenceSensor) {
  body = new BodyPresenceSensor();
  body.start();
  body.addEventListener("reading", () => {
    processBodyPresence();
  });
}

// ***** Display *****
console.log("set up display");

var face = new Face(settings, body, hrm, dateBox);

if (display.aodAvailable && me.permissions.granted("access_aod")) {
  // tell the system we support AOD
  display.aodAllowed = true;

  // respond to display change events
  display.addEventListener("change", () => {
    // Is the display on?
    if (!display.aodActive && display.on) {
      hrm.start();
      body.start();
      clock.granularity = "seconds";
      clockController.weather.weatherRunning = true;
      clockController.weather.updateWeather();
      clockController.updateGoals();
      clockController.updateBattery();
    }
    else {
      hrm.stop();
      body.stop();
      clock.granularity = "minutes";
    }
    processHeartRate();
    face.updateStats();
  });
}
else {
  // respond to display change events
  display.addEventListener("change", () => {
    // Is the display on?
    if (display.on) {
      hrm.start();
      body.start();
      clock.granularity = "seconds";
      clockController.weather.weatherRunning = true;
      clockController.weather.updateWeather();
      clockController.updateGoals();
      clockController.updateBattery();
    }
    else {
      hrm.stop();
      body.stop();
      clock.granularity = "minutes";
    }
    processHeartRate();
    face.updateStats();
  });
}

clockController.updateDisplay = () => { face.updateStats() };

// ***** Weather *****
console.log("set up weather");

var weather = new Weather(document.getElementById("tempText"), document.getElementById("weatherIcon"));
try {
  weather.tempUnit = settings.tempUnit.selected || "Celsius";
}
catch (ex) {
  console.log(ex.message);
  weather.tempUnit = "Celsius";
}
clockController.weather = weather;

// ***** Goals *****
console.log("set up goals");

var goals = new Goals(settings);

clockController.updateGoals = () => { goals.updateGoals() };

// ***** Battery *****
console.log("set up battery");

var battery = new Battery();

clockController.updateBattery = () => { battery.updateBattery() };

// ***** Trigger Updates *****
console.log("start updates");

clockController.updateGoals();
clockController.updateBattery();
clockController.startClock();
