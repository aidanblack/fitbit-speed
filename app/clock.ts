import clock from "clock";

class Clock {
    dateBox;
    hourHand;
    minuteHand;
    secondHand;

    updateDisplay = function() {};
    updateBattery = function() {};
    updateGoals = function() {};
    weather;

    constructor(dateBox, hourHand, minuteHand, secondHand) {
        try {
            this.dateBox = dateBox;
            this.hourHand = hourHand;
            this.minuteHand = minuteHand;
            this.secondHand = secondHand;

            clock.granularity = "seconds";
        }
        catch (ex) {
            console.log(ex.message);
        }
    }

    updateTime(now) {
        let dateText = now.toLocaleString('default', { month: 'short' }).substring(4, 10);
        this.dateBox.text = dateText.toUpperCase();

        let hours = now.getHours();
        hours = hours % 12 || 12;
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();
        let currentTimestamp = new Date(now).getTime();

        this.hourHand.groupTransform.rotate.angle = ((360 / 12) * hours) + ((360 / 12 / 60) * minutes);
        this.minuteHand.groupTransform.rotate.angle = (360 / 60) * minutes + ((360 / 60 / 60) * seconds);
        this.secondHand.groupTransform.rotate.angle = seconds * 6;

        if((clock.granularity === "minutes"  && (minutes + 5) % 5 === 0) || seconds === 0) this.updateGoals();
        if((clock.granularity === "minutes"  && (minutes + 5) % 5 === 0) || seconds === 0) this.updateBattery();
        if((this.weather.timestamp === 0 || currentTimestamp - this.weather.timestamp > (30 * 60 * 1000))) {
            if(!this.weather.weatherRunning) {
                this.weather.weatherRunning = true;
                this.weather.updateWeather();
            }
        }
        //console.log(`${this.weather.timestamp} : ${currentTimestamp}`);

        this.updateDisplay();
    }

    updateDate(date) {
        let dateText = date.toLocaleString('default', { month: 'short' }).substring(4, 10);
        //this.dateBox.text = dateText;
    }

    // ***** Add event handler *****
    startClock() {
        clock.ontick = (evt) => {
            let now = evt.date;
            this.updateDate(now);
            this.updateTime(now);
        }
    }
}

export default Clock;
