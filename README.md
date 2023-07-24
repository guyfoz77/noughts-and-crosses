# noughts-and-crosses
An unbeatable game of tic-tac-toe (or naughts and crosses, whatever you want to call it.)

**Live preview: https://guyfoz77.github.io/noughts-and-crosses/**

This project makes use of the minimax algorithm to select the AI moves and make it unbeatable. Read about the algorith here:
https://en.wikipedia.org/wiki/Minimax

There are three main modules in this web app:
- The game controller
    - Controls the flow of the game, attaches functions to each of the 9 squares, and checks each board position for a winning position.
    - This also checks to see if the square clicked on is occupied or not.
- The display controller
    - Simply updates the display after each move.
- The AI
    - The big one! This will cycle through each empty board position and determine, using the minimax algorithm, which is the optimal move to play. This is what makes the game unbeatable.