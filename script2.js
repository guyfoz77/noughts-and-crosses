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
        displayController.divWriter(board);
     }

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