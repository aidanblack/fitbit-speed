import { display } from "display";
import document from "document";
import { me } from "appbit";
import { battery } from "power";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { today } from "user-activity";
import { goals } from "user-activity";

class Face {
    settings;
    body;
    hrm;
    dateBox;
    currentCount;
    currentGoal;
    mode = Face.modes.Steps;

    static modes = {
        Zone: "Zone",
        Steps: "Steps",
        Distance: "Distance",
        Floors: "Floors",
        Calories: "Calories"
    };

    zoneColor = document.getElementById("zoneColor") as ImageElement;
    stepsColor = document.getElementById("stepsColor") as ImageElement;
    distanceColor = document.getElementById("distanceColor") as ImageElement;
    floorsColor = document.getElementById("floorsColor") as ImageElement;
    caloriesColor = document.getElementById("caloriesColor") as ImageElement;
    odometer = document.getElementById("odometer") as TextElement;
    decimal = document.getElementById("decimal") as TextElement;
    dial = document.getElementById("goals") as Element;
    
    constructor(settings, body, hrm, dateBox) {
        this.settings = settings;
        this.body = body;
        this.hrm = hrm;
        this.dateBox = dateBox;

        this.dial.addEventListener("click", (evt) => {
            switch(this.mode) {
                case  Face.modes.Zone:
                    this.mode = Face.modes.Steps;
                    break;
                case  Face.modes.Steps:
                    this.mode = Face.modes.Distance;
                    break;
                case  Face.modes.Distance:
                    this.mode = Face.modes.Floors;
                    break;
                case  Face.modes.Floors:
                    this.mode = Face.modes.Calories;
                    break;
                case  Face.modes.Calories:
                    this.mode = Face.modes.Zone;
                    break;
            }
            this.updateStats();
        });
    }

    updateDisplay() {
        // Is AOD inactive and the display is on?
        if (!display.aodActive && display.on) {}
        else {}
      
        // Date
        if (!this.settings.hideDate) {}
        else if (this.settings.hideDate && !display.aodActive && display.on) {}
        else {}
      
        // Weather
        if (!this.settings.hideWeather && !display.aodActive && display.on) {}
        else if (this.settings.hideWeather && !display.aodActive && display.on) {}
        else {}
      
        // Heart Rate
        if (!this.settings.hideHeartRate && !display.aodActive && display.on) {}
        else if (this.settings.hideHeartRate && !display.aodActive && display.on) {}
        else {}

        if (!this.settings.hideHeartRate && !display.aodActive && display.on && this.body.present) {}
        else {}
      
        // Goals
        if (!this.settings.hideGoals && !display.aodActive && display.on) {}
        else {}
      
        if (this.settings.hideGoals) {}
        else {}
    }      

    updateStats () {
        if (this.mode == Face.modes.Zone) {
            this.zoneColor.style.fill = "#f7b62b";
            this.caloriesColor.style.fill = "#201911";
            this.currentCount = today.adjusted.activeZoneMinutes.total;
            this.currentGoal = goals.activeZoneMinutes.total;
        }
        if (this.mode == Face.modes.Steps) {
            this.stepsColor.style.fill = "#f7b62b";
            this.zoneColor.style.fill = "#201911";
            this.currentCount = today.adjusted.steps;
            this.currentGoal = goals.steps;
        }
        if (this.mode == Face.modes.Distance) {
            this.distanceColor.style.fill = "#f7b62b";
            this.stepsColor.style.fill = "#201911";
            this.decimal.style.visibility ="visible";
            this.currentCount = today.adjusted.distance / 16.09344;
            this.currentGoal = goals.distance / 16.09344;
        }
        if (this.mode == Face.modes.Floors) {
            this.floorsColor.style.fill = "#f7b62b";
            this.distanceColor.style.fill = "#201911";
            this.decimal.style.visibility ="hidden";
            this.currentCount = today.adjusted.elevationGain;
            this.currentGoal = goals.elevationGain;
        }
        if (this.mode == Face.modes.Calories) {
            this.caloriesColor.style.fill = "#f7b62b";
            this.floorsColor.style.fill = "#201911";
            this.currentCount = today.adjusted.calories;
            this.currentGoal = goals.calories;
        }

        var percentage = this.currentCount / this.currentGoal;
        if(percentage > 1) percentage = 1;
        this.odometer.text = this.pad((this.currentCount), 5, "0");
    }

    pad(n, width, z) {
        z = z || '0';
        n = Math.round(n) + '';
        var padded = n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        return padded;
    }
}

export default Face;