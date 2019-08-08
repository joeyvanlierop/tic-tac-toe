"use strict";
var Player = /** @class */ (function () {
    function Player(name, symbol) {
        this.name = name;
        this.symbol = symbol;
    }
    return Player;
}());
var Game = /** @class */ (function () {
    function Game(boardSize) {
        this.players = [];
        this.boardSize = boardSize;
        this.players.push(new Player(document.getElementById("player-one-name"), "X"));
        this.players.push(new Player(document.getElementById("player-two-name"), "O"));
        this.init();
    }
    Game.prototype.init = function () {
        var board = document.getElementById("board");
        if (board != null) {
            board.parentElement.removeChild(board);
        }
        this.generateTable();
        this.board = [];
        for (var i = 0; i < this.boardSize; i++) {
            this.board.push([]);
        }
        this.playerIndex = Math.floor(Math.random() * 2);
        this.changePlayer();
    };
    Game.prototype.currentPlayer = function () {
        return this.players[this.playerIndex];
    };
    Game.prototype.changePlayer = function () {
        this.currentPlayer().name.id = "waiting-player";
        if (++this.playerIndex >= this.players.length) {
            this.playerIndex = 0;
        }
        this.currentPlayer().name.id = "current-player";
    };
    Game.prototype.changeBoardSize = function (boardSize) {
        this.boardSize = Math.min(Math.max(boardSize, 3), 6);
    };
    Game.prototype.play = function (row, col, textDiv) {
        if (this.board[row][col] != undefined) {
            return;
        }
        this.board[row][col] = this.currentPlayer();
        textDiv.innerHTML = this.currentPlayer().symbol;
        if (this.checkWin(this.currentPlayer())) {
            return this.win(this.currentPlayer());
        }
        else if (this.checkTie()) {
            return this.tie();
        }
        else {
            this.changePlayer();
        }
    };
    Game.prototype.checkTie = function () {
        for (var row = 0; row < this.boardSize; row++) {
            for (var col = 0; col < this.boardSize; col++) {
                if (!(this.board[row][col] instanceof Player)) {
                    return false;
                }
            }
        }
        return true;
    };
    Game.prototype.checkWin = function (player) {
        var wonDiagDown = true;
        var wonDiagUp = true;
        for (var row = 0; row < this.boardSize; row++) {
            var wonRow = true;
            var wonCol = true;
            for (var col = 0; col < this.boardSize; col++) {
                if (wonRow) {
                    wonRow = this.board[row][col] == player;
                }
                if (wonCol) {
                    wonCol = this.board[col][row] == player;
                }
            }
            if (wonDiagDown) {
                wonDiagDown = this.board[row][row] == player;
            }
            if (wonDiagUp) {
                wonDiagUp = this.board[this.boardSize - row - 1][row] == player;
            }
            if (wonRow || wonCol) {
                return true;
            }
        }
        if (wonDiagDown || wonDiagUp) {
            return true;
        }
        return false;
    };
    Game.prototype.tie = function () {
        window.alert("Tie Game");
        this.init();
    };
    Game.prototype.win = function (player) {
        window.alert(player.name.value + " Won");
        this.init();
    };
    Game.prototype.generateTable = function () {
        var table = document.createElement("table");
        table.id = "board";
        var _loop_1 = function (row) {
            var tableRow = document.createElement("tr");
            var _loop_2 = function (col) {
                var tableData = document.createElement("td");
                tableData.dataset.row = row.toString();
                tableData.dataset.col = col.toString();
                var textDiv = document.createElement("div");
                tableData.appendChild(textDiv);
                tableData.addEventListener("click", function () {
                    game.play(+row, +col, textDiv);
                });
                tableRow.appendChild(tableData);
            };
            for (var col = 0; col < this_1.boardSize; col++) {
                _loop_2(col);
            }
            table.appendChild(tableRow);
        };
        var this_1 = this;
        for (var row = 0; row < this.boardSize; row++) {
            _loop_1(row);
        }
        document.getElementById("table-container").appendChild(table);
    };
    return Game;
}());
var boardSizeSelector = document.getElementById("board-size");
var game = new Game(Math.min(Math.max(+boardSizeSelector.value, 3), 6));
boardSizeSelector.addEventListener("change", function () {
    game.changeBoardSize(+boardSizeSelector.value);
    game.init();
});
