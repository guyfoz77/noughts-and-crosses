const player = (counter) => {
    return {counter};
}

const gameController = (function(){
    let board = ['', '', '', '', '', '', '', '', ''];
    let gameOver = false;
    const display = document.querySelector('.display');
    const players = [player('X'), player('O')];

    const init = () => {  //this function basically initialises everything.
        const segments = document.querySelectorAll('.segment');
        const resetButton = document.querySelector('button');
        resetButton.addEventListener('click', () => location.reload());
        segments.forEach(segment => {
            segment.addEventListener('click', (e) => {
                let spaceOccupied = false;
                if (board[e.target.dataset.key] != '') spaceOccupied = true;
                if (spaceOccupied == false && !gameOver){
                    playRound(e.target.dataset.key, players[0].counter);
                    if (!gameOver) playRound(AI.moveSelector(board), players[1].counter);
                }
            })
        })
     }

     const playRound = (position, counter) => {
        board[position] = counter;
        console.log(victoryChecker(board));
        let winner = victoryChecker(board);
        if (winner != null) {
            gameOver = true;
            if (winner == 'X') display.textContent = 'X victory!';
            if (winner == 'O') display.textContent = 'O victory!';
            if (winner == 'draw') display.textContent = 'Draw!';

        }
        displayController.divWriter(board);
     }

     const victoryChecker = (board) => {
        let winner = null;
        let freePositions = 0;
        // check for draw
        for (let i = 0; i < 9; i++) {
            if (board[i] == '') {
                freePositions++;
            }
        }
        if (freePositions == 0) winner = 'draw';
        const checkIfEqual = (x, y, z) => {return (board[x] == board[y] && board[y] == board[z] && board[x] != '')};
        for (let i = 0; i < 9; i += 3) { //check horizontals
            if (checkIfEqual(i, i+1, i+2)) winner = board[i];
        }
        for (let i = 0; i < 3; i++) { //check verticals
            if (checkIfEqual(i, i+3, i+6)) winner = board[i];
        }
        if (checkIfEqual(0, 4, 8) || checkIfEqual(2, 4, 6)) winner = board[4]; //checking diagonals

        return winner;
     };

     return {init, victoryChecker, board};
})();

let displayController = (function() {
    const segments = document.querySelectorAll('.segment');
    const divWriter = (board) => {
        let i = 0;
        segments.forEach(segment => {
            segment.textContent = board[i];
            i++; 
        });
    }
    return{divWriter};
})();

const AI = (function() {

    const moveSelector = (board) => {
        let highestScore = -100;
        let move;
        let tempBoard = board;
        for (let i = 0; i < 9; i++) {
            if (tempBoard[i] == '') {   //check for occupied space
                tempBoard[i] = 'O';
                let score = miniMax(tempBoard, 0, false);
                if (score > highestScore) { //works out which move produces the highest score.
                    highestScore = score;
                    move = i;
                }
                tempBoard[i] = '';
            }
        }
        console.log(move);
        return move;
    }

    const miniMax = (board, depth, isMaximising) => {
        let tempBoard = board;
        if (gameController.victoryChecker(board) == 'O') return 10; //assign +10 score to winning move, 0 to draw move, -10 to losing move.
        if (gameController.victoryChecker(board) == 'draw') return 0;
        if (gameController.victoryChecker(board) == 'X') return -10;
        
        if (isMaximising) {
            let bestScore = -100;
            for (let i = 0; i < 9; i++) {
                if (tempBoard[i] == '') {
                    tempBoard[i] = 'O';
                    let score = miniMax(tempBoard, depth + 1, false);
                    tempBoard[i] = '';
                    bestScore = Math.max(score, bestScore);
                } 
            }
            return bestScore;
        }
        if (!isMaximising) {
            let bestScore = 100;
            for (let i = 0; i < 9; i++) {
                if (tempBoard[i] == '') {
                    tempBoard[i] = 'X';
                    let score = miniMax(tempBoard, depth + 1, true);
                    tempBoard[i] = ''
                    bestScore = Math.min(bestScore, score);
                    // console.log(depth);
                } 
            }
            return bestScore;
        }
    }
return{moveSelector};
})()

gameController.init();