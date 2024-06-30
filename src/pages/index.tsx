import styles from './index.module.css';
import useGame from '../hooks/useGame';
import Board from '../components/Board/Board';
import SmileArea from '../components/smile/Smilearea';
import Custom from '../components/custom/Custom';

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
      <Custom
        handleLevelClick={handleLevelClick}
        level={level}
        neoCustomWidth={neoCustomWidth}
        setNeoCustomWidth={setNeoCustomWidth}
        setNeoCustomHeight={setNeoCustomHeight}
        setNeoCustomBomb={setNeoCustomBomb}
        neoCustomHeight={neoCustomHeight}
        neoCustomBomb={neoCustomBomb}
        custom={custom}
      />
      <div className={styles.frame}>
        <SmileArea
          smileClick={smileClick}
          isFailure={isFailure}
          isGameClear={isGameClear}
          bomb={bomb}
          time={time}
          userInput={userInput}
        />
        <Board
          board={board}
          rightClick={rightClick}
          onClick={onClick}
          userInput={userInput}
          bombMap={bombMap}
          level={level}
        />
      </div>
    </div>
  );
};

export default Home;
