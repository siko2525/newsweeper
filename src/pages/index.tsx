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

  const clickBomb: number[][] = [
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

  // let isEnd = 0;
  // const isPlaying = userInput.some((row) => row.some((input) => input !== 0));
  const isFailure = userInput.some((row, y) =>
    row.some((input, x) => input === 1 && bombMap[y][x] === 1),
  );

  const rightClick = (
    x: number,
    y: number,
    board: number[][],
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.preventDefault();
    const newUserInput = structuredClone(userInput);
    if (isFailure) return;
    if (newUserInput[y][x] === 3) {
      newUserInput[y][x] = 0;
    } else if (newUserInput[y][x] === 0) {
      newUserInput[y][x] = 3;
      board[y][x] = 10;
      console.log(board);
    }
    setUserInput(newUserInput);
  };

  //bombを作る
  const bombCreate = (bombMap: number[][], x: number, y: number, isExist: boolean) => {
    if (isExist) return bombMap;
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
    if (isFailure) {
      return;
    }
    rightClick(x, y, board, { preventDefault: () => {} } as React.MouseEvent<
      HTMLDivElement,
      MouseEvent
    >);
    const newBombMap = structuredClone(bombMap);
    const newUserInput = structuredClone(userInput);
    const newNewBombMap = bombCreate(newBombMap, x, y, isExistBomb);
    // if (isExistBomb !== true) {
    //   const newNewBombMap = bombCreate(newBombMap, x, y);
    //   setBombMap(newNewBombMap);
    // } else {
    //   const newNewBombMap = newBombMap;
    // }
    setBombMap(newNewBombMap);
    let charge = 0;
    for (const dir of directions) {
      if (newNewBombMap[y + dir[0]] !== undefined && newNewBombMap[y + dir[0]][x + dir[1]] === 1) {
        charge++;
      }
    }
    if (newNewBombMap[y][x] === 1) {
      newUserInput[y][x] = 1;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (newNewBombMap[i][j] === 1) {
            board[i][j] = 11;
          }
        }
      }
    } else if (charge === 0) {
      endless(x, y, newUserInput, newNewBombMap, bombMap);
    } else if (charge >= 1) {
      newUserInput[y][x] = 1;
    }
    setUserInput(newUserInput);
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        fusion(j, i, newUserInput, newNewBombMap, board);
      }
    }
  };

  const endless = (
    x: number,
    y: number,
    newUserInput: number[][],
    newBombMap: number[][],
    board: number[][],
  ) => {
    if (newBombMap[y][x] === 1 || newUserInput[y][x] === 1) return;
    newUserInput[y][x] = 1;
    let charge = 0; // 周囲の爆弾の数を数える
    directions.forEach(([dy, dx]) => {
      const Y = y + dy;
      const X = x + dx;
      if (Y >= 0 && Y < newUserInput.length && X >= 0 && X < newUserInput[0].length) {
        //[0]をつけると列の数
        if (newBombMap[Y][X] === 1) {
          charge++;
        }
      }
    });

    if (charge === 0) {
      // 周囲に爆弾がなければ隣接するセルも開く
      directions.forEach(([dy, dx]) => {
        const ny = y + dy;
        const nx = x + dx;
        if (ny >= 0 && ny < newUserInput.length && nx >= 0 && nx < newUserInput[0].length) {
          endless(nx, ny, newUserInput, newBombMap, board);
        }
      });
    }
  };

  const fusion = (
    x: number,
    y: number,
    newUserInput: number[][],
    newBombMap: number[][],
    board: number[][],
  ) => {
    let bombCount = 0;
    if (userInput[y][x] === 0 && board[y][x] !== 11) {
      board[y][x] = -1;
    }
    if (newUserInput[y][x] === 1) {
      let charge = 0;
      for (const dir of directions) {
        if (newBombMap[y + dir[0]] !== undefined && newBombMap[y + dir[0]][x + dir[1]] === 1) {
          charge++;
        }
      }
      board[y][x] = charge;
    }
    if (newBombMap[y][x] === 1 && newUserInput[y][x] === 1) {
      board[y][x] = 11;
      clickBomb[y][x] = 1;
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (newBombMap[i][j] === 1) {
            board[i][j] = 11;
            bombCount++;
            console.log(bombCount);
          }
        }
      }

      return;
    }
  };

  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 9; y++) {
      fusion(x, y, userInput, bombMap, board);
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
                onContextMenu={(e) => rightClick(x, y, board, e)}
                style={{
                  backgroundPosition: color * -30 + 30,
                  backgroundColor: clickBomb[y][x] === 1 ? 'red' : undefined,
                }}
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
