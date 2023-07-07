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
            if (play == true) {
                let nextMove = aiController.AI();
                if (typeof nextMove == 'number') move = nextMove;
                moveMaker(move);
                
            }
        }
    }
    const victoryChecker = (positionsToCheck) => { //theres an issue where 'sometimes' if a winning move is played as the last move, it triggers a draw.
        let gamestate = '';
        let gameOver = 'false'; //local variable since global is not updated until after the function is run. This caused a bug where the draw check would always be called on turn 9, regardless of if a winning position was identified.
        winningPositions.forEach(positionMap => {
            let matches = 0;
            for (let i = 0; i < positionMap.length; i++) {
                if (positionMap[i] == 0) continue;
                if (positionMap[i] == positionsToCheck[i]) matches++;
                if (matches == 3) {
                    gamestate = 'win';
                    gameOver = true;
                    break;
                }
                
            }
        })
        if (turnNumber == 9 && !gameOver) { //draw check
            gamestate = 'draw';
        }
        return gamestate;
    }
    const victoryTextUpdater = () => {
        let victoryCheckerOutput = victoryChecker(players[playerTurn].positions);
        if (victoryCheckerOutput == 'win') {
            gameOver = true;
            display.textContent = `${players[playerTurn].counter} victory!`;
        } else if (victoryCheckerOutput == 'draw') {
            gameOver = true;
            display.textContent = `It's a draw.`;
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
    return {clickDetector, whosTurn, playerTurn, players, victoryChecker};
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

//###########################

let aiController = (function() {  
    let board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    let xTempBoard = gameController.players[0].positions;
    let oTempBoard = gameController.players[1].positions;
    let freePositions = 0;
    let tempTurn = 1; //1 = AI turn, 0 = user turn

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
            possibleNextPositions.push({play, possibleNextPosition});
        });
        return {possibleNextPlays, possibleNextPositions};
    }
    
    
    const moveChecker = () => {    //this checks the possibleNextPositions for a winning position.
        let possibleNextPositions = getPossibleNextPlays();
        let moveToPlay;
        // console.log(possibleNextPositions);
        possibleNextPositions.possibleNextPositions.forEach(position => {
            

            if (gameController.victoryChecker(position.possibleNextPosition) == 'win') {
                console.log(`winning move detected ${position.play}`);
                moveToPlay = position.play;
            }
        });

        return moveToPlay;
    }

    const miniMax = (board, maximising) => {
        if(gameController.victoryChecker(board) == 'win' && maximising) {
            return 10;
        }
        if(gameController.victoryChecker(board) == 'win' && !maximising){
            return -10;
        }
        if(gameController.victoryChecker(board) == 'draw') {
            return 0;
        }
        if (maximising) { //maximising score
            let bestScore = -Infinity;
            for (let i = 0; i < 8; i++) {
                if (typeof board[i] == 'number') {
                    board[i] = 'O';
                    oTempBoard[i] = 1;
                    let score = miniMax(board, false);
                    oTempBoard = gameController.players[0].positions;
                    return Math.max(score, bestScore);
                }
            }
        }
        if (!maximising) { //minimising score
            let bestScore = Infinity;
            for (let i = 0; i < 8; i++) {
                if (typeof board[i] == 'number') {
                    board[i] = 'X';
                    xTempBoard[i] = 1;
                    let score = miniMax(board, true);
                    xTempBoard = gameController.players[1].positions;
                    return Math.max(score, bestScore);
                }
            }
        }
    }
    

    const AI = () => {
        getCurrentBoardState();
        return moveChecker();
    }

    return{board, getCurrentBoardState, getPossibleNextPlays, AI};
})();

gameController.clickDetector();



   