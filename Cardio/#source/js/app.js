class App {
    zoom = 14.5;

    #map;
    #mapEvent;
    #userCoords;
    #workouts = [];
    #isMarkerFormActive = false;
    #currentMarker;
    #sort = {
        sortType: 0,
        sortTypeMaxQty: 3,
    };

    constructor() {
        //* Отримання місцезнаходження користувача
        this._getPosition();
        //* Відображаємо інформацію про к-ть треніровок при закритому сайдбарі
        this._updateStats();

        //* Кнопка сайдбару
        btnSidebarSwitch.addEventListener("click", this._fixMap.bind(this));
        //* Змінення типу форми
        inputType.addEventListener("change", this._switchType);

        //* Видалення треніровки зі списку і на карті
        workoutsContainer.addEventListener(
            "click",
            this._deleteWorkout.bind(this)
        );
        //* Переміщення на маркер при кліку по треніровці
        workoutsContainer.addEventListener(
            "click",
            this._moveToWorkout.bind(this)
        );
        //* Видалення всіх треніровок
        btnActionsDeleteAll.addEventListener(
            "click",
            this._deleteAllWorkouts.bind(this)
        );
        //* Сортування треніровок
        btnActionsSort.addEventListener("click", this._sortWorkouts.bind(this));
        //* Переключання табів
        actionsTabsContainer.addEventListener("click", this._switchTabs);

        //* Події клавіатури на сторінці
        window.addEventListener("keydown", this._keyboardManager.bind(this));
    }

    _getPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                //* Якщо геолокацію знайдено
                this._loadMap.bind(this),
                //* Якщо геолокацію не знайдено
                function () {
                    eventManager._openModal({
                        text: "Сайт взаємодіє з вашою гелокацією для показу карти з вашим теперешнім місцезнаходженням, тому вам потрібно дати дозвіл до геолокацї для сайту в налаштуваннях браузеру!",
                        animate: false,
                        close: false,
                        overlayColor: "#222",
                        overlayClick: false,
                        btn: {
                            active: true,
                            text: "Перезапустити",
                            color: "white",
                            backgroundColor: "rgb(197, 20, 20)",
                            action: function () {
                                modalBtn.addEventListener("click", function () {
                                    location.reload();
                                });
                            },
                        },
                    });
                }
            );
        }
    }

    _loadMap(position) {
        //* Координати
        const { latitude, longitude } = position.coords;
        this.#userCoords = [latitude, longitude];

        //* Карта
        this.#map = L.map("map");
        this.#map.setView(this.#userCoords, this.zoom);

        //* Отримуємо дані з localStorage
        this._getLocaleStorageData();

        const OSM = L.tileLayer(
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }
        );
        OSM.addTo(this.#map);

        this.#map.on("click", this._showForm.bind(this));
    }

    _fixMap() {
        eventManager._switchSidebar();
        const transitionMs =
            parseFloat(window.getComputedStyle(sidebar).transitionDuration) *
            1000;

        setTimeout(() => {
            this.#map.invalidateSize();
        }, transitionMs);
    }

    _showForm(mapEvent) {
        //Todo: Переключення таба на основний
        actionsTabsBtns.forEach((btn) => btn.classList.remove("_active-tab"));
        workoutsAllTabs.forEach((tab) => tab.classList.remove("_active-tab"));
        actionsTabsWorkoutsItems.classList.add("_active-tab");
        workoutsContainer.classList.add("_active-tab");

        //Todo: Створення маркеру на карті
        const { lat, lng } = mapEvent.latlng;
        this.#mapEvent = [lat, lng];

        //Todo: Показ анімації "тряска" форми
        if (!workoutForm.classList.contains("_hidden")) {
            workoutForm.classList.add("_error-anim-1");
            workoutForm.addEventListener("animationend", () => {
                workoutForm.classList.remove("_error-anim-1");
            });
        }
        //Todo: Скрол до форми з плавною анімацією
        workoutsBlock.scrollTo({
            top: 0,
            behavior: "smooth",
        });

        //* Якщо один маркер уже створюється або сайдбар відкритий
        if (sidebar.classList.contains("_hidden")) this._fixMap();
        if (this.#isMarkerFormActive) return;

        this.#currentMarker = L.marker(this.#mapEvent).addTo(this.#map);
        this.#isMarkerFormActive = !this.#isMarkerFormActive;

        //Todo: Дії з формою
        workoutForm.classList.remove("_hidden");
        workoutsContainer.classList.remove("_remove-padding");
        eventManager._setEmptyWorkoutsTitle();

        btnRemoveForm.addEventListener("click", this._removeForm.bind(this));
    }

    _hideForm() {
        this.#isMarkerFormActive = false;

        inputDistance.value =
            inputDuration.value =
            inputTemp.value =
            inputClimb.value =
                "";

        workoutForm.classList.add("_hidden");
        workoutsContainer.classList.add("_remove-padding");
    }

    _removeForm() {
        this._hideForm();
        this.#currentMarker.remove();
        eventManager._setEmptyWorkoutsTitle();
    }

    _switchType(e) {
        function toggle(el1, el2) {
            const toggleClassEl = ".form__cell";
            el1.closest(toggleClassEl).classList.add("_hidden");
            el2.closest(toggleClassEl).classList.remove("_hidden");
        }
        const target = e.target.value;

        if (target === "running") toggle(inputClimb, inputTemp);
        if (target === "cycling") toggle(inputTemp, inputClimb);
    }

    _createWorkout() {
        if (workoutForm.classList.contains("_hidden")) return;

        //* Провірка, чи тільки числа, не введене значення видасть false, якщо всі значення цифри, то буде true
        const isCorrectInputValues = function (...values) {
            const isOnlyNumbers = values.every((value) =>
                Number.isFinite(value && +value)
            );

            return isOnlyNumbers;
        };

        const showErrorAnimation = function (...inputs) {
            //* Анімація "тряска" для форми
            workoutForm.classList.add("_error-anim");
            workoutForm.addEventListener("animationend", function () {
                workoutForm.classList.remove("_error-anim");
            });

            //* Знаходимо, які інпути некоректні, і на них даємо анімацію
            inputs.forEach((input) => {
                if (!isCorrectInputValues(input.value)) {
                    input.classList.add("_error-anim");
                    input.addEventListener("animationend", function () {
                        input.classList.remove("_error-anim");
                    });
                }
            });
        };

        const type = inputType.value;
        const distance = inputDistance.value;
        const duration = inputDuration.value;

        let workout;

        if (type === "running") {
            const temp = inputTemp.value;

            //* Перевірка валідності даних та виклик анімації невалідних інпутів якщо валідність не пройдена
            if (!isCorrectInputValues(distance, duration, temp)) {
                showErrorAnimation(inputDistance, inputDuration, inputTemp);
                return;
            }

            workout = new Running({
                coords: this.#mapEvent,
                marker: this.#currentMarker,
                distance: +distance,
                duration: +duration,
                temp: +temp,
            });
        }
        if (type === "cycling") {
            const climb = inputClimb.value;

            //* Перевірка валідності даних та виклик анімації невалідних інпутів якщо валідність не пройдена
            if (!isCorrectInputValues(distance, duration, climb)) {
                showErrorAnimation(inputDistance, inputDuration, inputClimb);
                return;
            }

            workout = new Cycling({
                coords: this.#mapEvent,
                marker: this.#currentMarker,
                distance: +distance,
                duration: +duration,
                climb: +climb,
            });
        }

        this.#workouts.push(workout);

        //* Оновляємо локальне сховище
        this._setLocaleStorageData();

        this._displayPupupForMarker(workout);
        this._hideForm();

        //* Фільруємо нову треніровку
        this.#sort.sortType--;
        this._sortWorkouts();
    }

    _displayPupupForMarker(workout, focus = true) {
        let typeTitle;
        if (workout.type === "running") typeTitle = "Пробіжка";
        if (workout.type === "cycling") typeTitle = "Велоїзда";

        workout.marker
            .bindPopup(
                L.popup({
                    maxWidth: 400,
                    minWidth: 100,
                    autoClose: false,
                    closeOnClick: false,
                    className: `workout--${workout.type} workout--popup-${workout.id}`,
                    autoPan: focus,
                    autoPanPadding: L.point(40, 40),
                })
            )
            .setPopupContent(`${typeTitle} ${workout.dateLocale}`)
            .openPopup();
    }

    _displayWorkout(workout, updateStats = true) {
        let typeTitle;
        if (workout.type === "running") typeTitle = "Пробіжка";
        if (workout.type === "cycling") typeTitle = "Велоїзда";

        //Todo: Спільні дані для треніровок
        let html = `<div class="workout__item item workout--${workout.type}" data-id="${workout.id}">
            <div class="item__delete-workout">
                <span>&times;</span>
            </div>

            <h3 class="item__name">${typeTitle} <span>${workout.dateLocale}</span></h3>

            <main class="item__cells">
                <div class="item__cell">
                    <p class="item__description">Дистанція</p>
                    <p class="item__value">${workout.distance} <span class="unit">км</span></p>
                </div>
                <div class="item__cell">
                    <p class="item__description">Час</p>
                    <p class="item__value">${workout.duration} <span class="unit">хв</span></p>
                </div>`;

        //Todo: Дані для пробіжки
        if (workout.type === "running") {
            html += `<div class="item__cell">
                    <p class="item__description">К-ть кілометрів за хв</p>
                    <p class="item__value">
                        ${workout.pace.toFixed(
                            2
                        )} <span class="unit">хв/м</span>
                    </p>
                </div>

                <div class="item__cell">
                    <p class="item__description">Темп</p>
                    <p class="item__value">
                        ${workout.temp} <span class="unit">крок/хв</span>
                    </p>
                </div>
            </main>
        </div>`;
        }
        //Todo: Дані для велоїзди
        if (workout.type === "cycling") {
            html += `<div class="item__cell">
                    <p class="item__description">Швидкість</p>
                    <p class="item__value">
                        ${workout.speed.toFixed(
                            2
                        )} <span class="unit">км/г</span>
                    </p>
                </div>

                <div class="item__cell">
                    <p class="item__description">Висота</p>
                    <p class="item__value">${
                        workout.climb
                    } <span class="unit">м</span></p>
                </div>
            </main>
        </div>`;
        }

        workoutsContainer.insertAdjacentHTML("afterbegin", html);

        //Todo: Оновляємо інформацію про додану треніровку, і також перевірка для того, щоб при завантаженні локальних даних треніровок, статистика оновилась лише один раз
        if (updateStats) {
            this._updateStats();
        }
    }

    _keyboardManager(e) {
        switch (e.code) {
            case "Enter":
                this._createWorkout();
                break;
            case "Space":
                this._createWorkout();
                break;
            case "NumpadEnter":
                this._createWorkout();
                break;
        }
    }

    _deleteWorkout(e) {
        const target = e.target.closest(".item__delete-workout");

        //* Провірка, чи натиснуто потрібний селектор
        if (
            target === null ||
            !target.classList.contains("item__delete-workout")
        )
            return;

        //* Workout ID
        const workoutEl = target.closest(".workout__item");
        const workoutId = workoutEl.dataset.id;

        const workout = this.#workouts.find(
            (workouts) => workouts.id === workoutId
        );

        //Todo: Видаляємо маркер на карті
        workout.marker.remove();
        //Todo: Видаляємо треніровку з массиву
        const workoutIndex = this.#workouts.indexOf(workout);
        this.#workouts.splice(workoutIndex, 1);
        //Todo: Видаляємо треніровку з списку треніровок як HTML з анімацією
        workoutEl.classList.add("deleting-animation");
        workoutEl.addEventListener("animationend", () => {
            workoutEl.remove();
            eventManager._setEmptyWorkoutsTitle();
            this._updateStats();
        });

        //* Оновляємо локальне сховище
        this._setLocaleStorageData();
    }

    _moveToWorkout(e) {
        const target = e.target.closest(".workout__item");

        if (!target) return;

        //* Закривання сайдбару для телефонів
        if (window.screen.width <= mobileSize) {
            eventManager._switchSidebar();
        }

        const workoutId = target.dataset.id;

        const workout = this.#workouts.find(
            (workouts) => workouts.id === workoutId
        );

        if (!workout) return;

        workout.marker.openPopup();
        this.#map.flyTo(workout.coords, this.zoom + 1, {
            animate: true,
            duration: 1.1,
        });
    }

    _deleteAllWorkouts() {
        if (!this.#workouts.length) {
            eventManager._openModal({
                text: "У вас немає треніровок.",
            });

            return; //* Далі код не піде
        }

        const deleteWorkouts = function () {
            this.#workouts.forEach((workout) => workout.marker.remove());
            this.#workouts = [];

            this._updateStats();

            workoutsContainer.innerHTML = "";

            eventManager._closeModal();
            //* Показ "пустого" заголовка за умовою якщо активний головний таб
            if (workoutsContainer.classList.contains("_active-tab")) {
                eventManager._setEmptyWorkoutsTitle();
            }

            //* Оновляємо локальне сховище
            this._setLocaleStorageData();
        }.bind(this);

        eventManager._openModal({
            text: "Ви впевнені? Ця дія видалить всі треніровки.",
            btn: {
                active: true,
                text: "Видалити всі",
                color: "white",
                backgroundColor: "rgb(197, 20, 20)",
                action: function () {
                    modalBtn.addEventListener("click", deleteWorkouts);
                },
            },
        });

        //* Скидаємо значення для рахунку операцій створення треніровок
    }

    _sortWorkouts() {
        //Todo: Змінення типу сортування
        this.#sort.sortType !== this.#sort.sortTypeMaxQty
            ? this.#sort.sortType++
            : (this.#sort.sortType = 0);

        //Todo: Шаблон для сортування
        const sortTemplate = function ({
            text = "Сортування",
            sortValue = "date",
            order = "lr",
        }) {
            actionsSortLabel.textContent = text;
            workoutsContainer.innerHTML = "";

            const workouts = this.#workouts.slice().sort(function (a, b) {
                if (order === "lr") {
                    return a[sortValue] - b[sortValue];
                }
                if (order === "rl") {
                    return b[sortValue] - a[sortValue];
                }
            });

            workouts.forEach((workout) => this._displayWorkout(workout));
        }.bind(this);

        //Todo: Варіації сортування
        if (this.#sort.sortType === 0)
            sortTemplate({ text: "Новіші", sortValue: "date", order: "lr" });
        if (this.#sort.sortType === 1)
            sortTemplate({ text: "Старіші", sortValue: "date", order: "rl" });
        if (this.#sort.sortType === 2)
            sortTemplate({
                text: "Довші (км)",
                sortValue: "distance",
                order: "lr",
            });
        if (this.#sort.sortType === 3)
            sortTemplate({
                text: "Довші (хв)",
                sortValue: "duration",
                order: "lr",
            });
    }

    _setLocaleStorageData() {
        const workoutsToSave = this.#workouts.map((workout) => {
            const object = {
                type: workout.type,
                date: workout.date,
                id: workout.id,
                //! Не зберігаємо об'єкт marker, тому що він з бібліотеки Leaflet й викликає помилку при збереженні такого великого об'єкту
                coords: workout.coords,
                distance: workout.distance,
                duration: workout.duration,
                dateLocale: workout.dateLocale,
            };

            if (workout.type === "running") {
                return {
                    ...object,
                    temp: workout.temp,
                    pace: workout.pace,
                };
            }
            if (workout.type === "cycling") {
                return {
                    ...object,
                    climb: workout.climb,
                    speed: workout.speed,
                };
            }
        });
        localStorage.setItem("workouts", JSON.stringify(workoutsToSave));
    }

    _getLocaleStorageData() {
        const workoutsData = JSON.parse(localStorage.getItem("workouts"));
        //! Якщо undefined, тобто нема треніровок, то код нижче не виконається
        if (workoutsData) {
            this.#workouts = workoutsData;

            this.#workouts.forEach(
                function (workout) {
                    this._displayWorkout(workout, false);
                    this._displayWorkoutsAllMarkers(workout);
                }.bind(this)
            );
            this._updateStats();

            eventManager._setEmptyWorkoutsTitle();
        }
    }

    _displayWorkoutsAllMarkers(workout) {
        workout.marker = L.marker(workout.coords).addTo(this.#map); //! Повертаємо маркер назад до об'єкту, тому що при зберіганні в локальному сховищі ми його видаляли
        this._displayPupupForMarker(workout, false);
    }

    _switchTabs(e) {
        const target = e.target.closest(".actions__tab");

        if (!target) return;

        //Todo: Покажемо анімацію якщо ми намагаємось переключити таб з відкритою формою
        if (!workoutForm.classList.contains("_hidden")) {
            workoutForm.classList.add("_error-anim-1");
            workoutForm.addEventListener("animationend", () => {
                workoutForm.classList.remove("_error-anim-1");
            });
            workoutsBlock.scrollTo({
                top: 0,
                behavior: "smooth",
            });

            return; //* Код не продовжиться якщо форма відкрита, і змінення табу не відбудеться
        }

        //Todo: Змінення кнопки
        actionsTabsBtns.forEach((btn) => btn.classList.remove("_active-tab"));
        target.classList.add("_active-tab");

        //Todo: Змінення табів
        const tab = document.querySelector(target.dataset.tab);

        workoutsAllTabs.forEach((tab) => tab.classList.remove("_active-tab"));
        tab.classList.add("_active-tab");

        //! Додаткові дії для усунення "пустого" надпису для табів
        tab.classList.contains("workouts__items")
            ? eventManager._setEmptyWorkoutsTitle()
            : workoutEmptyMessage.classList.add("_hidden");
    }

    _updateStats() {
        //* Інформація для таба "Статистика"
        const statsWorkoutsQty = this.#workouts.length;

        const statsRunningQty = this.#workouts.filter(
            (workout) => workout.type === "running"
        ).length;

        const statsCyclingQty = this.#workouts.filter(
            (workout) => workout.type === "cycling"
        ).length;

        const statsDistance = this.#workouts
            .map((workout) => workout.distance)
            .reduce((acc, value) => acc + value, 0);

        const statsDuration = this.#workouts
            .map((workout) => workout.duration)
            .reduce((acc, value) => acc + value, 0);

        //Todo: Шаблон функції для зміннення зміненої інформації
        const updateInfo = function (el, newValue) {
            el.textContent = newValue;
        };

        //Todo: Оновлення інформації в потрібних блоках
        //* Sidebar ===================
        updateInfo(sidebarInfoRunningCount, statsRunningQty);
        updateInfo(sidebarInfoCyclingCount, statsCyclingQty);
        //* ===========================

        //* Stats Tab
        updateInfo(workoutsStatsQty, statsWorkoutsQty);
        updateInfo(workoutsStatsRunningQty, statsRunningQty);
        updateInfo(workoutsStatsCyclingQty, statsCyclingQty);
        updateInfo(workoutsStatsDistance, statsDistance);
        updateInfo(workoutsStatsDuration, statsDuration);
    }
}

const app = new App();
