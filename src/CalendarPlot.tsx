import { useEffect } from "react";
import { HeatmapRect } from "@visx/heatmap";
import { getSeededRandom, genBins, cityTemperature } from "@visx/mock-data";
import { scaleTime, scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { AxisBottom, AxisRight } from "@visx/axis";
import { Text } from "@visx/text";
import * as time from "d3-time";
import * as array from "d3-array";
import * as format from "d3-time-format";

// Sunday based week & day
const toWeekYear = format.timeFormat("%Y W%U");
const toDay = format.timeFormat("%w");

const [minDate, maxDate] = array.extent(
  cityTemperature,
  (d) => new Date(d.date)
) as [Date, Date];

const df = array.group(cityTemperature, (d) => toWeekYear(new Date(d.date)));
const binDf: ReturnType<typeof genBins> = [];

const weekStarts = time.timeWeeks(minDate, maxDate);

const city = "San Francisco";
// const city = 'Austin'
// const city = 'New York'
for (const [i, week] of weekStarts.entries()) {
  const weekYear = toWeekYear(week);
  if (!df.has(weekYear)) {
    continue;
  }
  const days = df.get(weekYear) as NonNullable<ReturnType<typeof df.get>>;
  const newBin = {
    bin: i,
    bins: days.map((d) => ({
      bin: Number(toDay(new Date(d.date))),
      count: Number(d[city]),
    })),
  };
  binDf.push(newBin);
}

const [minTemp, maxTemp] = array.extent(cityTemperature, (d) =>
  Number(d[city])
) as [number, number];
// const [minDate, maxDate] = [new Date(2021, 1, 7), new Date(2021, 2, 27)];

const seededRandom = getSeededRandom(0.41);
const binData = genBins(
  /* length = */ weekStarts.length,
  /* height = */ 7,
  /** binFunc */ (idx) => 150 * idx,
  /** countFunc */ (i, number) => 25 * (number - i) * seededRandom()
);
console.log(df,binDf);

function midPoints(
  scale: ReturnType<typeof scaleLinear>,
  bins: number
): number[] {
  const ticks = scale.ticks(bins);
  delete ticks[ticks.length - 1];
  const interval = ticks[1] - ticks[0];
  return ticks.map((t) => t + 0.5 * interval);
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Histogram scales are just the column and row index -> position
 */

export default function CalendarPlot({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const margin = { top: 25, right: 25, left: 25 };
  const squareEdge = Math.min(
    width - margin.right - margin.left,
    height - margin.top
  );
  const yBins = 7;
  const xBins = weekStarts.length;
  const binSide = Math.min(squareEdge / yBins, squareEdge / xBins);
  const rectWidth = binSide * xBins;
  const rectHeight = binSide * yBins;
  const xTimeScale = scaleTime({
    domain: [minDate, maxDate],
    range: [0, rectWidth],
  });
  const xScale = scaleLinear({
    domain: [0, weekStarts.length],
    range: [0, rectWidth],
  });
  const yScale = scaleLinear({ domain: [0, 7], range: [0, rectHeight] });
  const colorScale = scaleLinear({
    domain: [minTemp, maxTemp],
    range: ["#efedf5", "#756bb1"],
  });
  useEffect(() => {
    // @ts-ignore
    window.scaleC = colorScale;
  });
  return (
    <svg
      height={rectHeight + margin.top}
      width={rectHeight + margin.right + margin.left}
      css={{ overflow: "visible" }}
    >
      <Group top={margin.top}>
        <Text
          dx={rectWidth / 2}
          dy={-margin.top / 2}
          textAnchor="middle"
          verticalAnchor="middle"
        >
          {city}
        </Text>
        <HeatmapRect
          data={binDf}
          binWidth={binSide}
          binHeight={binSide}
          xScale={(d) => xScale(d)}
          yScale={(d) => yScale(d)}
          colorScale={colorScale}
        />
        <AxisBottom top={rectHeight} scale={xTimeScale} />
        <AxisRight
          left={rectWidth}
          scale={yScale}
          tickValues={midPoints(yScale, 7)}
          tickFormat={(t) => dayNames[Math.floor(t.valueOf())]}
        />
      </Group>
    </svg>
  );
}
