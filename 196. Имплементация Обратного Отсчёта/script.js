"use strict";

// Simply Bank App

const account1 = {
    userName: "Cecil Ireland",
    transactions: [500, 250, -300, 5000, -850, -110, -170, 1100],
    interest: 1.5,
    pin: 1111,
    transactionsDates: [
        "2020-10-02T14:43:31.074Z",
        "2020-10-29T11:24:19.761Z",
        "2020-11-15T10:45:23.907Z",
        "2021-01-22T12:17:46.255Z",
        "2023-07-10T15:14:06.486Z",
        "2023-07-11T11:42:26.371Z",
        "2023-07-12T07:43:59.331Z",
        "2023-07-13T15:12:20.814Z",
    ],
    currency: "USD",
    locale: "en-US",
};

const account2 = {
    userName: "Amani Salt",
    transactions: [2000, 6400, -1350, -70, -210, -2000, 5500, -30],
    interest: 1.3,
    pin: 2222,
    transactionsDates: [
        "2020-10-02T14:43:31.074Z",
        "2020-10-29T11:24:19.761Z",
        "2020-11-15T10:45:23.907Z",
        "2021-01-22T12:17:46.255Z",
        "2021-02-12T15:14:06.486Z",
        "2021-03-09T11:42:26.371Z",
        "2021-05-21T07:43:59.331Z",
        "2021-06-22T15:21:20.814Z",
    ],
    currency: "UAH",
    locale: "uk-UA",
};

const account3 = {
    userName: "Corey Martinez",
    transactions: [900, -200, 280, 300, -200, 150, 1400, -400],
    interest: 0.8,
    pin: 3333,
    transactionsDates: [
        "2020-10-02T14:43:31.074Z",
        "2020-10-29T11:24:19.761Z",
        "2020-11-15T10:45:23.907Z",
        "2021-01-22T12:17:46.255Z",
        "2021-02-12T15:14:06.486Z",
        "2021-03-09T11:42:26.371Z",
        "2021-05-21T07:43:59.331Z",
        "2021-06-22T15:21:20.814Z",
    ],
    currency: "RUB",
    locale: "ru-RU",
};

const account4 = {
    userName: "Kamile Searle",
    transactions: [530, 1300, 500, 40, 190],
    interest: 1,
    pin: 4444,
    transactionsDates: [
        "2020-10-02T14:43:31.074Z",
        "2020-10-29T11:24:19.761Z",
        "2020-11-15T10:45:23.907Z",
        "2021-01-22T12:17:46.255Z",
        "2021-02-12T15:14:06.486Z",
    ],
    currency: "CAD",
    locale: "fr-CA",
};

const account5 = {
    userName: "Oliver Avila",
    transactions: [630, 800, 300, 50, 120],
    interest: 1.1,
    pin: 5555,
    transactionsDates: [
        "2020-10-02T14:43:31.074Z",
        "2020-10-29T11:24:19.761Z",
        "2020-11-15T10:45:23.907Z",
        "2021-01-22T12:17:46.255Z",
        "2021-02-12T15:14:06.486Z",
    ],
    currency: "USD",
    locale: "en-US",
};

const accounts = [account1, account2, account3, account4, account5];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".total__value--in");
const labelSumOut = document.querySelector(".total__value--out");
const labelSumInterest = document.querySelector(".total__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerTransactions = document.querySelector(".transactions");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseNickname = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

//*====================================*//
//*=============== Code ===============*//
//*====================================*//

//? Мы можем писать код в глобальном скоупе, но это как правило не очень хорошая практика

const formatTransactionDate = function (date, locale) {
    const getDaysBetween2Dates = (date1, date2) =>
        Math.round(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));

    const daysPassed = getDaysBetween2Dates(new Date(), date);
    // console.log(daysPassed);

    if (daysPassed === 0) return "Сегодня";
    if (daysPassed === 1) return "Вчера";
    if (daysPassed <= 7) return `${daysPassed} дней назад`;
    else return new Intl.DateTimeFormat(locale).format(date);
};

//Todo: Форматирование валют
const formatCurrency = function (value, locale, currency) {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
    }).format(value);
};

