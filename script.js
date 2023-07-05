let player = function(counter) {
    positions = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    return {counter, positions};
}

// Stop player from being able to make moves when gameover.

let gameController = (function() {
    let turnNumber = 1;
    let playerTurn = 0;
    let gameOver = false;
    let players = [player('X'), player('O')];
    const display = document.querySelector('.display');
    const winningPositions = [
        [1, 1, 1,
         0, 0, 0,
         0, 0, 0],
        [0, 0, 0,
         1, 1, 1,
         0, 0, 0],
        [0, 0, 0,
         0, 0, 0,
         1, 1, 1],
        [1, 0, 0,
         1, 0, 0,
         1, 0, 0],
        [0, 1, 0,
         0, 1, 0,
         0, 1, 0],
        [0, 0, 1,
         0, 0, 1,
         0, 0, 1],
        [1, 0, 0,
         0, 1, 0,
         0, 0, 1],
        [0, 0, 1,
         0, 1, 0,
         1, 0, 0]
    ]

    const clickDetector = () => {  //this function basically initialises everything.
       const segments = document.querySelectorAll('.segment');
       const resetButton = document.querySelector('button');
       resetButton.addEventListener('click', () => location.reload());
       segments.forEach(segment => {
           segment.addEventListener('click', (e) => {
               let spaceOccupied = false;
               players.forEach(player => {
                   console.log(player.positions[e.target.dataset.key]);
                   if (player.positions[e.target.dataset.key] == 1) spaceOccupied = true;
               })
               if (spaceOccupied == false && !gameOver){
                    moveMaker(e.target.dataset.key);
                    if (!gameOver) setTimeout(AI, 300); //AI is the function which makes the computers move.
               }
           })
       })
    }
    const moveMaker = (boardPosition) => {
        playPositionsUpdater(boardPosition);
        turnNumber++;
    }
    const AI = () => { 
        let move
        if (turnNumber == 10) return;
        while(playerTurn == 1){
            let play = true;
            move = Math.floor((Math.random() * 9));
            players.forEach(player => {
                if (player.positions[move] == 1) play = false;
            })
            if (play == true) moveMaker(move);
        }
    }
    const victoryChecker = () => {
        let gamestate = '';
        winningPositions.forEach(positionMap => {
            let matches = 0;
            for (let i = 0; i < positionMap.length; i++) {
                if (positionMap[i] == 0) continue;
                if (positionMap[i] == players[playerTurn].positions[i]) matches++;
                if (matches == 3) {
                    gamestate = 'win';
                    return gamestate;
                }
                if (turnNumber == 9 && !gameOver) {
                    gamestate = 'draw'
                }
            }
        })
        return gamestate;
    }
    const victoryTextUpdater = () => {
        console.log(victoryChecker());
        if (victoryChecker() == 'win') {
            gameOver = true;
            display.textContent = `${players[playerTurn].counter} victory!`;
        } else if (victoryChecker() == 'draw') {
            gameOver = true;
            display.textContent = `It's a draw.`
        }
    }
    const whosTurn = () => {
       // console.log(playerTurn);
       let playerWhosTurn = players[playerTurn];
       (playerTurn >= players.length-1) ? playerTurn = 0 : playerTurn++;
       // console.log(playerTurn);
       return playerWhosTurn;
    }
    const playPositionsUpdater = (clickPosition) => {
       players[playerTurn].positions[clickPosition] = 1;
       victoryTextUpdater();
       displayController.updateDisplay();
    }
    return {clickDetector, whosTurn, playerTurn, players};
})();

let displayController = (function() {
    const segments = document.querySelectorAll('.segment');
    const divWriter = (player) => {
        i = 0;
        segments.forEach(segment => {
            if (player.positions[i] == 1) {
                segment.textContent = player.counter;
            }
            i++;
        })
    }
    const updateDisplay = () => {
        divWriter(gameController.whosTurn());
    }
    return{updateDisplay};
})();

let aiController = (function() {
    let board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    let freePositions = 0;
    let tempTurn = gameController.playerTurn;

    const tempTurnChanger = () => {
        (tempTurn >= gameController.players.length-1) ? tempTurn = 0 : tempTurn++;
    }

    const getCurrentBoardState = () => {
        for (let i = 0; i < gameController.players.length; i++){
            for (let j = 0; j < board.length; j++){
                if (gameController.players[i].positions[j] == 1) board[j] = gameController.players[i].counter;
            }
        }
        board.forEach(position => {
            if (typeof position == 'number') freePositions++;
        })
    }
    const getPossibleNextPlays = () => {
        let possibleNextPlays = []; //a list of future positions that can be played.
        let possibleNextPositions = []; //an array of future board positions (array of array).
        board.forEach(position => {
            if (typeof position == 'number') possibleNextPlays.push(position);
        })
        possibleNextPlays.forEach(play => {
            let possibleNextPosition = [];
            for (let i = 0; i < board.length; i++) {
                if (board[i] == gameController.players[tempTurn].counter) {
                    possibleNextPosition[i] = 1;
                } else possibleNextPosition[i] = 0;
            }
            possibleNextPosition[play] = 1; 
            possibleNextPositions.push(possibleNextPosition);
        });
        return {possibleNextPlays, possibleNextPositions};
    }

    return{board, getCurrentBoardState, getPossibleNextPlays};
})();

gameController.clickDetector();



   