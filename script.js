//pre load the divs in the game board, loop through each player array adding their counters into the board.
//after each turn, check each player against an array of all possible victory positions.
let player = function(counter) {
    positions = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    return {counter, positions};
}

let gameController = (function() {
    let playPositions = 
     ['x', 'x', 'o',
     'o', 'x', 'o',
     'x', 'o', 'x'];
     let playerTurn = 0;
     let players = [player('X'), player('O')];

     const clickDetector = () =>{
        const segments = document.querySelectorAll('.segment');
        segments.forEach(segment => {
            segment.addEventListener('click', (e) => {
                let spaceOccupied = false;
                players.forEach(player => {
                    console.log(player.positions[e.target.dataset.key]);
                    if (player.positions[e.target.dataset.key] == 1) spaceOccupied = true;
                })
                if (spaceOccupied == false) playPositionsUpdater(e.target.dataset.key);
                // return e.target.dataset.key;
            })
        })
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
        displayController.updateDisplay();
     }
     return {playPositions, clickDetector, whosTurn};
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

gameController.clickDetector();



   