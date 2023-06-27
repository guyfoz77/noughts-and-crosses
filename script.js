let gameController = (function() {
    let playPositions = 
    ['x', 'x', 'o',
     'o', 'x', 'o',
     'x', 'o', 'o'];

     return {playPositions};
})();

let displayController = (function() {
    const gameContainer = document.querySelector('.gameContainer');
    const divMaker = (content) => {
        let newDiv = document.createElement('div');
        newDiv.textContent = content;
        newDiv.classList.add('segment');
        return newDiv;
    }
    const divAdder = (div) => {
        gameContainer.appendChild(div);
    }
    const updateDisplay = () => {
        gameController.playPositions.forEach(position => {
            divAdder(divMaker(position));
        });
    }
    return{updateDisplay};
})();

displayController.updateDisplay();


   