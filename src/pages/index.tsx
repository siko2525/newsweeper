import { useEffect, useState } from 'react';
import styles from './index.module.css';

type levelType = 'easy' | 'normal' | 'hard' | 'custom';

const Home = () => {
  const [level, setLevel] = useState<levelType>('easy');
  const [customWidth, setCustomWidth] = useState(9);
  const [customHeight, setCustomHeight] = useState(9);
  const [customBomb, setCustomBomb] = useState(10);
  const boardWidth = level === 'easy' ? 9 : level === 'normal' ? 16 : level === 'hard' ? 30 : 9;
  const boardHeight = level === 'easy' ? 9 : level === 'normal' ? 16 : level === 'hard' ? 16 : 9;
  const bomb =
    level === 'easy'
      ? 10
      : level === 'normal'
        ? 40
        : level === 'hard'
          ? 99
          : level === 'custom'
            ? 10
            : 10;
  const initialBoard = Array.from({ length: boardWidth }, () =>
    Array.from({ length: boardHeight }, () => 0),
  );

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

  // 0 -> 未クリック
  // 1 -> 左クリック
  // 2 -> はてな
  // 3 -> 旗
  const [userInput, setUserInput] = useState(initialBoard);

  const [bombMap, setBombMap] = useState(initialBoard);

  const [time, setTime] = useState(0);

  // const board: number[][] = Array.from({ length: boardWidth }, () =>
  //   Array.from({ length: boardHeight }, () => 0),
  // );
  const board: number[][] = changeBoard(boardWidth, boardHeight);

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

  // let isEnd = 0;
  const isPlaying = userInput.some((row) => row.some((input) => input === 1));
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
      newUserInput[y][x] = 4;
    } else if (newUserInput[y][x] === 4) {
      newUserInput[y][x] === 0;
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
  };

  useEffect(() => {
    let timer = undefined;
    if (!isFailure && isPlaying) {
      timer = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isFailure, isPlaying]);
  //bombを作る
  const bombCreate = (bombMap: number[][], x: number, y: number, isExist: boolean) => {
    console.log(boardWidth, boardHeight);
    if (isExist) return bombMap;
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

  // const levelSelect = ()
  //クリックしたときの挙動
  const onClick = (x: number, y: number) => {
    // const isExistBomb = board.some((row) => row.some((input) => input === 1));
    const isExistBomb = userInput.flat().some((input) => input === 1);
    //flatで二次元配列を一次元にもってきたので、someを一個にできた
    if (isFailure || board[y][x] === 10) {
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
      for (let i = 0; i < boardWidth; i++) {
        for (let j = 0; j < boardHeight; j++) {
          if (newNewBombMap[i]?.[j] === 1) {
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
    for (let i = 0; i < boardWidth; i++) {
      for (let j = 0; j < boardHeight; j++) {
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
        const Y = y + dy;
        const X = x + dx;
        if (Y >= 0 && Y < newUserInput.length && X >= 0 && X < newUserInput[0].length) {
          endless(X, Y, newUserInput, newBombMap, board);
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
    if (newBombMap[y] === undefined) return;
    if (newUserInput[y][x] === 0 && board[y][x] !== 11) {
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
    if (newUserInput[y][x] === 3) {
      board[y][x] = 10;
    }
    if (newBombMap[y][x] === 1 && newUserInput[y][x] === 1) {
      board[y][x] = 11;
      for (let i = 0; i < boardHeight; i++) {
        if (newBombMap[i] === undefined) break;
        for (let j = 0; j < boardWidth; j++) {
          if (newBombMap[i][j] === 1) {
            board[i][j] = 11;
          }
        }
      }

      return;
    }
  };
  for (let y = 0; y < boardHeight; y++) {
    for (let x = 0; x < boardWidth; x++) {
      fusion(x, y, userInput, bombMap, board);
    }
  }

  const handleLevelClick = (selectedLevel: levelType) => {
    setLevel(selectedLevel);
    setUserInput(
      changeBoard(
        selectedLevel === 'easy'
          ? 9
          : selectedLevel === 'normal'
            ? 16
            : selectedLevel === 'hard'
              ? 30
              : 9,
        selectedLevel === 'easy'
          ? 9
          : selectedLevel === 'normal'
            ? 16
            : selectedLevel === 'hard'
              ? 16
              : 9,
      ),
    );
    setBombMap(
      changeBoard(
        selectedLevel === 'easy'
          ? 9
          : selectedLevel === 'normal'
            ? 16
            : selectedLevel === 'hard'
              ? 30
              : 9,
        selectedLevel === 'easy'
          ? 9
          : selectedLevel === 'normal'
            ? 16
            : selectedLevel === 'hard'
              ? 16
              : 9,
      ),
    );
    setTime(0);
  };

  console.log(setCustomHeight);

  return (
    <div className={styles.container}>
      <div className={styles.levelSelector}>
        <button onClick={() => handleLevelClick('easy')}>easy</button>
        <button onClick={() => handleLevelClick('normal')}>normal</button>
        <button onClick={() => handleLevelClick('hard')}>hard</button>
        <button onClick={() => handleLevelClick('custom')}>custom</button>
      </div>
      {level === 'custom' && (
        <div className={styles.customBoard}>
          <label>
            Width:
            <input
              type="number"
              value={customWidth}
              onChange={(e) => setCustomWidth(Number(e.target.value))}
            />
          </label>
          <label>
            Height:
            <input
              type="number"
              value={customHeight}
              onChange={(e) => setCustomHeight(Number(e.target.value))}
            />
          </label>
          <label>
            Bomb:
            <input
              type="number"
              value={customBomb}
              onChange={(e) => setCustomBomb(Number(e.target.value))}
            />
          </label>
        </div>
      )}

      <div className={styles.frame}>
        <div className={styles.smileArea}>
          <div className={styles.bombCount}>
            {bomb - board.flat().filter((cell) => cell === 10).length}
          </div>
          <div
            className={styles.smile}
            onClick={() => smileClick()}
            style={{ backgroundPosition: isFailure ? -390 : -330 }}
          />

          <div className={styles.timer}>{time}</div>
        </div>

        <div
          className={
            level === 'easy'
              ? styles.easyBoard
              : level === 'normal'
                ? styles.normalBoard
                : level === 'hard'
                  ? styles.hardBoard
                  : level === 'custom'
                    ? styles.normalBoard
                    : styles.normalBoard
          }
        >
          {board.map((row, y) =>
            row.map((color, x) => (
              <div
                className={styles.bomb}
                key={`${x}-${y}`}
                onClick={() => onClick(x, y)}
                onContextMenu={(e) => rightClick(x, y, board, e)}
                style={{
                  backgroundPosition: color * -30 + 30,
                  backgroundColor:
                    userInput[y]?.[x] === 1 && bombMap[y]?.[x] === 1 ? 'red' : undefined,
                }}
              >
                {(color === -1 ||
                  color === 10 ||
                  userInput[y][x] === 3 ||
                  userInput[y][x] === 4) && (
                  <div className={styles.stone}>
                    {color === 10 && <div className={styles.flag} />}
                    {userInput[y][x] === 4 && <div className={styles.question} />}
                  </div>
                )}

                <div>{}</div>
              </div>
            )),
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
