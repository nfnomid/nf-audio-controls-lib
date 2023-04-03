import React, { DragEventHandler, FC, useMemo, useState } from 'react';
import './styles.scss';

const radianAlpha = (alpha: number) => alpha * Math.PI / 180;
const fullAlpha = 270;
const beginAlpha = -(360 - fullAlpha) / 2;

export type ControlProps = {
  value: number;
  setValue: (value: number) => void;
  arcStrokeWidth?: number;
}

export const Control: FC<ControlProps> = ({ value, arcStrokeWidth = 6 }) => {
  const [drugging, setDrugging] = useState(false);
  const controlWidth = 100;
  const centerXY = controlWidth / 2;
  const controlHeight = controlWidth;
  const r = controlWidth / 2 - arcStrokeWidth;

  const alpha = useMemo(() => value * fullAlpha / 100 + beginAlpha, [value]);
  const { cx, cy, cx2, cy2 } = useMemo(() => {
    const cx = centerXY - r * Math.cos(radianAlpha(beginAlpha));
    const cy = centerXY - r * Math.sin(radianAlpha(beginAlpha));
    const cx2 = centerXY - r * Math.cos(radianAlpha(alpha));
    const cy2 = centerXY - r * Math.sin(radianAlpha(alpha));
    return { cx, cy, cx2, cy2 };
  }, [alpha, r, centerXY]);
  // console.log({ cx, cy, cx2, cy2 });
  const handleStartDrug: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    console.log('handleStartDrug');
    setDrugging(true);
  }
  document.onmouseup = (e) => {
    e.preventDefault();
    setDrugging(false);
    console.log('end drugging');
  }
  document.onmousemove = (e) => {
    e.preventDefault();
    if (drugging) {
      console.log('drugging');
    }
  }
  return (
    <div className="control-wrapper" onMouseDown={handleStartDrug}>
      <svg className="control" xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${controlWidth} ${controlHeight}`}>
        <path className="control__progress" strokeWidth={arcStrokeWidth} d={`
          M ${cx} ${cy}
          A ${r} ${r} 0 ${value > 50 ? 1 : 0} 1 ${cx2} ${cy2}
          `}
        />
        <circle className="control__handle" cx={centerXY} cy={centerXY} r="35" fill="#ED6E46" />
      </svg>
    </div>
  );
};
