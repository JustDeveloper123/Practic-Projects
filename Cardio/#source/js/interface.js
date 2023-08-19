const mobileSize = 768;

const sidebar = document.querySelector(".sidebar");
const sidebarInfo = sidebar.querySelector(".sidebar-info");
const sidebarInfoRunningCount = sidebar.querySelector(
    ".sidebar-info .count--running .count"
);
const sidebarInfoCyclingCount = sidebar.querySelector(
    ".sidebar-info .count--cycling .count"
);
const sidebarEls = sidebar.querySelectorAll(".sidebar-el");
const mapTile = document.querySelector("#map");

const workoutsBlock = sidebar.querySelector(".workouts");
const workoutsAllTabs = sidebar.querySelectorAll(".tab");
const workoutForm = sidebar.querySelector(".workouts__form");
const workoutsContainer = sidebar.querySelector(".workouts__items");
const workoutEmptyMessage = sidebar.querySelector(".workouts__empty-message");
const workoutsStats = sidebar.querySelector(".workouts__stats");
const workoutsStatsRows = sidebar.querySelectorAll(
    ".workouts__stats .stats__row"
);

const workoutsStatsQty = workoutsStats.querySelector("#quantity");
const workoutsStatsRunningQty =
    workoutsStats.querySelector("#running-quantity");
const workoutsStatsCyclingQty =
    workoutsStats.querySelector("#cycling-quantity");
const workoutsStatsDistance = workoutsStats.querySelector("#distance");
const workoutsStatsDuration = workoutsStats.querySelector("#duration");

const modal = document.querySelector(".modal");
const modalClose = modal.querySelector(".modal-close");
const modalText = modal.querySelector(".modal-text");
const modalBtn = modal.querySelector(".modal-btn");
const actionsTabsContainer = sidebar.querySelector(".actions__tabs");
const actionsTabsBtns = sidebar.querySelectorAll(
    ".actions__tabs .actions__tab"
);
const actionsTabsWorkoutsItems = sidebar.querySelector(
    '.actions__tabs [data-tab=".workouts__items"]'
);
const actionsSortLabel = sidebar.querySelector(".actions__sort-btn .label");

const btnActionsDeleteAll = sidebar.querySelector(".actions__delete-all-btn");
const btnActionsSort = sidebar.querySelector(".actions__sort-btn");
const btnSidebarSwitch = sidebar.querySelector(".sidebar__status-switch-btn");
const btnRemoveForm = workoutForm.querySelector("#remove-form-btn");

const btnsDeleteWorkout = workoutsContainer.querySelector(
    ".item__delete-workout"
);

const inputType = workoutForm.querySelector("#form__type");
const inputDistance = workoutForm.querySelector("#form__distance");
const inputDuration = workoutForm.querySelector("#form__duration");
const inputTemp = workoutForm.querySelector("#form__temp");
const inputClimb = workoutForm.querySelector("#form__climb");

const inputsFormValid = workoutForm.querySelectorAll(".form-input--valid");

class EventManager {
    constructor() {
        this._setEmptyWorkoutsTitle();
        this._setAdditionalStyles();

        modalClose.addEventListener("click", this._closeModal);
    }

    _switchSidebar() {
        const isHidden = sidebar.classList.contains("_hidden");

        const hideSidebar = function () {
            const btnSidebarSwitchWidth =
                btnSidebarSwitch.getBoundingClientRect().width;

            const sidebarWidth = sidebar.getBoundingClientRect().width;

            btnSidebarSwitch.classList.add("_hidden");
            sidebar.classList.add("_hidden");
            sidebar.style.transform = `translateX(calc(-100% + ${btnSidebarSwitchWidth}px))`;
            sidebarInfo.classList.remove("_hidden");
            sidebarEls.forEach((el) => el.classList.add("sidebar--hidden-el"));
            if (!(window.screen.width <= mobileSize)) {
                //! Карта пересувається лише тоді, якщо вона більша за поріг перебудови верстик
                mapTile.style.marginLeft = `-${
                    sidebarWidth - btnSidebarSwitchWidth
                }px`;
            } else {
                mapTile.style.marginLeft = 0;
                mapTile.style.width = `calc(100vw - ${btnSidebarSwitchWidth}px)`;
            }
        };

        if (!isHidden) {
            hideSidebar();
            return;
        }

        const showSidebar = function () {
            btnSidebarSwitch.classList.remove("_hidden");
            sidebar.classList.remove("_hidden");
            sidebar.style.transform = "none";
            sidebarInfo.classList.add("_hidden");
            sidebarEls.forEach((el) =>
                el.classList.remove("sidebar--hidden-el")
            );
            mapTile.style.transform = "none";
            mapTile.style.marginLeft = `0`;
        };

        if (isHidden) showSidebar();
    }

    _setEmptyWorkoutsTitle() {
        const isEmpty =
            workoutsContainer.querySelector(".workout__item") ||
            !workoutForm.classList.contains("_hidden");

        if (isEmpty) {
            workoutEmptyMessage.classList.add("_hidden");
        } else {
            workoutEmptyMessage.classList.remove("_hidden");
        }
    }

    _openModal({
        text = "Помилка",
        close = true,
        overlayColor = "rgba(0, 0, 0, 0.6)",
        overlayClick = true,
        animate = true,
        btn = {
            active: false,
            text: "",
            color: "",
            backgroundColor: "",
            action: false,
        },
    }) {
        modalText.textContent = text;
        modal.style.backgroundColor = overlayColor;

        modal.classList.remove("_hidden");

        animate
            ? modal.classList.add("animation")
            : modal.classList.remove("animation");
        close
            ? modalClose.classList.remove("hidden")
            : modalClose.classList.add("hidden");

        if (btn.active) {
            modalBtn.classList.remove("hidden");

            modalBtn.textContent = btn.text;
            modalBtn.style.color = btn.color;
            modalBtn.style.backgroundColor = btn.backgroundColor;

            btn.action && btn.action();
        } else {
            modalBtn.classList.add("hidden");
        }

        const overlayOnClick = function (e) {
            if (!e.target.classList.contains("modal")) return;
            this._closeModal();
        };

        if (overlayClick) {
            modal.addEventListener("click", overlayOnClick.bind(this));
        }
    }

    _closeModal() {
        modal.classList.add("_hidden");
    }

    _setAdditionalStyles() {
        //* Красимо кожен другий блок в табі "Статистика"
        workoutsStatsRows.forEach((row, index) => {
            index--;
            if (index % 2) {
                row.style.backgroundColor = "#333";
            }
        });
    }
}

const eventManager = new EventManager();
