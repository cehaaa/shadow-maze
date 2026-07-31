import {
  Wall,
  KeyMap,
  WallMap,
  Position,
  DirectionMap,
  Maze as MazeType,
} from "./types";
import { Cell } from "./Cell";
import { Utility } from "./Utility";
import {
  ROWS,
  COLUMNS,
  HEARTS,
  KEY_MAP,
  WALL_MAP,
  COUNTDOWN,
  DIRECTION_MAP,
} from "./constants";

export class Maze {
  width: number;
  height: number;
  keyMap: KeyMap;
  wallMap: WallMap;
  countdown: number;
  directionMap: DirectionMap;

  maze: MazeType;
  playerPos: Position;
  destinationPos: Position;
  isMoveable: boolean;
  mazeElement: HTMLDivElement;
  countdownElement: HTMLDivElement;
  heartsElement: HTMLDivElement;
  statusElement: HTMLDivElement;
  overlayElement: HTMLDivElement;
  overlayTitleElement: HTMLSpanElement;
  retryButton: HTMLButtonElement;
  hearts: number;
  countdownInterval: number | undefined;

  constructor() {
    this.height = ROWS;
    this.width = COLUMNS;
    this.keyMap = KEY_MAP;
    this.wallMap = WALL_MAP;
    this.countdown = COUNTDOWN;
    this.directionMap = DIRECTION_MAP;

    this.maze = [];
    this.playerPos = { x: 0, y: 0 };
    this.destinationPos = { x: 0, y: 0 };
    this.isMoveable = false;
    this.mazeElement = document.querySelector<HTMLDivElement>(".maze")!;
    this.countdownElement =
      document.querySelector<HTMLDivElement>(".countdown")!;
    this.heartsElement = document.querySelector<HTMLDivElement>(".hearts")!;
    this.statusElement = document.querySelector<HTMLDivElement>(".status")!;
    this.overlayElement = document.querySelector<HTMLDivElement>(".overlay")!;
    this.overlayTitleElement =
      document.querySelector<HTMLSpanElement>(".overlay-title")!;
    this.retryButton = document.querySelector<HTMLButtonElement>(".retry-btn")!;
    this.hearts = HEARTS;

    window.addEventListener("keydown", this.movePlayer.bind(this));
    this.retryButton.addEventListener("click", () => this.init());
  }
  createMaze() {
    const maze: MazeType = Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => new Cell()),
    );
    this.generateMaze(0, 0, maze);
    return maze;
  }
  generateMaze(x: number, y: number, maze: MazeType) {
    maze[y][x].visited = true;

    const directions: Wall[] = ["up", "bottom", "left", "right"];
    Utility.shuffle(directions);

    for (const direction of directions) {
      const { dx, dy } = this.directionMap[direction];
      let nx = x + dx;
      let ny = y + dy;

      if (this.isValidMazeGenerationCondition(nx, ny, maze)) {
        this.removeWallBetweenCells(direction, maze[y][x], maze[ny][nx]);
        this.generateMaze(nx, ny, maze);
      }
    }
  }
  isValidMazeGenerationCondition(nx: number, ny: number, maze: MazeType) {
    const isInsideGridAndNotVisited =
      nx >= 0 &&
      nx < this.width &&
      ny >= 0 &&
      ny < this.height &&
      !maze[ny][nx].visited;
    return isInsideGridAndNotVisited;
  }
  removeWallBetweenCells(direction: Wall, current: Cell, neighbor: Cell) {
    const [currentWall, neighborWall] = this.wallMap[direction];
    current.walls[currentWall] = false;
    neighbor.walls[neighborWall] = false;
  }
  initializeRandomPlayerAndDestination() {
    let player = Utility.getRandomCoordinate(this.width, this.height);
    let destination = Utility.getRandomCoordinate(this.width, this.height);

    while (player.x === destination.x && player.y === destination.y) {
      destination = Utility.getRandomCoordinate(this.width, this.height);
    }

    this.maze[player.y][player.x].player = true;
    this.maze[destination.y][destination.x].destination = true;

    this.playerPos = player;
    this.destinationPos = destination;
  }
  checkIsWinTheGame() {
    return (
      this.playerPos.x === this.destinationPos.x &&
      this.playerPos.y === this.destinationPos.y
    );
  }
  checkIsGameOver() {
    this.hearts -= 1;
    this.updateHeartsDisplay();
    return this.hearts === 0;
  }
  gameOver(won: boolean) {
    this.isMoveable = false;
    this.mazeElement.classList.remove("hide");
    this.setStatus(won ? "YOU WON!" : "GAME OVER", won ? "win" : "lose");
    this.showOverlay(won);
  }
  showOverlay(won: boolean) {
    this.overlayTitleElement.textContent = won ? "YOU WON!" : "GAME OVER";
    this.overlayElement.classList.toggle("win", won);
    this.overlayElement.classList.toggle("lose", !won);
    this.overlayElement.classList.add("show");
  }
  checkGameState() {
    if (this.checkIsWinTheGame()) this.gameOver(true);
  }
  movePlayer(event: KeyboardEvent) {
    if (!this.isMoveable) return;
    const { key } = event;

    const { x, y } = this.playerPos;
    const move = this.keyMap[key];
    if (!move) return;

    const newX = x + move.dx;
    const newY = y + move.dy;

    if (this.isValidPlayerMove(x, y, newX, newY, move.wall)) {
      this.maze[y][x].player = false;
      this.playerPos = { x: newX, y: newY };
      this.updatePlayerPosition();
      this.drawMaze();
    } else {
      if (this.maze[y][x].impactedWalls[move.wall]) return;
      this.handleCollision(x, y, newX, newY, move.wall);
      this.addShakingEffect();
      this.drawMaze();
      if (this.checkIsGameOver()) this.gameOver(false);
      return;
    }

    this.checkGameState();
  }
  isValidPlayerMove(
    x: number,
    y: number,
    newX: number,
    newY: number,
    wall: Wall,
  ) {
    const isWall = this.maze[y][x].walls[wall];
    return this.isNotOutOfBounds(newX, newY) && !isWall;
  }
  isNotOutOfBounds(x: number, y: number) {
    return y >= 0 && y < this.height && x >= 0 && x < this.width;
  }
  updatePlayerPosition() {
    const { x, y } = this.playerPos;
    this.maze[y][x].player = true;
  }
  handleCollision(
    x: number,
    y: number,
    newX: number,
    newY: number,
    wall: Wall,
  ) {
    const impactedWall = this.wallMap[wall][1];
    this.maze[y][x].impactedWalls[wall] = true;
    if (this.isNotOutOfBounds(newX, newY))
      this.maze[newY][newX].impactedWalls[impactedWall] = true;
  }
  drawMaze() {
    document.querySelector(".maze")!.innerHTML = "";
    for (const row of this.maze) {
      for (const col of row) {
        col.drawCell();
      }
    }
  }
  addShakingEffect() {
    this.mazeElement.classList.add("shake");
    this.mazeElement.addEventListener("animationend", () => {
      this.mazeElement.classList.remove("shake");
    });
  }
  resetState() {
    this.maze = [];
    this.playerPos = { x: 0, y: 0 };
    this.destinationPos = { x: 0, y: 0 };
    this.hearts = HEARTS;
    this.isMoveable = false;
    this.mazeElement.classList.remove("hide");
    clearInterval(this.countdownInterval);
    this.updateHeartsDisplay();
    this.setStatus("MEMORIZE ROUTE");
    this.overlayElement.classList.remove("show", "win", "lose");
  }
  setStatus(text: string, tone?: "win" | "lose") {
    this.statusElement.textContent = text;
    this.statusElement.classList.remove("win", "lose");
    if (tone) this.statusElement.classList.add(tone);
  }
  updateHeartsDisplay() {
    this.heartsElement.innerHTML = "";
    for (let i = 0; i < HEARTS; i++) {
      const heart = document.createElement("span");
      heart.classList.add("heart");
      if (i >= this.hearts) heart.classList.add("lost");
      this.heartsElement.appendChild(heart);
    }
  }
  updateCountdownDisplay(remaining: number) {
    this.countdownElement.textContent = Math.ceil(remaining / 1000).toString();
    const ratio = remaining / this.countdown;
    this.countdownElement.classList.toggle("critical", ratio <= 0.3);
    this.countdownElement.classList.toggle(
      "warning",
      ratio > 0.3 && ratio <= 0.6,
    );
  }
  startCountdown() {
    let remaining = this.countdown;
    this.updateCountdownDisplay(remaining);

    this.countdownInterval = window.setInterval(() => {
      remaining -= 1000;

      if (remaining <= 0) {
        clearInterval(this.countdownInterval);
        this.countdownElement.textContent = "";
        this.countdownElement.classList.remove("warning", "critical");
        this.mazeElement.classList.add("hide");
        this.isMoveable = true;
        this.setStatus("NAVIGATE BLIND");
        this.initializeRandomPlayerAndDestination();
        this.drawMaze();
        return;
      }

      this.updateCountdownDisplay(remaining);
    }, 1000);
  }
  init() {
    this.resetState();

    this.maze = this.createMaze();
    this.drawMaze();

    this.startCountdown();
  }
}
