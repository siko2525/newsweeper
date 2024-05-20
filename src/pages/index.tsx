import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  // 0 -> 未クリック
  // 1 -> 左クリック
  // 2 -> はてな
  // 3 -> 旗
  const [userInput, setUserInput] = useState<(0 | 1 | 2 | 3)[][]>([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const [bombMap, setBombMap] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const board: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

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

  const isPlaying = userInput.some((row) => row.some((input) => input !== 0));
  const isFailure = userInput.some((row, y) =>
    row.some((input, x) => input === 1 && bombMap[y][x] === 1),
  );
  //bombを作る
  const bombCreate = (bombMap: number[][], x: number, y: number) => {
    console.log(2);
    let bombCount = 0;
    const newBombMap = structuredClone(bombMap);
    while (bombCount < 10) {
      const bombX = Math.floor(Math.random() * 9);
      const bombY = Math.floor(Math.random() * 9);
      if (newBombMap[bombY][bombX] === 1 || (bombX === x && bombY === y)) continue;
      newBombMap[bombY][bombX] = 1;
      bombCount++;
    }
    return newBombMap;
  };

  //クリックしたときの挙動
  const onClick = (x: number, y: number) => {
    // const isExistBomb = board.some((row) => row.some((input) => input === 1));
    const isExistBomb = userInput.flat().some((input) => input === 1);
    //flatで二次元配列を一次元にもってきたので、someを一個にできた
    const newBombMap = structuredClone(bombMap);
    const newUserInput = structuredClone(userInput);
    newUserInput[y][x] = 1;
    if (isExistBomb !== true) {
      const newNewBombMap = bombCreate(newBombMap, x, y);
      setBombMap(newNewBombMap);
    }
    setUserInput(newUserInput);
  };

  const fusion = (x: number, y: number, newUserInput: number[][], newBombMap: number[][]) => {
    if (newBombMap[y][x] === 1 && newUserInput[y][x] === 1) {
      board[y][x] = 11;
      console.log(3);
      for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
          if (newBombMap[y][x] === 1 && newUserInput[y][x] === 0) {
            board[y][x] = 11;
          }
        }
      }
      return;
    }
    if (newUserInput[y][x] === 1) {
      let charge = 0;
      for (const dir of directions) {
        if (
          newBombMap[y + dir[0]] !== undefined &&
          newBombMap[x + dir[1]] !== undefined &&
          newBombMap[y + dir[0]][x + dir[1]] === 1
        ) {
          charge++;
        }
      }
      board[y][x] = charge;
    }
  };

  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 9; y++) {
      fusion(x, y, userInput, bombMap);
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.frame}>
        <div className={styles.smileArea}>
          <div className={styles.bombCount} />
          <div className={styles.smile} />
          <div className={styles.timer} />
        </div>

        <div className={styles.board}>
          {board.map((row, y) =>
            row.map((color, x) => (
              <div
                className={styles.bomb}
                key={`${x}-${y}`}
                onClick={() => onClick(x, y)}
                style={{ backgroundPosition: color * -30 + 30 }}
              >
                {color === -1 && <div className={styles.stone} />}
              </div>
            )),
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
