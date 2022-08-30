const ipc = require('electron').ipcRenderer;

const startPosX = 5;
const startPosY = 0;

var gameSessionPoint = 0;

const gameDiv = document.getElementById('gameDiv');
const scoreDiv = document.getElementById('scoreDiv');

scoreDiv.textContent = gameSessionPoint;

let currBlocks = [];

var colorQueue = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'purple'
];

async function moveBlocks() {
    var result = await moveBlock(true);
    if (result) {
        setTimeout(moveBlocks, 1000);
    }
}

function moveBlock(fromAuto) {
    for (let i = 0; i < currBlocks.length; i++) {
        let xPos = parseInt(currBlocks[i].style.left) / 35;
        let yPos = parseInt(currBlocks[i].style.top) / 35;
        if (checkCoordinate(xPos, yPos + 1)) {
            if (fromAuto) {
                save();
                start();
            }
            checkIfRowIsFull();
            return false;
        }
    }

    currBlocks.forEach((blockObject) => {
        let yPos = parseInt(blockObject.style.top) / 35;
        yPos += 1;
        let pos = 35 * yPos;
        blockObject.style.top = pos + 'px';
    });

    return true;
}

const xWidth = 10;
const yWidth = 20;

function save() {
    currBlocks.forEach((blockObject) => {
        let xPos = parseInt(blockObject.style.left) / 35;
        let yPos = parseInt(blockObject.style.top) / 35;
        coordinates[yPos][xPos] = blockObject;
    });
}

function checkCoordinate(x, y) {
    return (x < 0 || x >= 10 ||
            y < 0 || y >= 20) ||
        coordinates[y][x] !== null;
}

var coordinates = [];

for (let i = 0; i < yWidth; i++) {
    coordinates[i] = [];
    for (let j = 0; j < xWidth; j++) {
        coordinates[i][j] = null;
    }
}

document.onkeydown = function (event) {
    switch (event.key) {
        case "ArrowLeft":
            moveInline(-1);
            break;
        case "ArrowRight":
            moveInline(+1);
            break;
        case "ArrowUp":
            rotateBlock();
            break;
        case "ArrowDown":
            moveBlock(false);
            break;
        case "Escape":
            onClickEndGame();
            break;
    }
}

function start() {
    createBlockType();
}

function createBlockType() {
    randomBlock();
}

function createBlock(x, y, color) {
    var block = document.createElement('div');
    block.style.position = 'absolute';
    block.style.backgroundColor = color;
    block.className = 'box';
    let leftPos = x * 35;
    let topPos = y * 35;
    block.style.left = leftPos + 'px';
    block.style.top = topPos + 'px';
    gameDiv.appendChild(block);
    return block;
}

function moveInline(x) {
    for (let i = 0; i < currBlocks.length; i++) {
        let xPos = parseInt(currBlocks[i].style.left) / 35;
        let yPos = parseInt(currBlocks[i].style.top) / 35;

        if (checkCoordinate(xPos + x, yPos)) {
            return;
        }
    }

    currBlocks.forEach((blockObject) => {
        let xPos = parseInt(blockObject.style.left) / 35;
        xPos += x;
        let pos = 35 * xPos;
        blockObject.style.left = pos + 'px';
    });
}

const Tetrominos = {
    LShapedBlock: 0,
    JShapedBlock: 1,
    ZShapedBlock: 2,
    SShapedBlock: 3,
    OShapedBlock: 4,
    TShapedBlock: 5,
    IShapedBlock: 6
};

