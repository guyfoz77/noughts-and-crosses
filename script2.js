const player = (counter) => {
    return {counter};
}

const gameController = (function(){
    let board = ['', '', '', '', '', '', '', '', ''];
    let gameOver = false;
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
                    counterPlacer(e.target.dataset.key, players[0].counter);
                     //play move
                }
            })
        })
     }

     const counterPlacer = (position, counter) => {
        board[position] = counter;
        console.log(victoryChecker(board));
        displayController.divWriter(board);
     }

     const victoryChecker = (board) => {
        let winner = null;
        console.log('init');
        const checkIfEqual = (x, y, z) => {return (board[x] == board[y] && board[y] == board[z] && board[x] != '')};
        for (let i = 0; i < 9; i += 3) { //check horizontals
            if (checkIfEqual(i, i+1, i+2)) winner = board[i];
        }
        for (let i = 0; i < 3; i++) { //check verticals
            if (checkIfEqual(i, i+3, i+6)) winner = board[i];
        }
        //checking diagonals
        if (checkIfEqual(0, 4, 8) || checkIfEqual(2, 4, 6)) winner = board[4];
        return winner;
     };

     return {init};
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

gameController.init();