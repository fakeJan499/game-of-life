export class Cell {
  private isActive = false;
  private nextIsActive = false;
  private neighbors: Cell[] = [];

  constructor(public readonly element: HTMLElement) {}

  computeNextIsActive() {
    const count = this.neighbors.reduce(
      (acc, curr) => (acc += curr.getIsActive() ? 1 : 0),
      0
    );

    if (this.isActive && (count === 2 || count === 3)) {
      this.nextIsActive = true;
      return true;
    }

    if (!this.isActive && count === 3) {
      this.nextIsActive = true;
      return true;
    }

    this.nextIsActive = false;
    return false;
  }

  goToNextState() {
    this.setIsActive(this.nextIsActive);
  }

  toggleIsActive() {
    this.setIsActive(!this.isActive);
  }

  setIsActive(isActive: boolean) {
    this.isActive = isActive;

    if (isActive) {
      this.element.classList.add('cell--active');
    } else {
      this.element.classList.remove('cell--active');
    }
  }

  getIsActive() {
    return this.isActive;
  }

  addNeighbor(neighbor: Cell) {
    this.neighbors.push(neighbor);
  }

  getM() {
    return this.neighbors;
  }
}
