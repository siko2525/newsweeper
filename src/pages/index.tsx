import { useState } from 'react';
import styles from './index.module.css';
import { stringifyCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { Console } from 'console';

const Home = () => {
  // 0 -> 未クリック
  // 1 -> 左クリック
  // 2 -> はてな
  // 3 -> 旗
  const [board, setBoard] = useState<(0 | 1 | 2 | 3)[][]>([
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

  const minesweeper: number[][] = [
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
    [1, -1],
    [0, -1],
    [1, -1],
  ];

  const isPlaying = board.some((row) => row.some((input) => input !== 0));
  const isFailure = board.some((row, y) =>
    row.some((input, x) => input === 1 && bombMap[y][x] === 1),
  );
  //bombを作る
  const bombCreate = (bombmap: number[][], x: number, y: number) => {
    console.log(2);
    let bombCount = 0;
    const newBombMap = structuredClone(bombmap);
    while (bombCount < 10) {
      const bombX = Math.floor(Math.random() * 9);
      const bombY = Math.floor(Math.random() * 9);
      console.log(bombX, bombY);
      if (newBombMap[bombY][bombX] === 1 || (bombX === x && bombY === y)) continue;
      newBombMap[bombY][bombX] = 1;
      bombCount++;
    }

    console.log('pao-n', newBombMap);
    return newBombMap;
  };

  //クリックしたときの挙動
  const onClick = (x: number, y: number) => {
    console.log(1);
    const newBombMap = structuredClone(bombMap);
    board[y][x] = 1;
    const newnewBombMap = bombCreate(newBombMap, x, y);
    setBombMap(newnewBombMap);
  };

  return (
    <div className={styles.container}>
      <div className={styles.frame}>
        <div className={styles.smilearea}>
          <div className={styles.bombcount} />
          <div className={styles.smile} />
          <div className={styles.timer} />
        </div>

        <div className={styles.board}>
          {bombMap.map((row, y) =>
            row.map((color, x) => (
              <div
                className={styles.bomb}
                key={`${x}-${y}`}
                onClick={() => onClick(x, y)}
                style={{ backgroundPosition: color * -30 + 30 }}
              >
                {bombMap[y][x]}
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
