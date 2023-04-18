"use strict";document.addEventListener("DOMContentLoaded",(()=>{}));const documentElementFinder=function(e,n=0){let t;return t=1===n?document.querySelectorAll(e):document.querySelector(e),t},gameEls={player1:documentElementFinder(".player-1"),player2:documentElementFinder(".player-2"),activePlayer:documentElementFinder("._active-player"),player1Score:documentElementFinder(".player-1__score"),player2Score:documentElementFinder(".player-2__score"),player1CurrentScore:documentElementFinder(".player-1 .score-block__score"),player2CurrentScore:documentElementFinder(".player-2 .score-block__score"),endingOnNowNumberEl:documentElementFinder(".ending-on__num-now .num"),btnNewGame:documentElementFinder(".btn-new-game"),btnRollDice:documentElementFinder(".btn-roll-dice"),btnHoldDice:documentElementFinder(".btn-hold-dice"),btnEndingOn:documentElementFinder(".ending-on__btn"),inputEndingOn:documentElementFinder(".ending-on__input"),dice:documentElementFinder(".dice"),messagesModal:documentElementFinder(".messages-modal"),messagesModalCloseBtn:documentElementFinder(".messages-modal .modal-close")};let gameInfo={playersScore:[0,0],currentPlayerScore:0,activePlayer:0,finalScore:100,minFinalScore:10,winner:!1};const gameFunctionality={initialProperties:function(){gameEls.player1Score.textContent=0,gameEls.player2Score.textContent=0,gameEls.player1CurrentScore.textContent=0,gameEls.player2CurrentScore.textContent=0,gameInfo.currentPlayerScore=0,gameInfo.playersScore=[0,0],gameInfo.winner=!1,gameEls.dice.classList.add("_hidden"),gameEls.player1.classList.remove("_winner"),gameEls.player2.classList.remove("_winner"),gameEls.btnRollDice.removeAttribute("disabled"),gameEls.btnHoldDice.removeAttribute("disabled"),1===gameInfo.activePlayer&&this.switchPlayer()},openModalWithText:function(e){const n=gameEls.messagesModal,t=gameEls.messagesModalCloseBtn;documentElementFinder(".messages-modal .modal__text").textContent=e,n.classList.add("_active"),t.addEventListener("click",(function(){n.classList.remove("_active")}));setTimeout((()=>{window.addEventListener("click",(e=>{e.target===n&&n.classList.remove("_active")}))}),1300)},changingFinalScoreInput:function(e){e.value=e.value.replace(/\D/g,"")},userChangedFinalScore:function(){const e=+gameEls.inputEndingOn.value;0===e?this.openModalWithText("Enter a number!"):(+gameEls.player1Score.textContent||+gameEls.player2Score.textContent||+gameEls.player1CurrentScore.textContent||+gameEls.player2CurrentScore.textContent)>=e?this.openModalWithText("The value is less than the current score"):e<gameInfo.minFinalScore?this.openModalWithText("The number is too less"):(gameInfo.finalScore=e,gameEls.endingOnNowNumberEl.textContent=e)},randomNumOfDice:function(){return Math.trunc(6*Math.random())+1},switchPlayer:function(){gameInfo.activePlayer=0===gameInfo.activePlayer?1:0,gameEls.player1.classList.toggle("_active-player"),gameEls.player2.classList.toggle("_active-player")},updateCurrentScore:function(e){gameInfo.currentPlayerScore+=e,0===gameInfo.activePlayer?gameEls.player1CurrentScore.textContent=gameInfo.currentPlayerScore:gameEls.player2CurrentScore.textContent=gameInfo.currentPlayerScore},createDice:function(e){e.classList.remove("_hidden");const n=this.randomNumOfDice(),t=document.createElement("div");t.classList.add(`dice-num-${n}`,"dice-circles-wrap"),e.appendChild(t),gameEls.btnRollDice.addEventListener("click",(function(){t.remove()}));for(let e=0;e<n;e++){const n=e+1,a=document.createElement("div");a.classList.add(`dice-circle-${n}`,"dice-circle"),t.appendChild(a)}let a;1===n?(gameInfo.currentPlayerScore=0,0===gameInfo.activePlayer?gameEls.player1CurrentScore.textContent=gameInfo.currentPlayerScore:gameEls.player2CurrentScore.textContent=gameInfo.currentPlayerScore,this.switchPlayer()):this.updateCurrentScore(n),a=0===gameInfo.activePlayer?gameInfo.playersScore[0]+gameInfo.currentPlayerScore:gameInfo.playersScore[1]+gameInfo.currentPlayerScore,a>=gameInfo.finalScore&&(0===gameInfo.activePlayer&&(gameEls.player1Score.textContent=a,gameEls.player1.classList.add("_winner"),gameInfo.winner=0,this.playerWonModalOpen()),1===gameInfo.activePlayer&&(gameEls.player2Score.textContent=a,gameEls.player2.classList.add("_winner"),gameInfo.winner=1,this.playerWonModalOpen()),gameEls.btnRollDice.setAttribute("disabled","disabled"),gameEls.btnHoldDice.setAttribute("disabled","disabled"))},holdDice:function(){0===gameInfo.activePlayer?(gameInfo.playersScore[0]+=gameInfo.currentPlayerScore,gameEls.player1Score.textContent=gameInfo.playersScore[0],gameEls.player1CurrentScore.textContent=0):(gameInfo.playersScore[1]+=gameInfo.currentPlayerScore,gameEls.player2Score.textContent=gameInfo.playersScore[1],gameEls.player2CurrentScore.textContent=0),gameInfo.currentPlayerScore=0,gameEls.dice.classList.add("_hidden"),this.switchPlayer()},playerWonModalOpen:function(){this.openModalWithText(0===gameInfo.winner?"Player 1 won!":"Player 2 won!")},rollTheDiceOnClick:function(e){e.addEventListener("click",(()=>this.createDice(gameEls.dice)))},holdTheDiceOnClick:function(e){e.addEventListener("click",(()=>this.holdDice()))},restartGameOnClick:function(e){e.addEventListener("click",(()=>this.initialProperties()))},changeFinalScoreOnClick:function(e){e.addEventListener("click",(()=>this.userChangedFinalScore()))},changingFinalScoreInputOnWrite:function(e){e.addEventListener("input",(()=>this.changingFinalScoreInput(e)))}};gameFunctionality.changeFinalScoreOnClick(gameEls.btnEndingOn),gameFunctionality.changingFinalScoreInputOnWrite(gameEls.inputEndingOn),gameFunctionality.restartGameOnClick(gameEls.btnNewGame),gameFunctionality.rollTheDiceOnClick(gameEls.btnRollDice),gameFunctionality.holdTheDiceOnClick(gameEls.btnHoldDice);
//# sourceMappingURL=app.js.map