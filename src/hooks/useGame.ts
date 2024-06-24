import { useState, useEffect } from 'react';

type levelType = 'easy' | 'normal' | 'hard' | 'custom';

const directions = [
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
];

const useGame = () => {
  const [level, setLevel] = useState<levelType>('easy');
  const [customWidth, setCustomWidth] = useState(9);
  const [customHeight, setCustomHeight] = useState(9);
  const [customBomb, setCustomBomb] = useState(10);
  const [isGameClear, setIsGameClear] = useState(false);
  const [time, setTime] = useState(0);

  const boardWidth =
    level === 'easy' ? 9 : level === 'normal' ? 16 : level === 'hard' ? 30 : customWidth;
  const boardHeight =
    level === 'easy' ? 9 : level === 'normal' ? 16 : level === 'hard' ? 16 : customHeight;
  const bomb = level === 'easy' ? 10 : level === 'normal' ? 40 : level === 'hard' ? 99 : customBomb;

  const changeBoard = (width: number, height: number) => {
    const array2D: number[][] = [];
    for (let i = 0; i < height; i++) {
      const array = [];
      for (let l = 0; l < width; l++) {
        array.push(0);
      }
      array2D.push(array);
    }
    return array2D;
  };

  const initialBoard = changeBoard(boardWidth, boardHeight);
  const [userInput, setUserInput] = useState(initialBoard);
  const [bombMap, setBombMap] = useState(initialBoard);

  const isPlaying = userInput.some((row) =>
    row.some((input) => input === 1 || input === 3 || input === 2),
  );
  const isFailure = userInput.some((row, y) =>
    row.some((input, x) => input === 1 && bombMap[y][x] === 1),
  );

  const gameClear = (newUserInput: number[][], newBombMap: number[][]) => {
    if (isFailure || isGameClear) return;
    let count = 0;
    for (let i = 0; i < boardHeight; i++) {
      for (let l = 0; l < boardWidth; l++) {
        if (newUserInput[i][l] === 0 || newUserInput[i][l] === 3) {
          count += 1;
        }
      }
    }
    if (count === bomb) {
      for (let i = 0; i < boardHeight; i++) {
        for (let l = 0; l < boardWidth; l++) {
          if ((newUserInput[i][l] === 0 || newUserInput[i][l] === 2) && newBombMap[i][l] === 1) {
            newUserInput[i][l] = 3;
          }
        }
      }
      setIsGameClear(true);
    }
    setUserInput(newUserInput);
  };

  const rightClick = (
    x: number,
    y: number,
    board: number[][],
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (isGameClear) return;
    event.preventDefault();
    const newUserInput = structuredClone(userInput);
    if (isFailure) return;
    if (newUserInput[y][x] === 3) {
      newUserInput[y][x] = 2;
      board[y][x] = 4;
    } else if (newUserInput[y][x] === 2) {
      newUserInput[y][x] = 0;
      board[y][x] = -1;
    } else if (newUserInput[y][x] === 0) {
      newUserInput[y][x] = 3;
      board[y][x] = 10;
    }
    setUserInput(newUserInput);
  };

  const smileClick = () => {
    setTime(0);
    setBombMap(changeBoard(boardWidth, boardHeight));
    setUserInput(changeBoard(boardWidth, boardHeight));
    setIsGameClear(false);
  };

  useEffect(() => {
    if (isFailure || isGameClear) return;
    let timer = undefined;
    if (!isFailure && isPlaying) {
      timer = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isFailure, isPlaying, isGameClear]);

  const bombCreate = (bombMap: number[][], x: number, y: number, isExist: boolean) => {
    if (isExist) return bombMap;
    if (bomb >= boardWidth * boardHeight) {
      const limitBombMap = Array.from({ length: boardHeight }, () => Array(boardWidth).fill(1));
      return limitBombMap;
    }
    let bombCount = 0;
    const newBombMap = structuredClone(bombMap);
    while (bombCount < bomb) {
      const bombX = Math.floor(Math.random() * boardWidth);
      const bombY = Math.floor(Math.random() * boardHeight);
      if (newBombMap[bombY][bombX] === 1 || (bombX === x && bombY === y)) continue;
      newBombMap[bombY][bombX] = 1;
      bombCount++;
    }
    return newBombMap;
  };

  const onClick = (x: number, y: number) => {
    const isExistBomb = userInput.flat().some((input) => input === 1);
    rightClick(x, y, changeBoard(boardWidth, boardHeight), {
      preventDefault: () => {},
    } as React.MouseEvent<HTMLDivElement, MouseEvent>);
    const newBombMap = structuredClone(bombMap);
    const newUserInput = structuredClone(userInput);
    const newNewBombMap = bombCreate(newBombMap, x, y, isExistBomb);
    setBombMap(newNewBombMap);
    gameClear(newUserInput, newNewBombMap);
    if (isFailure || isGameClear) {
      return;
    }
    let charge = 0;
    for (const dir of directions) {
      if (newNewBombMap[y + dir[0]] !== undefined && newNewBombMap[y + dir[0]][x + dir[1]] === 1) {
        charge++;
      }
    }
    if (newNewBombMap[y][x] === 1) {
      newUserInput[y][x] = 1;
    } else if (charge === 0) {
      endless(x, y, newUserInput, newNewBombMap);
    } else if (charge >= 1) {
      newUserInput[y][x] = 1;
    }
    setUserInput(newUserInput);
  };

  const endless = (x: number, y: number, newUserInput: number[][], newBombMap: number[][]) => {
    if (newBombMap[y][x] === 1 || newUserInput[y][x] === 1) return;
    newUserInput[y][x] = 1;
    let charge = 0;
    directions.forEach(([dy, dx]) => {
      const Y = y + dy;
      const X = x + dx;
      if (Y >= 0 && Y < newUserInput.length && X >= 0 && X < newUserInput[0].length) {
        if (newBombMap[Y][X] === 1) {
          charge++;
        }
      }
    });
    if (charge === 0) {
      directions.forEach(([dy, dx]) => {
        const Y = y + dy;
        const X = x + dx;
        if (Y >= 0 && Y < newUserInput.length && X >= 0 && X < newUserInput[0].length) {
          endless(X, Y, newUserInput, newBombMap);
        }
      });
    }
  };

  const fusion = (x: number, y: number, newUserInput: number[][], newBombMap: number[][]) => {
    if (newUserInput[y][x] === 1 && !isFailure && !isGameClear) {
      newUserInput[y][x] = 0;
      newBombMap[y][x] = 0;
      setUserInput(newUserInput);
      setBombMap(newBombMap);
    }
  };

  return {
    level,
    customWidth,
    customHeight,
    customBomb,
    isGameClear,
    time,
    boardWidth,
    boardHeight,
    bomb,
    userInput,
    bombMap,
    setLevel,
    setCustomWidth,
    setCustomHeight,
    setCustomBomb,
    setIsGameClear,
    setTime,
    setUserInput,
    setBombMap,
    changeBoard,
    smileClick,
    onClick,
    rightClick,
    fusion,
  };
};

export default useGame;