async function randomBlock() {
    var randomNumber = Math.floor(Math.random() * 7);
    var blockType = enumeration(randomNumber);

    currBlocks = [];

    let color = colorQueue.shift();
    colorQueue.push(color);

    let xValues = [];
    let yValues = [];

    switch (blockType) {
        case 'LShapedBlock':
            xValues = [0, -1, -1, 1];
            yValues = [0, 0, 1, 0];
            break;
        case 'JShapedBlock':
            xValues = [0, -1, 1, 1];
            yValues = [0, 0, 0, 1];
            break;
        case 'ZShapedBlock':
            xValues = [0, -1, 0, 1];
            yValues = [0, 0, 1, 1];
            break;
        case 'SShapedBlock':
            xValues = [0, 0, -1, 1];
            yValues = [0, 1, 1, 0];
            break;
        case 'OShapedBlock':
            xValues = [0, 1, 0, 1];
            yValues = [0, 0, 1, 1];
            break;
        case 'TShapedBlock':
            xValues = [0, -1, 0, 1];
            yValues = [1, 1, 0, 1];
            break;
        case 'IShapedBlock':
            xValues = [0, -1, 1, 2];
            yValues = [0, 0, 0, 0];
            break;
    }

    createBlockWithParameters(xValues, yValues, color);

    const gameOver = await checkIfGameOver(xValues, yValues);

    if (!gameOver) {
        setTimeout(moveBlocks, 1000);
    }
}

function checkIfGameOver(xValues, yValues) {
    for (let i = 0; i < 4; i++) {
        if (checkCoordinate(startPosX + xValues[i], startPosY + yValues[i])) {
            alert("Game Over!");
            onClickEndGame();
            return true;
        }
    }

    return false;
}

function rotateBlock() {
    let xValues = [];
    let yValues = [];
    let originX = parseInt(currBlocks[0].style.left);
    let originY = parseInt(currBlocks[0].style.top);
    for (let i = 1; i < 4; i++) {
        let x = parseInt(currBlocks[i].style.left) - originX;
        let y = parseInt(currBlocks[i].style.top) - originY;
        xValues[i] = (y + originX);
        yValues[i] = (-x + originY);

        if (checkCoordinate(xValues[i] / 35, yValues[i] / 35)) {
            return;
        }
    }

    for (let i = 1; i < 4; i++) {
        currBlocks[i].style.left = xValues[i] + 'px';
        currBlocks[i].style.top = yValues[i] + 'px';
    }
}

function createBlockWithParameters(xValues, yValues, color) {
    for (let i = 0; i < 4; i++) {
        currBlocks[i] = createBlock(startPosX + xValues[i], startPosY + yValues[i], color);
    }
}

start();

function enumeration(num) {
    var type;
    Object.keys(Tetrominos).forEach((blockType) => {
        if (Tetrominos[blockType] === num) {
            type = blockType;
        }
    });
    return type;
}

function checkIfRowIsFull() {
    let pointCount = 0;
    for (let i = 2; i < yWidth; i++) {
        let isFull = true;
        for (let j = 0; j < xWidth; j++) {
            if (coordinates[i][j] === null) {
                isFull = false;
                break;
            }
        }

        if (isFull) {
            pointCount++;
            point(i);
        }
    }

    pointCalculation(pointCount);
}

function pointCalculation(pointCount) {
    switch (pointCount) {
        case 1:
            gameSessionPoint += 40;
            break;
        case 2:
            gameSessionPoint += 100;
            break;
        case 3:
            gameSessionPoint += 300;
            break;
        case 4:
            gameSessionPoint += 1200;
            break;
    }

    scoreDiv.textContent = gameSessionPoint;
}

function point(rowNo) {
    for (let i = 0; i < xWidth; i++) {
        coordinates[rowNo][i].remove();
        coordinates[rowNo][i] = null;
    }

    for (let i = rowNo - 1; i >= 0; i--) {
        for (let j = 0; j < xWidth; j++) {
            if (coordinates[i][j] !== null) {
                let yPos = parseInt(coordinates[i][j].style.top) / 35;
                yPos += 1;
                let pos = 35 * yPos;
                coordinates[i][j].style.top = pos + 'px';

                let hold = coordinates[i][j];
                coordinates[i][j] = null;
                coordinates[i + 1][j] = hold;
            }
        }
    }
}

function onClickEndGame() {
    ipc.send('mainPage');
}