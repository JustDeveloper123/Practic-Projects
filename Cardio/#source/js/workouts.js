//Todo: Спільний клас для наслідників
class Workout {
    date = new Date();
    id = crypto.randomUUID().slice(-8);
    marker;

    constructor({ coords, marker, distance, duration }) {
        this.coords = coords;
        this.distance = distance;
        this.duration = duration;
        this.marker = marker;
        this._setDescription();
    }

    _setDescription() {
        this.dateLocale = Intl.DateTimeFormat("uk-UA").format(this.date);
    }
}

//Todo: Наслідники з трохи різними данними
class Running extends Workout {
    type = "running";

    constructor({ coords, marker, distance, duration, temp }) {
        super({ coords, marker, distance, duration });
        this.temp = temp;
        this._calcPace();
    }

    _calcPace() {
        this.pace = this.duration / this.distance;
        // min/km
    }
}

class Cycling extends Workout {
    type = "cycling";

    constructor({ coords, marker, distance, duration, climb }) {
        super({ coords, marker, distance, duration });
        this.climb = climb;
        this._calcSpeed();
    }

    _calcSpeed() {
        this.speed = this.distance / this.duration / 60;
        // km/h
    }
}
