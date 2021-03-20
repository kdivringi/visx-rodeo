import { useEffect } from 'react';
import { HeatmapRect } from '@visx/heatmap';
import { getSeededRandom, genBins } from '@visx/mock-data';
import { scaleOrdinal, scaleTime, scaleLinear, scalePoint } from '@visx/scale';
import { Group } from '@visx/group'
import { AxisTop, AxisRight } from '@visx/axis'
import * as time from 'd3-time'
import * as array from 'd3-array';

const [minDate, maxDate] = [new Date(2021, 1, 7), new Date(2021, 2, 27)]
const weekStarts = time.timeWeeks( minDate, maxDate );

const seededRandom = getSeededRandom(0.41);
const binData = genBins(
  /* length = */ weekStarts.length,
  /* height = */ 7,
  /** binFunc */ idx => 150 * idx,
  /** countFunc */(i, number) => 25 * (number - i) * seededRandom(),
);

function midPoints(scale: ReturnType<typeof scaleLinear>, bins: number): number[] {
  const ticks = scale.ticks(bins);
  delete ticks[ticks.length - 1];
  const interval = ticks[1] - ticks[0];
  return ticks.map(t => t + 0.5*interval);
}

/**
 * Histogram scales are just the column and row index -> position
 */

export default function CalendarPlot({ width, height }: { width: number, height: number }) {
  const margin = { top: 25, right: 25 }
  const squareEdge = Math.min(width - margin.right, height - margin.top);
  const xLabelScale = scaleTime({ domain: [minDate, maxDate], range: [0, squareEdge] })
  // const xLabelScale = scalePoint({ domain: time.timeWeeks(minDate, maxDate), range: [0, squareEdge] })
  const xScale = scaleLinear({ domain: [0, weekStarts.length], range: [0, squareEdge] })
  // const yScale = scaleOrdinal({ domain: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], range: [0, height] })
  const yScale = scaleLinear({ domain: [0, 7], range: [0, squareEdge] })
  const colorScale = scaleLinear({ domain: [0, 25], range: ['#efedf5', '#bcbddc', '#756bb1'] });
  // useEffect(() => {
  //     console.log(weekStarts)
  // }, [])
  return (
    <svg height={squareEdge + margin.top} width={squareEdge + margin.right}>
      {/* <rect x={0} y={0} width={width} height={height} fill="wheat"/> */}
      <Group top={margin.top}>
        <HeatmapRect data={binData} binWidth={squareEdge / 7} binHeight={squareEdge / 7} xScale={d => xScale(d)} yScale={d => yScale(d)} colorScale={colorScale} />
      </Group>
      <AxisTop top={margin.top} scale={xScale} tickValues={midPoints(xScale, weekStarts.length)}/>
      <AxisRight top={margin.top} left={squareEdge} scale={yScale} tickValues={midPoints(yScale, 7)}/>
    </svg>
  );
}