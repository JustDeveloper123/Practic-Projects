const inputEl = document.querySelector('.input');
const checkInputBtn = document.querySelector('.check-input');
const secretNumEl = document.querySelector('.secret-num');
const startOverBtn = document.querySelector('.start-over');
const textResult = document.querySelector('.text-result');
const scoreEl = document.querySelector('.score > .num');
const bestScoreEl = document.querySelector('.best-score > .num');

const consoleBlock = document.querySelector('.console');

// Game
const minNum = 1;
const maxNum = 20; // Max num

function createSecretNum() {
    return Math.trunc(Math.random() * maxNum) + 1;
}
let secretNum = createSecretNum();
let userNum = 0;
let score = maxNum;
scoreEl.textContent = score;

inputEl.addEventListener('input', function (e) {
    this.value = this.value.replace(/\D/g, '');
});

function gameOver() {
    textResult.textContent = 'Game Over!';
    textResult.classList.add('red');
    document.body.classList.add('_game-over');
    gameLogConsole(`Game over`, 'red');
}
function gameLogConsole(value, color = 'white') {
    let messageDate = `(${new Date().getHours()}:${new Date().getMinutes()})`;
    document.querySelector('.console-empty').style.display = 'none';
    consoleBlock.innerHTML += `<p style="color: ${color}" class="console-row">${messageDate} ${value}</p>`;

    consoleBlock.scrollBy(0, document.querySelector('.console-row:last-child').offsetHeight);
}

checkInputBtn.addEventListener('click', function (e) {
    e.preventDefault();
    inputEl.focus();

    userNum = +inputEl.value;

    if (userNum === secretNum) {
        textResult.textContent = 'Right!';
        secretNumEl.textContent = userNum;
        textResult.classList.add('green');
        inputEl.setAttribute('disabled', 'disabled');
        this.setAttribute('disabled', 'disabled');

        const bestScore = +bestScoreEl.textContent;

        if (score > bestScore) {
            bestScoreEl.textContent = score;
        } else if (score === bestScore) {
            bestScoreEl.textContent = 0;
        }
        gameLogConsole(`You guessed the number ${userNum}`, 'lawngreen');
    }

    else if (userNum > secretNum && userNum <= maxNum) {
        textResult.textContent = 'Too much!';
        scoreEl.textContent = --score;
        if (score === 0) gameOver();
        gameLogConsole(`The number ${userNum} is too much`);
    }

    else if (userNum < secretNum && userNum >= minNum) {
        textResult.textContent = 'Too little!';
        scoreEl.textContent = --score;
        if (score === 0) gameOver();
        gameLogConsole(`The number ${userNum} is too little`);
    }

    else {
        textResult.textContent = 'Value not in range!';
    }

    inputEl.value = '';
});

startOverBtn.addEventListener('click', () => {
    secretNum = createSecretNum();
    score = maxNum;
    scoreEl.textContent = score;
    inputEl.value = '';
    textResult.textContent = 'Enter a number!';
    secretNumEl.textContent = '???';
    inputEl.removeAttribute('disabled');
    checkInputBtn.removeAttribute('disabled');
    textResult.classList.remove('green', 'red');
    inputEl.focus();
    gameLogConsole(`Game reloaded`, 'yellow');

    if (document.body.classList.contains('_game-over')) {
        document.body.classList.remove('_game-over');
    }
});