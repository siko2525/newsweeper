import styles from './index.module.css';
import useGame from '../hooks/useGame';

const Home = () => {
  const {
    level,
    isGameClear,
    time,
    bomb,
    userInput,
    bombMap,
    neoCustomBomb,
    neoCustomHeight,
    neoCustomWidth,
    board,
    isFailure,
    smileClick,
    onClick,
    rightClick,
    handleLevelClick,
    custom,
    setNeoCustomWidth,
    setNeoCustomHeight,
    setNeoCustomBomb,
  } = useGame();

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
              min={0}
              max={300}
              step="1"
              value={neoCustomWidth}
              onChange={(e) => setNeoCustomWidth(Number(e.target.value))}
              onInput={(e) => {
                const value = Number((e.target as HTMLInputElement).value);
                if (!Number.isInteger(value)) {
                  (e.target as HTMLInputElement).value = Math.floor(value).toString();
                }
              }}
            />
          </label>
          <label>
            Height:
            <input
              type="number"
              min={0}
              max={300}
              step="1"
              value={neoCustomHeight}
              onChange={(e) => setNeoCustomHeight(Number(e.target.value))}
              onInput={(e) => {
                const value = Number((e.target as HTMLInputElement).value);
                if (!Number.isInteger(value)) {
                  (e.target as HTMLInputElement).value = Math.floor(value).toString();
                }
              }}
            />
          </label>
          <label>
            Bomb:
            <input
              type="number"
              min={0}
              max={neoCustomHeight * neoCustomWidth}
              step="1"
              value={neoCustomBomb}
              onChange={(e) => setNeoCustomBomb(Number(e.target.value))}
              onInput={(e) => {
                const value = Number((e.target as HTMLInputElement).value);
                if (!Number.isInteger(value)) {
                  (e.target as HTMLInputElement).value = Math.floor(value).toString();
                }
              }}
            />
          </label>
          <button onClick={() => custom()}>confirm</button>
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
            style={{ backgroundPosition: isFailure ? -390 : isGameClear ? -360 : -330 }}
          />

          <div className={styles.timer}>{time}</div>
        </div>
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
                  {(color === -1 || color === 10 || userInput[y][x] === 2) && (
                    <div className={styles.stone}>
                      {color === 10 && <div className={styles.flag} />}
                      {userInput[y][x] === 2 && <div className={styles.question} />}
                    </div>
                  )}
                </div>
              )),
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
