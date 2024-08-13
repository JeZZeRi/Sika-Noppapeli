document.addEventListener("DOMContentLoaded", function() {
    let players = [];
    let currentPlayerIndex = 0;
    let currentRoundScore = 0;
    let targetScore = 100;
    let diceCount = 1;
    let gameActive = false;
    let doubleCount = 0;

    var face0 = new Image();
    face0.src = "img/d1.gif";
    var face1 = new Image();
    face1.src = "img/d2.gif";
    var face2 = new Image();
    face2.src = "img/d3.gif";
    var face3 = new Image();
    face3.src = "img/d4.gif";
    var face4 = new Image();
    face4.src = "img/d5.gif";
    var face5 = new Image();
    face5.src = "img/d6.gif";

    document.getElementById('player-count-form').addEventListener('submit', function(event) {
        event.preventDefault();
        askPlayerNames();
    });

    document.getElementById('player-names-form').addEventListener('submit', function(event) {
        event.preventDefault();
        startGame();
    });

    function askPlayerNames() {
        let playerCount = parseInt(document.getElementById('player-count').value);
        targetScore = parseInt(document.getElementById('target-score').value);
        let playerNamesDiv = document.getElementById('player-names');
        playerNamesDiv.innerHTML = '';

        for (let i = 1; i <= playerCount; i++) {
            let formGroup = document.createElement('div');
            formGroup.className = 'form-group';
            let label = document.createElement('label');
            label.setAttribute('for', `player-${i}-name`);
            label.textContent = `Pelaaja ${i} nimi:`;
            let input = document.createElement('input');
            input.type = 'text';
            input.id = `player-${i}-name`;
            input.className = 'form-control';
            input.required = true;
            formGroup.appendChild(label);
            formGroup.appendChild(input);
            playerNamesDiv.appendChild(formGroup);
        }

        document.getElementById('player-count-form').classList.add('d-none');
        document.getElementById('player-names-form').classList.remove('d-none');
    }

    function startGame() {
        let playerCount = parseInt(document.getElementById('player-count').value);
        diceCount = parseInt(document.getElementById('dice-count').value);
        players = [];
        for (let i = 1; i <= playerCount; i++) {
            players.push({
                name: document.getElementById(`player-${i}-name`).value,
                score: 0
            });
        }
        currentPlayerIndex = 0;
        currentRoundScore = 0;
        doubleCount = 0;
        gameActive = true;
        updateUI();

        document.getElementById('settings').classList.add('d-none');
        document.getElementById('game-area').classList.remove('d-none');
        
        document.images["mydice2"].style.display = (diceCount === 2) ? "inline" : "none";
    }

    function updateUI() {
        let playersList = document.getElementById('players');
        playersList.innerHTML = '';
        players.forEach((player, index) => {
            let playerClass = index === currentPlayerIndex ? 'list-group-item-light' : '';
            let playerElement = document.createElement('a');
            playerElement.href = '#';
            playerElement.className = `list-group-item list-group-item-action ${playerClass}`;
            playerElement.textContent = `${player.name}: ${player.score}`;
            playersList.appendChild(playerElement);
        });
        document.getElementById('turn-message').textContent = `Vuorossa: ${players[currentPlayerIndex].name}`;
        document.getElementById('current-round-score').textContent = `Nykyiset pisteet: ${currentRoundScore}`;
    }

    document.getElementById('roll-button').addEventListener('click', function() {
        if (gameActive) {
            rollDice();
        }
    });

    document.getElementById('hold-button').addEventListener('click', function() {
        if (gameActive) {
            holdScore();
        }
    });

    function rollDice() {
        let diceResults = [];
        for (let i = 0; i < diceCount; i++) {
            diceResults.push(Math.floor(Math.random() * 6));
        }
        displayDice(diceResults);

        if (diceCount === 1) {
            if (diceResults[0] === 0) {
                currentRoundScore = 0;
                nextPlayer();
            } else {
                currentRoundScore += diceResults[0] + 1;
            }
        } else {
            let sum = diceResults.reduce((a, b) => a + b + 1, 0);
            let isDouble = diceResults[0] === diceResults[1];
            let hasOne = diceResults.includes(0);

            if (diceResults[0] === 0 && diceResults[1] === 0) {
                currentRoundScore += 25;
            } else if (hasOne) {
                currentRoundScore = 0;
                nextPlayer();
            } else if (isDouble) {
                doubleCount++;
                if (doubleCount === 3) {
                    currentRoundScore = 0;
                    nextPlayer();
                } else {
                    currentRoundScore += sum * 2;
                }
            } else {
                currentRoundScore += sum;
                doubleCount = 0;
            }
        }
        updateUI();
    }

    function displayDice(diceResults) {
        document.images["mydice1"].src = eval("face" + diceResults[0] + ".src");
        if (diceCount === 2) {
            document.images["mydice2"].src = eval("face" + diceResults[1] + ".src");
        }
    }

    function holdScore() {
        players[currentPlayerIndex].score += currentRoundScore;
        if (players[currentPlayerIndex].score >= targetScore) {
            alert(`${players[currentPlayerIndex].name} voitti pelin!`);
            gameActive = false;
        } else {
            nextPlayer();
        }
        updateUI();
    }

    function nextPlayer() {
        currentRoundScore = 0;
        doubleCount = 0;
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        updateUI();
    }
});