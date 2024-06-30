import React from 'react';
import styles from '../../pages/index.module.css';

type SmileProps = {
  smileClick: () => void;
  isFailure: boolean;
  isGameClear: boolean;
  bomb: number;
  time: number;
  userInput: number[][];
};

const SmileArea: React.FC<SmileProps> = ({
  bomb,
  smileClick,
  isFailure,
  isGameClear,
  time,
  userInput,
}) => {
  return (
    <>
      <div className={styles.smileArea}>
        <div className={styles.bombCount}>
          {bomb - userInput.flat().filter((cell) => cell === 3).length}
        </div>
        <div
          className={styles.smile}
          onClick={() => smileClick()}
          style={{ backgroundPosition: isFailure ? -390 : isGameClear ? -360 : -330 }}
        />

        <div className={styles.timer}>{time}</div>
      </div>
    </>
  );
};

export default SmileArea;