//Todo: Отображение транзакций
const displayTransactions = function (account, sort = false) {
    //Todo: Очищаем все транзакции
    containerTransactions.innerHTML = "";

    //Todo: Выбор сортировки, С или БЕЗ
    const transacs = sort
        ? account.transactions.slice().sort((x, y) => x - y)
        : account.transactions;

    transacs.forEach(function (trans, index) {
        const transType = trans > 0 ? "deposit" : "withdrawal";

        const date = new Date(account.transactionsDates[index]);
        const transDate = formatTransactionDate(date, account.locale);

        const formattedTrans = formatCurrency(
            trans,
            account.locale,
            account.currency
        );

        const transactionRow = `
<div class="transactions__row">
    <div class="transactions__type transactions__type--${transType}">
        ${index + 1} ${transType}
    </div>
    <div class="transactions__date">${transDate}</div>
    <div class="transactions__value">${formattedTrans}</div>
    </div>`;

        containerTransactions.insertAdjacentHTML("afterbegin", transactionRow);
    });

    [...document.querySelectorAll(".transactions__row")].forEach(function (
        row,
        i
    ) {
        if (i % 2 === 0) {
            row.style.backgroundColor = "#dedede";
        }
    });
};

const createNicknames = function (accs) {
    accs.forEach(function (acc) {
        acc.nickName = acc.userName
            .toLowerCase()
            .split(" ")
            .map((word) => word[0])
            .join("");
    });
};

createNicknames(accounts);

const displayBalance = function (account) {
    const balance = account.transactions.reduce((acc, trans) => acc + trans, 0);
    account.balance = balance;
    labelBalance.textContent = formatCurrency(
        balance,
        account.locale,
        account.currency
    );
};

const displayTotal = function (account) {
    //Todo: Deposites
    const depositesTotal = account.transactions.filter((trans) => trans > 0);

    if (depositesTotal.length) {
        const totalIn = depositesTotal.reduce((acc, trans) => acc + trans, 0);
        // labelSumIn.textContent = `${totalIn.toFixed(2)}$`;
        labelSumIn.textContent = formatCurrency(
            totalIn,
            account.locale,
            account.currency
        );
    }

    //Todo: Withdrawals
    const withdrawalsTotal = account.transactions.filter((trans) => trans < 0);

    if (withdrawalsTotal.length) {
        const totalOut = withdrawalsTotal.reduce((acc, trans) => acc + trans);
        // labelSumOut.textContent = `${totalOut.toFixed(2)}$`;
        labelSumOut.textContent = formatCurrency(
            totalOut,
            account.locale,
            account.currency
        );
    }

    //Todo: Interest
    const interestTotal = account.transactions
        .filter((trans) => trans > 0)
        .map((depos) => (depos * account.interest) / 100)
        .filter((interest) => interest > 5)
        .reduce((acc, interest) => acc + interest, 0);
    // .toFixed(2);
    // labelSumInterest.textContent = `${interestTotal}$`;
    labelSumInterest.textContent = formatCurrency(
        interestTotal,
        account.locale,
        account.currency
    );
};

const updateUI = function (account) {
    //Todo: Display transactions
    displayTotal(account);

    //Todo: Display balance
    displayBalance(account);

    //Todo: Display total
    displayTransactions(account);

    [...document.querySelectorAll(".transactions__row")].forEach(function (
        row,
        i
    ) {
        if (i % 2 === 0) {
            row.style.backgroundColor = "#dedede";
        }
    });
};

let currentAccount, currentLogoutTimer;

const startLogoutTimer = function () {
    const logoutTimerCallback = function () {
        const minutes = String(Math.trunc(time / 60)).padStart(2, "0");
        const seconds = String(Math.trunc(time % 60)).padStart(2, "0");

        //Todo: В каждом вызове показывать оставшееся время в UI
        labelTimer.textContent = `${minutes}:${seconds}`;

        //Todo: После окончания времени выйти с аккаунта
        if (time === 0) {
            clearInterval(logoutTimer);

            //Todo: Сброс UI
            containerApp.style.opacity = 0;
            containerApp.style.visibility = "hidden";
            containerApp.style.pointerEvents = "none";

            labelWelcome.textContent = `Войдите в свой аккаунт`;
        }

        time--;
    };

    //Todo: Устанавливаем время выхода через 5 минут
    let time = 60 * 5;

    logoutTimerCallback();

    //Todo: Вызов таймера каждую секунду
    const logoutTimer = setInterval(logoutTimerCallback, 1000);

    return logoutTimer;
};

