import document from "document";
import { battery } from "power";

class Battery {

    batteryColor = document.getElementById("batteryColor") as ImageElement;

    constructor() {}

    updateBattery() {
        if(battery.chargeLevel < 20) {
            this.batteryColor.style.fill = "#990000";
            this.batteryColor.style.opacity = 0.6;
        }
        else {
            this.batteryColor.style.fill = "#330000";
            this.batteryColor.style.opacity = 0.8;
        }

        console.log("Battery Updated");
    }
}

export default Battery;