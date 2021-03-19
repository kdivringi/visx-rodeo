import { eachWeekOfInterval } from 'date-fns'
import React, { useEffect } from 'react';
import { HeatmapRect } from '@visx/heatmap';
import { getSeededRandom, genBins } from '@visx/mock-data';
import { scaleOrdinal, scaleTime, scaleLinear } from '@visx/scale';

const [minDate, maxDate] = [new Date(2021, 1, 7), new Date(2021, 2, 27)]
const weekStarts = eachWeekOfInterval({ start: minDate, end: maxDate })

const seededRandom = getSeededRandom(0.41);
const binData = genBins(
  /* length = */ weekStarts.length,
  /* height = */ 7,
  /** binFunc */ idx => 150 * idx,
  /** countFunc */ (i, number) => 25 * (number - i) * seededRandom(),
);



export default function CalendarPlot({ width, height }: { width: number, height: number }) {
    const squareEdge = Math.min(width, height);
    // const xScale = scaleTime({ domain: [minDate, maxDate], range: [0, width] })
    const xScale = scaleLinear({ domain: [0, weekStarts.length], range: [0, squareEdge] })
    // const yScale = scaleOrdinal({ domain: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], range: [0, height] })
    const yScale = scaleLinear({ domain: [0, 7], range: [0, squareEdge] })
    const colorScale = scaleLinear({ domain: [0, 25], range: ['#efedf5', '#bcbddc', '#756bb1'] });
    // useEffect(() => {
    //     console.log(binData, weekStarts)
    // }, [])
    return (
        <svg height={squareEdge} width={squareEdge}>
            {/* <rect x={0} y={0} width={width} height={height} fill="wheat"/> */}
            <HeatmapRect data={binData} binWidth={squareEdge / 7} binHeight={squareEdge / 7} xScale={d => xScale(d)} yScale={d => yScale(d)} colorScale={colorScale} />
        </svg>
  );
}