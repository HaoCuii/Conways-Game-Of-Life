import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RefreshCw, SkipForward, Trash2 } from 'lucide-react';

const DEFAULT_WINDOW_HEIGHT = 800;
const DEFAULT_WINDOW_WIDTH = 800;

const ConwayGame = () => {
  const canvasRef = useRef(null);
  const [grid, setGrid] = useState(createDefaultGrid(20));
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [fadeEffect, setFadeEffect] = useState(false);
  
  const blockSize = 20;
  const ROWS = Math.floor(DEFAULT_WINDOW_HEIGHT / blockSize);
  const COLS = Math.floor(DEFAULT_WINDOW_WIDTH / blockSize);

  // Previous functions remain the same
  function createGrid(blockSize) {
    const rows = Math.floor(DEFAULT_WINDOW_HEIGHT / blockSize);
    const cols = Math.floor(DEFAULT_WINDOW_WIDTH / blockSize);
    return Array.from({ length: rows }, () => Array(cols).fill(0));
  }

  function createDefaultGrid(blockSize) {
    const grid = createGrid(blockSize);
    const rows = Math.floor(DEFAULT_WINDOW_HEIGHT / blockSize);
    const m = Math.floor(rows / 2);
    grid[m + 1][m] = 1;
    grid[m + 2][m] = 1;
    grid[m + 2][m + 1] = 1;
    grid[m][m] = 1;
    grid[m + 1][m - 1] = 1;
    return grid;
  }

  function conway(grid) {
    const newGrid = grid.map((row) => [...row]);
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        let neighbors = 0;
        for (let ny = y - 1; ny <= y + 1; ny++) {
          for (let nx = x - 1; nx <= x + 1; nx++) {
            if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS && (ny !== y || nx !== x)) {
              neighbors += grid[ny][nx];
            }
          }
        }
        if (grid[y][x] === 1) {
          newGrid[y][x] = neighbors < 2 || neighbors > 3 ? 0 : 1;
        } else if (neighbors === 3) {
          newGrid[y][x] = 1;
        }
      }
    }
    return newGrid;
  }

  const drawGrid = (grid) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = DEFAULT_WINDOW_WIDTH;
    canvas.height = DEFAULT_WINDOW_HEIGHT;

    // Add a subtle gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#f3f4f6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const cell = grid[y][x];
        if (cell === 1) {
          // Add a glowing effect for live cells
          ctx.fillStyle = '#3b82f6';
          ctx.shadowColor = '#60a5fa';
          ctx.shadowBlur = fadeEffect ? 10 : 5;
          ctx.fillRect(x * blockSize, y * blockSize, blockSize - 1, blockSize - 1);
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x * blockSize, y * blockSize, blockSize - 1, blockSize - 1);
        }
        ctx.strokeStyle = '#e5e7eb';
        ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
      }
    }
  };

  const handleMouseClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / blockSize);
    const y = Math.floor((e.clientY - rect.top) / blockSize);
    const newGrid = [...grid];
    newGrid[y][x] = grid[y][x] === 1 ? 0 : 1;
    setGrid(newGrid);
    setFadeEffect(true);
    setTimeout(() => setFadeEffect(false), 200);
    drawGrid(newGrid);
  };

  // Rest of the game logic remains the same
  const gameLoop = () => {
    const newGrid = conway(grid);
    setGrid(newGrid);
    drawGrid(newGrid);
  };

  useEffect(() => {
    drawGrid(grid);
    const handleSetPattern = (event) => {
      setPattern(event.detail);
    };
    window.addEventListener('setPattern', handleSetPattern);
    return () => {
      window.removeEventListener('setPattern', handleSetPattern);
    };
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        gameLoop();
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isRunning, grid, speed]);

  const setPattern = (pattern) => {
    const newGrid = createGrid(blockSize);
    const midRow = Math.floor(ROWS / 2);
    const midCol = Math.floor(COLS / 2);
    pattern.forEach(([y, x]) => {
      newGrid[midRow + y][midCol + x] = 1;
    });
    setGrid(newGrid);
    drawGrid(newGrid);
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6 bg-white rounded-xl shadow-lg">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={DEFAULT_WINDOW_WIDTH}
          height={DEFAULT_WINDOW_HEIGHT}
          onClick={handleMouseClick}
          className="rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        />
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-lg">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                const newGrid = createGrid(blockSize);
                setGrid(newGrid);
                drawGrid(newGrid);
              }}
              className="p-2 text-gray-600 hover:text-red-500 transition-colors"
              title="Clear"
            >
              <Trash2 size={24} />
            </button>
            <button
              onClick={() => gameLoop()}
              className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
              title="Step"
            >
              <SkipForward size={24} />
            </button>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="p-2 text-gray-600 hover:text-green-500 transition-colors"
              title={isRunning ? 'Pause' : 'Play'}
            >
              {isRunning ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <div className="flex items-center space-x-4 pl-4 border-l border-gray-300">
                <div className="flex flex-col items-start">
                    <label htmlFor="speedSlider" className="text-gray-700 font-medium text-sm">
                    Speed (ms per update)
                    </label>
                    <div className="flex items-center space-x-2">
                    <input
                        id="speedSlider"
                        type="range"
                        min="50"
                        max="500"
                        value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        className="w-32 accent-blue-500"
                    />
                    <span className="text-gray-700 text-sm">{speed} ms</span>
                    </div>
                </div>

                <button
                    onClick={() => setSpeed(100)}
                    className="p-2 text-gray-600 hover:text-yellow-500 transition-colors"
                    title="Reset Speed"
                >
                    <RefreshCw size={20} />
                </button>
                </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConwayGame;