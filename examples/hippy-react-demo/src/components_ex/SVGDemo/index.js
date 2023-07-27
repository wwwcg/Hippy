import React from 'react';
import {
  View,
} from '@hippy/react';
import {
  Svg,
  Circle,
  Path,
  Rect,
  Line,
  SVGText,
  TSpan,
} from '@tencent/hippy-react-svg';

function toRadarPos(value, index, count) {
  const theta = index / count * 2 * Math.PI;
  return [Math.sin(theta) * value, - Math.cos(theta) * value];
}

function Polygon({ origin, values, ...props }) {
  const [originX, originY] = origin || [0, 0];
  let d = '';
  const count = values.length;
  values.forEach((value, index) => {
    const [x, y] = toRadarPos(value, index, count);
    d += `${index ? 'L' : 'M'} ${x + originX},${y + originY} `;
  });
  return <Path d={d + ' z'} fill='rgba(128, 150, 255, .2)' {...props} />;
}

function Pentagon({ origin, value, ...props }) {
  return <Polygon origin={origin} values={[value, value, value, value, value]} {...props} />;
}

export default function SvgExample() {
  const values = [85, 60, 30, 70, 60];
  const endPoint = ([x, y]) => ({ x2: `${x + 150}}`, y2: `${y + 150}` });

  return <View style={{ flex: 1, collapsable: false, backgroundColor: '#eee' }}>
    <Svg style={{ width: 300, height: 300 }}>
      <Pentagon origin={[150, 150]} value={100} fill='rgba(128, 150, 255, .2)' />
      <Pentagon origin={[150, 150]} value={80} fill='rgba(128, 150, 255, .2)' />
      <Pentagon origin={[150, 150]} value={60} fill='rgba(128, 150, 255, .2)' />
      <Pentagon origin={[150, 150]} value={40} fill='rgba(128, 150, 255, .2)' />
      <Pentagon origin={[150, 150]} value={20} fill='rgba(128, 150, 255, .2)' />
      <Line x1={'150'} y1={'150'} {...endPoint(toRadarPos(100, 0, 5))} stroke='rgba(128, 150, 255, .67)' strokeWidth={'0.5'} />
      <Line x1={'150'} y1={'150'} {...endPoint(toRadarPos(100, 1, 5))} stroke='rgba(128, 150, 255, .67)' strokeWidth={'0.5'} />
      <Line x1={'150'} y1={'150'} {...endPoint(toRadarPos(100, 2, 5))} stroke='rgba(128, 150, 255, .67)' strokeWidth={'0.5'} />
      <Line x1={'150'} y1={'150'} {...endPoint(toRadarPos(100, 3, 5))} stroke='rgba(128, 150, 255, .67)' strokeWidth={'0.5'} />
      <Line x1={'150'} y1={'150'} {...endPoint(toRadarPos(100, 4, 5))} stroke='rgba(128, 150, 255, .67)' strokeWidth={'0.5'} />

      <Polygon origin={[150, 150]} values={values} fill='rgba(0, 0, 255, .2)' stroke='blue' />
      {values.flatMap((value, index) => {
        const [x, y] = toRadarPos(value, index, values.length);
        const [textX, textY] = toRadarPos(120, index, values.length);
        return <>
          <Circle cx={`${x + 150}`} cy={`${y + 150}`} r={'3'} fill='white' stroke='blue' strokeWidth={'0.5'} />
          <Circle cx={`${x + 150}`} cy={`${y + 150}`} r={'2'} fill='blue' />
          {/*<SVGText x={textX + 150} y={textY + 150 - 10} text={value + ''} textAnchor='middle' fontSize={18} fontWeight='bold' fill='red' ></SVGText>*/}
          {/*<TSpan content={value + ''}></TSpan>*/}
        </>
      })}
    </Svg>

    <Svg style={{height:250, width:250, viewBox:"0 0 100 100"}} >
      <Circle
        cx="50"
        cy="50"
        r="45"
        stroke="blue"
        strokeWidth="2.5"
        fill="green"
      />
      <Rect
        x="15"
        y="15"
        width="70"
        height="70"
        stroke="red"
        strokeWidth="2"
        fill="yellow"
      />
    </Svg>
  </View>;
}