btnLogin.addEventListener("click", function (e) {
    e.preventDefault();
    currentAccount = accounts.find(
        (account) => account.nickName === inputLoginUsername.value
    );

    //! Using Optional Chaining Operator
    if (currentAccount?.pin === +inputLoginPin.value) {
        //Todo: Display UI and welcome message
        containerApp.style.opacity = 100;
        containerApp.style.visibility = "visible";
        containerApp.style.pointerEvents = "auto";

        labelWelcome.textContent = `Рады, что вы снова с нами, ${
            currentAccount.userName.split(" ")[0]
        }!`;

        inputLoginUsername.value = "";
        inputLoginPin.value = "";
        inputLoginUsername.blur();
        inputLoginPin.blur();

        //Todo: Check if the timer exists
        if (currentLogoutTimer) clearInterval(currentLogoutTimer);
        currentLogoutTimer = startLogoutTimer();
        updateUI(currentAccount);

        const now = new Date();

        const options = {
            hour: "numeric",
            minute: "numeric",
            day: "numeric",
            month: "long",
            year: "numeric",
            weekday: "long",
        };

        // const day = `${now.getDate()}`.padStart(2, "0");
        // const month = `${now.getMonth() + 1}`.padStart(2, "0");
        // const year = now.getFullYear();
        //? (day, month, year)
        labelDate.textContent = Intl.DateTimeFormat(
            currentAccount.locale,
            options
        ).format(now);
    }
});

//! Launch data
inputLoginUsername.value = "ci";
inputLoginPin.value = "1111";
btnLogin.click();

btnTransfer.addEventListener("click", function (e) {
    e.preventDefault();

    const transferAmount = +inputTransferAmount.value;
    const recipientNickname = inputTransferTo.value;
    const recipientAccount = accounts.find(
        (account) => account.nickName === recipientNickname
    );
    inputTransferAmount.value = "";
    inputTransferTo.value = "";

    if (
        transferAmount > 0 &&
        currentAccount.balance >= transferAmount &&
        recipientAccount &&
        currentAccount.nickName !== recipientAccount?.nickName
    ) {
        currentAccount.transactions.push(-transferAmount);
        currentAccount.transactionsDates.push(new Date().toISOString());
        recipientAccount.transactions.push(transferAmount);
        recipientAccount.transactionsDates.push(new Date().toISOString());
        updateUI(currentAccount);
    } else {
        alert("Wrong account");
    }

    //Todo: Reset the logout timer
    clearInterval(currentLogoutTimer);
    currentLogoutTimer = startLogoutTimer();
});

btnClose.addEventListener("click", function (e) {
    e.preventDefault();

    const nickName = inputCloseNickname.value;
    const pin = +inputClosePin.value;
    const isCorrectAccountData =
        nickName === currentAccount.nickName && pin === currentAccount.pin;

    if (isCorrectAccountData) {
        const currentAccountIndex = accounts.findIndex(
            (account) => account.nickName === currentAccount.nickName
        );
        accounts.splice(currentAccountIndex, 1);
        // console.log(accounts);

        containerApp.style.opacity = 0;
        containerApp.style.visibility = "hidden";
        containerApp.style.pointerEvents = "none";

        labelWelcome.textContent = "Войдите в свой аккаунт";
    }

    inputCloseNickname.value = "";
    inputClosePin.value = "";
});

btnLoan.addEventListener("click", function (e) {
    e.preventDefault();

    const loanAmount = Math.floor(inputLoanAmount.value);

    if (
        loanAmount > 0 &&
        currentAccount.transactions.some(
            (trans) => trans >= (loanAmount * 10) / 100
        )
    ) {
        setTimeout(function () {
            currentAccount.transactions.push(loanAmount);
            currentAccount.transactionsDates.push(new Date().toISOString());
            updateUI(currentAccount);
        }, 3000);
    }

    inputLoanAmount.value = "";

    //Todo: Reset the timer
    clearInterval(currentLogoutTimer);
    currentLogoutTimer = startLogoutTimer();
});

let transactionsSorted = false;
btnSort.addEventListener("click", function (e) {
    e.preventDefault();

    displayTransactions(currentAccount, !transactionsSorted);
    transactionsSorted = !transactionsSorted;
});

//Todo: Получаем сумму транзакций из DOM

const logoImage = document.querySelector(".logo");
logoImage.addEventListener("click", function (e) {
    const transactionsUi = document.querySelectorAll(".transactions__value");
    // console.log(transactionsUi);

    const transactionsUiArray = Array.from(
        transactionsUi,
        (trans) => +trans.textContent
    ); //! Преобразуем NodeList в Массив через Array.from()
    console.log(transactionsUiArray);

    // console.log(transactionsUiArray.map((el) => Number(el.textContent)));
});
