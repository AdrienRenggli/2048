document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const scoreDisplay = document.getElementById('score');
    let score = 0;
    let board = Array(4).fill().map(() => Array(4).fill(0));

    function initBoard() {
        grid.innerHTML = '';
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.id = `cell-${i}-${j}`;
                grid.appendChild(cell);
            }
        }
        addRandomTile();
        addRandomTile();
        updateBoard();
    }

    function addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] === 0) {
                    emptyCells.push({i, j});
                }
            }
        }
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            board[randomCell.i][randomCell.j] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    function updateBoard() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const cell = document.getElementById(`cell-${i}-${j}`);
                const value = board[i][j];
                cell.textContent = value === 0 ? '' : value;
                cell.style.backgroundColor = getCellColor(value);
            }
        }
        scoreDisplay.textContent = score;
    }

    function getCellColor(value) {
        const colors = {
            0: '#cdc1b4',
            2: '#eee4da',
            4: '#ede0c8',
            8: '#f2b179',
            16: '#f59563',
            32: '#f67c5f',
            64: '#f65e3b',
            128: '#edcf72',
            256: '#edcc61',
            512: '#edc850',
            1024: '#edc53f',
            2048: '#edc22e',
        };
        return colors[value] || '#3c3a32';
    }

    function moveLeft() {
        let moved = false;
        for (let i = 0; i < 4; i++) {
            let row = board[i].filter(val => val !== 0);
            let newRow = [];
            for (let j = 0; j < row.length; j++) {
                if (j < row.length - 1 && row[j] === row[j + 1]) {
                    newRow.push(row[j] * 2);
                    score += row[j] * 2;
                    j++;
                } else {
                    newRow.push(row[j]);
                }
            }
            while (newRow.length < 4) {
                newRow.push(0);
            }
            if (JSON.stringify(board[i]) !== JSON.stringify(newRow)) {
                moved = true;
            }
            board[i] = newRow;
        }
        return moved;
    }

    function moveRight() {
        let moved = false;
        for (let i = 0; i < 4; i++) {
            let row = board[i].filter(val => val !== 0);
            let newRow = [];
            for (let j = row.length - 1; j >= 0; j--) {
                if (j > 0 && row[j] === row[j - 1]) {
                    newRow.unshift(row[j] * 2);
                    score += row[j] * 2;
                    j--;
                } else {
                    newRow.unshift(row[j]);
                }
            }
            while (newRow.length < 4) {
                newRow.unshift(0);
            }
            if (JSON.stringify(board[i]) !== JSON.stringify(newRow)) {
                moved = true;
            }
            board[i] = newRow;
        }
        return moved;
    }

    function moveUp() {
        let moved = false;
        for (let j = 0; j < 4; j++) {
            let column = [];
            for (let i = 0; i < 4; i++) {
                if (board[i][j] !== 0) {
                    column.push(board[i][j]);
                }
            }
            let newColumn = [];
            for (let i = 0; i < column.length; i++) {
                if (i < column.length - 1 && column[i] === column[i + 1]) {
                    newColumn.push(column[i] * 2);
                    score += column[i] * 2;
                    i++;
                } else {
                    newColumn.push(column[i]);
                }
            }
            while (newColumn.length < 4) {
                newColumn.push(0);
            }
            for (let i = 0; i < 4; i++) {
                if (board[i][j] !== newColumn[i]) {
                    moved = true;
                }
                board[i][j] = newColumn[i];
            }
        }
        return moved;
    }

    function moveDown() {
        let moved = false;
        for (let j = 0; j < 4; j++) {
            let column = [];
            for (let i = 3; i >= 0; i--) {
                if (board[i][j] !== 0) {
                    column.push(board[i][j]);
                }
            }
            let newColumn = [];
            for (let i = column.length - 1; i >= 0; i--) {
                if (i > 0 && column[i] === column[i - 1]) {
                    newColumn.unshift(column[i] * 2);
                    score += column[i] * 2;
                    i--;
                } else {
                    newColumn.unshift(column[i]);
                }
            }
            while (newColumn.length < 4) {
                newColumn.unshift(0);
            }
            for (let i = 0; i < 4; i++) {
                if (board[i][j] !== newColumn[i]) {
                    moved = true;
                }
                board[i][j] = newColumn[i];
            }
        }
        return moved;
    }


    function handleKeyPress(e) {
        let moved = false;
        switch (e.key) {
            case 'ArrowLeft':
                moved = moveLeft();
                break;
            case 'ArrowRight':
                moved = moveRight();
                break;
            case 'ArrowUp':
                moved = moveUp();
                break;
            case 'ArrowDown':
                moved = moveDown();
                break;
        }
        if (moved) {
            addRandomTile();
            updateBoard();
        }
    }

    document.addEventListener('keydown', handleKeyPress);
    
    grid.addEventListener('touchstart', handleTouchStart, false);
    grid.addEventListener('touchmove', handleTouchMove, false);
    grid.addEventListener('touchend', handleTouchEnd, false);
    grid.addEventListener('touchmove', e => e.preventDefault(), { passive: false });
    
    initBoard();

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    function handleTouchStart(e) {
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }

    function handleTouchMove(e) {
        const touch = e.touches[0];
        touchEndX = touch.clientX;
        touchEndY = touch.clientY;
    }

    function handleTouchEnd() {
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;

        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        let moved = false;

        if (Math.max(absDx, absDy) > 30) { // threshold for a swipe
            if (absDx > absDy) {
                // Horizontal swipe
                if (dx > 0) {
                    moved = moveRight();
                } else {
                    moved = moveLeft();
                }
            } else {
                // Vertical swipe
                if (dy > 0) {
                    moved = moveDown();
                } else {
                    moved = moveUp();
                }
            }

            if (moved) {
                addRandomTile();
                updateBoard();
            }
        }

        // Reset for next touch
        touchStartX = touchStartY = touchEndX = touchEndY = 0;
    }
});