import styles from '../../pages/index.module.css';

type levelType = 'easy' | 'normal' | 'hard' | 'custom';
type BoardProps = {
  board: number[][];
  onClick: (x: number, y: number) => void;
  rightClick: (
    x: number,
    y: number,
    board: number[][],
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void;
  userInput: number[][];
  bombMap: number[][];
  level: levelType;
};

const Board: React.FC<BoardProps> = ({ bombMap, level, board, onClick, rightClick, userInput }) => {
  return (
    <>
      {bombMap.length > 0 && bombMap[0].length > 0 && (
        <div
          className={
            level === 'easy'
              ? styles.easyBoard
              : level === 'normal'
                ? styles.normalBoard
                : level === 'hard'
                  ? styles.hardBoard
                  : level === 'custom'
                    ? styles.easyBoard
                    : styles.easyBoard
          }
          style={{
            width: bombMap[0]?.length * 30,
            height: bombMap.length * 30,
            // display: bombMap.length === 0 || bombMap[0].length === 0 ? 'none' : 'block',
          }}
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
                {(color === -1 || userInput[y][x] === 2 || userInput[y][x] === 3) && (
                  <div className={styles.stone}>
                    {userInput[y][x] === 3 && <div className={styles.flag} />}
                    {userInput[y][x] === 2 && <div className={styles.question} />}
                  </div>
                )}
              </div>
            )),
          )}
        </div>
      )}
    </>
  );
};

export default Board;
