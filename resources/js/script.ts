class Player {
    name: HTMLInputElement;
    symbol: string;

    constructor(name: HTMLInputElement, symbol: string) {
        this.name = name;
        this.symbol = symbol;
    }
}

class Game {
    players: Player[] = [];
    playerIndex: number;
    board: Player[][];
    boardSize: number;

    constructor(boardSize: number) {
        this.boardSize = boardSize;
        this.players.push(new Player(document.getElementById("player-one-name")as HTMLInputElement, "X"));
        this.players.push(new Player(document.getElementById("player-two-name")as HTMLInputElement, "O"));

        this.init();
    }

    init() {
        const board = document.getElementById("board");

        if(board != null) {
            board.parentElement.removeChild(board);
        }

        this.generateTable();
        this.board = [];          

        for (let i = 0; i < this.boardSize; i++) {
            this.board.push([]);
        }

        this.playerIndex = Math.floor(Math.random() * 2);
        this.changePlayer();
    }

    currentPlayer(): Player {
        return this.players[this.playerIndex];
    }

    changePlayer() {
        this.currentPlayer().name.id = "waiting-player";

        if(++this.playerIndex >= this.players.length) {
            this.playerIndex = 0;
        }

        this.currentPlayer().name.id = "current-player";
    }

    changeBoardSize(boardSize: number) {
        this.boardSize = Math.min(Math.max(boardSize, 3), 6);
    }

    play(row: number, col: number, textDiv: HTMLElement) {
        if(this.board[row][col] != undefined) {
            return;
        }

        this.board[row][col] = this.currentPlayer();
        textDiv.innerHTML = this.currentPlayer().symbol;

        if(this.checkWin(this.currentPlayer())) {
            return this.win(this.currentPlayer());
        } else if(this.checkTie()) {
            return this.tie();
        } else {
            this.changePlayer();
        }

        
    }

    checkTie(): boolean {
        for(let row = 0; row < this.boardSize; row++) {
            for(let col = 0; col < this.boardSize; col++) {
                if(!(this.board[row][col] instanceof Player)) {
                    return false;
                }
            }
        }

        return true;
    }

    checkWin(player: Player): boolean {
        let wonDiagDown: boolean = true
        let wonDiagUp: boolean = true
        
        for(let row = 0; row < this.boardSize; row++) {
            let wonRow: boolean = true;
            let wonCol: boolean = true;
            

            for(let col = 0; col < this.boardSize; col++) {
                if(wonRow) {
                    wonRow = this.board[row][col] == player;
                }

                if(wonCol) {
                    wonCol = this.board[col][row] == player;
                }
            }
            
            if(wonDiagDown) {
                wonDiagDown = this.board[row][row] == player;
            }

            if(wonDiagUp) {
                wonDiagUp = this.board[this.boardSize - row - 1][row] == player;
            }
        
            if(wonRow || wonCol) {
                return true;
            }
        }

        if(wonDiagDown || wonDiagUp) {
            return true;
        }
        
        return false;
    }

    tie() {
        window.alert("Tie Game");
        this.init();
    }

    win(player: Player) {
        window.alert(player.name.value + " Won");
        this.init();
    }

    generateTable() {
        const table = document.createElement("table");
        table.id = "board";

        for(let row = 0; row < this.boardSize; row++) {
            const tableRow = document.createElement("tr");

            for(let col = 0; col < this.boardSize; col++) {
                const tableData = document.createElement("td");
                tableData.dataset.row = row.toString();
                tableData.dataset.col = col.toString();
                
                const textDiv = document.createElement("div");
                tableData.appendChild(textDiv);

                tableData.addEventListener("click", function() {
                    game.play(+row, +col, textDiv);
                })

                tableRow.appendChild(tableData);
            }

            table.appendChild(tableRow);
        }

        document.getElementById("table-container").appendChild(table);
    }
}

const boardSizeSelector = document.getElementById("board-size") as HTMLInputElement;
const game = new Game(Math.min(Math.max(+boardSizeSelector.value, 3), 6));

boardSizeSelector.addEventListener("change", function() {
    game.changeBoardSize(+boardSizeSelector.value);
    game.init();
})