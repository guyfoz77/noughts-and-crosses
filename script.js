let displayController = (function() {
    const gameContainer = document.querySelector('.gameContainer');
    const divMaker = (content, i) => {
        let newDiv = document.createElement('div');
        newDiv.textContent = content;
        newDiv.classList.add('segment');
        newDiv.dataset.key = i;
        return newDiv;
    }
    const divAdder = (div) => {
        gameContainer.appendChild(div);
    }
    const divRemover = () => {
        gameContainer.textContent = '';
    }
    const updateDisplay = () => {
        let i = 0;
        divRemover();
        gameController.playPositions.forEach(position => {
            divAdder(divMaker(position, i));
            i++;
        });
        gameController.clickDetector();
    }
    return{updateDisplay};
})();

let gameController = (function() {
    let playPositions = 
     ['x', 'x', 'o',
     'o', 'x', 'o',
     'x', 'o', 'x'];

     const clickDetector = () =>{
        const segments = document.querySelectorAll('.segment');
        segments.forEach(segment => {
            segment.addEventListener('click', (e) => {
                playPositionsUpdater(e.target.dataset.key);
                // return e.target.dataset.key;
            })
        })
     }
     const playPositionsUpdater = (clickPosition) => {
        let counter = 'X';
        playPositions[clickPosition] = counter;
        displayController.updateDisplay();
     }
     return {playPositions, clickDetector};
})();


displayController.updateDisplay();



   