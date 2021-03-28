import React from "react";
import { HeatmapRect } from "@visx/heatmap";
import { genBins, cityTemperature } from "@visx/mock-data";
import { CityTemperature } from "@visx/mock-data/lib/mocks/cityTemperature";
import { scaleTime, scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { AxisBottom, AxisRight } from "@visx/axis";
import { Text } from "@visx/text";
import * as time from "d3-time";
import { extent, group } from "d3-array";
import * as format from "d3-time-format";
import { LegendLinear } from "@visx/legend";
import tw from "twin.macro";

// Sunday based week & day
const toWeekYear = format.timeFormat("%Y W%U");
const toDay = format.timeFormat("%w");

const [minDate, maxDate] = extent(cityTemperature, (d) => new Date(d.date)) as [
  Date,
  Date
];

const df = group(cityTemperature, (d) => toWeekYear(new Date(d.date)));
type City = "San Francisco" | "Austin" | "New York";
type BinDf = Record<City, NonNullable<ReturnType<typeof genBins>>>;
const binDf: BinDf = {
  Austin: [],
  "San Francisco": [],
  "New York": [],
};

const weekStarts = time.timeWeeks(minDate, maxDate);

for (const [i, week] of weekStarts.entries()) {
  const weekYear = toWeekYear(week);
  if (!df.has(weekYear)) {
    continue;
  }
  const days = df.get(weekYear) as NonNullable<ReturnType<typeof df.get>>;

  for (const city of Object.keys(binDf)) {
    const newBin = {
      bin: i,
      bins: days.map((d: CityTemperature) => ({
        bin: Number(toDay(new Date(d.date))),
        count: Number(d[city as City]),
      })),
    };
    binDf[city as City].push(newBin);
  }
}

const [minTemp, maxTemp] = extent([
  ...cityTemperature.map((c) => +c.Austin),
  ...cityTemperature.map((c) => +c["New York"]),
  ...cityTemperature.map((c) => +c["San Francisco"]),
]) as [number, number];

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
  const margin = { top: 25, right: 25, left: 25, bottom: 35 };
  const squareEdge = Math.min(
    Math.max(width, 300) - margin.right - margin.left,
    Math.max(height, 300) - margin.top - margin.bottom
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
  const plotHeight = margin.top + margin.bottom + rectHeight;

  return (
    <>
      <svg
        height={plotHeight * 3}
        width={rectHeight + margin.right + margin.left}
        css={{ overflow: "visible" }}
      >
        {Object.entries(binDf).map(([city, cityData], i) => (
          <Group key={city} top={margin.top + plotHeight * i}>
            <Text
              dx={rectWidth / 2}
              dy={-margin.top / 2}
              textAnchor="middle"
              verticalAnchor="middle"
            >
              {city}
            </Text>
            <HeatmapRect
              data={cityData}
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
        ))}
      </svg>
      <LegendLinear
        scale={colorScale}
        direction="row"
        labelFormat={(n) => `${(n as number).toFixed(0)}°F`}
        tw="border-2 border-purple-200 p-1 w-min text-sm rounded-md shadow"
      />
    </>
  );
}
