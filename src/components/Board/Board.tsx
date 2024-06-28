import type { FC } from 'react';
import { Cell } from '../Cell/Cell';
import styles from './Board.module.css';

type BoardProps = {
  board: BoardType;
  handleCellClick: (position: Position) => void;
};
