// Import stylesheets
import { Cell } from './cell';
import './style.css';

const appDiv: HTMLElement = document.getElementById('app');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const clearButton = document.getElementById('clear');
const speedSlider = document.getElementById('speedSlider') as HTMLInputElement;
const timingElement = document.getElementById('timing');

const width = 40;
const height = 40;
const cells: Cell[][] = [];

let msPerFrame = 300;
let gameActive = false;

// Setup dom elements with initial values
stopButton.classList.add('hidden');
speedSlider.value = msPerFrame.toString();
timingElement.textContent = msPerFrame.toString();

// Create cells
for (let y = 0; y < height; y++) {
  const row = document.createElement('div');
  const cellsObjRow: Cell[] = [];
  cells.push(cellsObjRow);
  row.setAttribute('class', 'row');
  for (let x = 0; x < width; x++) {
    const cell = document.createElement('button');
    const cellObj = new Cell(cell);
    cellsObjRow.push(cellObj);
    cell.setAttribute('class', 'cell');
    cell.addEventListener('click', () => cellObj.toggleIsActive());
    row.appendChild(cell);
  }
  appDiv.appendChild(row);
}

// Assign cells neighbors
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const cell = cells[y][x];
    const possibilities = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ];

    for (const [px, py] of possibilities) {
      const dx = x + px;
      const dy = y + py;

      if (dx >= 0 && dy >= 0 && dx < width && dy < height) {
        const neighbor = cells[dy][dx];
        cell.addNeighbor(neighbor);
      }
    }
  }
}

// Setup controls
startButton.addEventListener('click', () => {
  gameActive = true;
  startButton.classList.add('hidden');
  clearButton.classList.add('hidden');
  stopButton.classList.remove('hidden');
  cells.flat().forEach((x) => x.element.setAttribute('disabled', 'true'));
});
stopButton.addEventListener('click', () => {
  gameActive = false;
  stopButton.classList.add('hidden');
  clearButton.classList.remove('hidden');
  startButton.classList.remove('hidden');
  cells.flat().forEach((x) => x.element.removeAttribute('disabled'));
});
clearButton.addEventListener('click', () => {
  cells.flat().forEach((x) => x.setIsActive(false));
});
speedSlider.addEventListener('input', (e) => {
  msPerFrame = +(e.target as HTMLInputElement).value;
  timingElement.textContent = msPerFrame.toString();
});

// Start timeout to start the game
const play = () => {
  setTimeout(() => {
    if (gameActive) {
      for (const row of cells) {
        for (const cell of row) {
          cell.computeNextIsActive();
        }
      }
      for (const row of cells) {
        for (const cell of row) {
          cell.goToNextState();
        }
      }
    }

    play();
  }, msPerFrame);
};
play();
