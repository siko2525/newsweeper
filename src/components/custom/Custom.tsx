import React from 'react';
import styles from '../../pages/index.module.css';

type levelType = 'easy' | 'normal' | 'hard' | 'custom';

type CustomProps = {
  level: levelType;
  handleLevelClick: (level: levelType) => void;
  neoCustomWidth: number;
  setNeoCustomWidth: (value: number) => void;
  neoCustomHeight: number;
  setNeoCustomHeight: (value: number) => void;
  neoCustomBomb: number;
  setNeoCustomBomb: (value: number) => void;
  custom: () => void;
};

const Custom: React.FC<CustomProps> = ({
  handleLevelClick,
  level,
  neoCustomWidth,
  setNeoCustomWidth,
  neoCustomHeight,
  setNeoCustomHeight,
  neoCustomBomb,
  setNeoCustomBomb,
  custom,
}) => {
  return (
    <div className={styles.levelSelector}>
      <button onClick={() => handleLevelClick('easy')}>easy</button>
      <button onClick={() => handleLevelClick('normal')}>normal</button>
      <button onClick={() => handleLevelClick('hard')}>hard</button>
      <button onClick={() => handleLevelClick('custom')}>custom</button>
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
              onChange={(e) => {
                const value = Number(e.target.value);
                setNeoCustomWidth(value < 0 ? 0 : value);
              }}
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
              onChange={(e) => {
                const value = Number(e.target.value);
                setNeoCustomHeight(value < 0 ? 0 : value);
              }}
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
    </div>
  );
};

export default Custom;
