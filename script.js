let player = function(counter) {
    positions = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    return {counter, positions};
}

let gameController = (function() {
    let turnNumber = 1;
    let playerTurn = 0;
    let players = [player('X'), player('O')];
    let winningPositions = [
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

    const clickDetector = () =>{
       const segments = document.querySelectorAll('.segment');
       segments.forEach(segment => {
           segment.addEventListener('click', (e) => {
               let spaceOccupied = false;
               players.forEach(player => {
                   console.log(player.positions[e.target.dataset.key]);
                   if (player.positions[e.target.dataset.key] == 1) spaceOccupied = true;
               })
               if (spaceOccupied == false){
                    playPositionsUpdater(e.target.dataset.key);
                    victoryChecker(); //currently this fires when victory happens but only on the turn after victory occurs...
                    turnNumber++;
               }
               // return e.target.dataset.key;
           })
       })
    }
    const victoryChecker = () => (
        winningPositions.forEach(positionMap => {
            let matches = 0;
            for (let i = 0; i < positionMap.length; i++) {
                if (positionMap[i] == 0) continue;
                if (positionMap[i] == players[playerTurn].positions[i]) matches++;
                if (matches == 3) {
                    console.log(`${players[playerTurn].counter} victory!`);
                }
            }
        })
    )
    const whosTurn = () => {
       // console.log(playerTurn);
       let playerWhosTurn = players[playerTurn];
       (playerTurn >= players.length-1) ? playerTurn = 0 : playerTurn++;
       // console.log(playerTurn);
       return playerWhosTurn;
    }
    const playPositionsUpdater = (clickPosition) => {
       players[playerTurn].positions[clickPosition] = 1;
       victoryChecker();
       displayController.updateDisplay();
    }
    return {clickDetector, whosTurn};
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



   