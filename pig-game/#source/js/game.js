// Funtions
const documentElementFinder = function (element, quantity = 0) {
    let foundEl;

    if (quantity === 1) {
        foundEl = document.querySelectorAll(element);
    }
    else {
        foundEl = document.querySelector(element);
    }

    return foundEl;
};

// Game elements
const gameEls = {
    // Player stats
    player1: documentElementFinder('.player-1'),
    player2: documentElementFinder('.player-2'),
    activePlayer: documentElementFinder('._active-player'),
    player1Score: documentElementFinder('.player-1__score'),
    player2Score: documentElementFinder('.player-2__score'),
    player1CurrentScore: documentElementFinder('.player-1 .score-block__score'),
    player2CurrentScore: documentElementFinder('.player-2 .score-block__score'),

    // Buttons
    btnNewGame: documentElementFinder('.btn-new-game'),
    btnRollDice: documentElementFinder('.btn-roll-dice'),
    btnHoldDice: documentElementFinder('.btn-hold-dice'),

    // Dice
    dice: documentElementFinder('.dice'),

    // Modal
    playerWonModal: documentElementFinder('.player-won-modal'),
    playerWonModalCloseBtn: documentElementFinder('.player-won-modal .modal-close'),
};

// Game info
let gameInfo = {
    playersScore: [0, 0],
    currentPlayerScore: 0,
    activePlayer: 0,
    finalScore: 5,
    winner: false,
};

// Game functionality
const gameFunctionality = {
    // Initial game properties
    initialProperties: function () {
        gameEls.player1Score.textContent = 0;
        gameEls.player2Score.textContent = 0;
        gameEls.player1CurrentScore.textContent = 0;
        gameEls.player2CurrentScore.textContent = 0;
        gameInfo.currentPlayerScore = 0;
        gameInfo.playersScore = [0, 0];
        gameInfo.winner = false;

        gameEls.dice.classList.add('_hidden');
        gameEls.player1.classList.remove('_winner');
        gameEls.player2.classList.remove('_winner');
        gameEls.btnRollDice.removeAttribute('disabled');
        gameEls.btnHoldDice.removeAttribute('disabled');

        if (gameInfo.activePlayer === 1) this.switchPlayer();

    },

    // Random number of the dice
    randomNumOfDice: function () {
        return Math.trunc(Math.random() * 6) + 1;
    },

    // Switch player
    switchPlayer: function () {
        gameInfo.activePlayer = gameInfo.activePlayer === 0 ? 1 : 0;

        gameEls.player1.classList.toggle('_active-player');
        gameEls.player2.classList.toggle('_active-player');
    },

    updateCurrentScore: function (number) {
        gameInfo.currentPlayerScore += number;

        if (gameInfo.activePlayer === 0) {
            gameEls.player1CurrentScore.textContent = gameInfo.currentPlayerScore;
        } else {
            gameEls.player2CurrentScore.textContent = gameInfo.currentPlayerScore;
        }
    },

    // Create dice
    createDice: function (diceSelector) {
        diceSelector.classList.remove('_hidden');

        const randomNum = this.randomNumOfDice();

        const diceForm = document.createElement('div');
        diceForm.classList.add(`dice-num-${randomNum}`, 'dice-circles-wrap');
        diceSelector.appendChild(diceForm);

        // Remove old dice on click
        gameEls.btnRollDice.addEventListener('click', function () {
            diceForm.remove();
        });

        // Create dice circles
        for (let i = 0; i < randomNum; i++) {
            const index = i + 1;

            const diceCircleEl = document.createElement('div');
            diceCircleEl.classList.add(`dice-circle-${index}`, 'dice-circle');
            diceForm.appendChild(diceCircleEl);
        }

        // Functionality of the dice
        if (randomNum === 1) {
            gameInfo.currentPlayerScore = 0;

            if (gameInfo.activePlayer === 0) {
                gameEls.player1CurrentScore.textContent = gameInfo.currentPlayerScore;
            } else {
                gameEls.player2CurrentScore.textContent = gameInfo.currentPlayerScore;
            }

            this.switchPlayer();
        } else {
            this.updateCurrentScore(randomNum);
        }

        // Game winner
        let currentScore;
        if (gameInfo.activePlayer === 0) {
            currentScore = gameInfo.playersScore[0] + gameInfo.currentPlayerScore;
        } else {
            currentScore = gameInfo.playersScore[1] + gameInfo.currentPlayerScore;
        }
        if (currentScore >= gameInfo.finalScore) {
            if (gameInfo.activePlayer === 0) {
                gameEls.player1Score.textContent = currentScore;
                gameEls.player1.classList.add('_winner');
                gameInfo.winner = 0;
                this.playerWonModalOpen();
            }
            if (gameInfo.activePlayer === 1) {
                gameEls.player2Score.textContent = currentScore;
                gameEls.player2.classList.add('_winner');
                gameInfo.winner = 1;
                this.playerWonModalOpen();
            }
            gameEls.btnRollDice.setAttribute('disabled', 'disabled');
            gameEls.btnHoldDice.setAttribute('disabled', 'disabled');
        }
    },

    // Hold the dice
    holdDice: function () {
        if (gameInfo.activePlayer === 0) {
            gameInfo.playersScore[0] += gameInfo.currentPlayerScore;
            gameEls.player1Score.textContent = gameInfo.playersScore[0];
            gameEls.player1CurrentScore.textContent = 0;
        } else {
            gameInfo.playersScore[1] += gameInfo.currentPlayerScore;
            gameEls.player2Score.textContent = gameInfo.playersScore[1];
            gameEls.player2CurrentScore.textContent = 0;
        }
        gameInfo.currentPlayerScore = 0;
        gameEls.dice.classList.add('_hidden');
        this.switchPlayer();
    },

    // Roll the dice on click
    rollTheDiceOnClick: function (buttonEl) {
        buttonEl.addEventListener('click', () => this.createDice(gameEls.dice));
    },

    // Hold the dice on click
    holdTheDiceOnClick: function (buttonEl) {
        buttonEl.addEventListener('click', () => this.holdDice());
    },

    // Restarting the game by pressing a button
    restartGameOnClick: function (buttonEl) {
        buttonEl.addEventListener('click', () => this.initialProperties());
    },

    // Player won modal functionality
    playerWonModalOpen: function () {
        const modal = gameEls.playerWonModal;
        const closeModalBtn = gameEls.playerWonModalCloseBtn;
        const modalText = documentElementFinder('.player-won-modal .modal__winner-text');

        modalText.textContent = gameInfo.winner === 0 ? 'Player 1 won!' : 'Player 2 won!';

        modal.classList.add('_active');
        closeModalBtn.addEventListener('click', function () {
            modal.classList.remove('_active');
        });
        // Click outside
        const modalCanCloseTimeout = function (time) {
            setTimeout(
                () => {
                    window.addEventListener('click', (e) => {
                        if (e.target === modal) {
                            modal.classList.remove('_active');
                        }
                    });
                },
                time
            );
        };
        modalCanCloseTimeout(1300);
    },
};

// Game build
gameFunctionality.restartGameOnClick(gameEls.btnNewGame);
gameFunctionality.rollTheDiceOnClick(gameEls.btnRollDice);
gameFunctionality.holdTheDiceOnClick(gameEls.btnHoldDice);