import React, { useMemo } from "react";
import {
  XYChart,
  BarSeries,
  BarGroup,
  BarStack,
  Axis,
  lightTheme,
} from "@visx/xychart";
import { getSeededRandom, genBins } from "@visx/mock-data";

const groupLength = 100;

function genData(dataLength: number) {
  const seededRandom = getSeededRandom(0.81);
  return Array(dataLength)
    .fill(0)
    .map((_, i) => ({
      key: i,
      a: seededRandom() * 30,
      b: seededRandom() * 40,
      c: seededRandom() * 50,
    }));
}

function BaseChart({
  height,
  width,
  groupType,
}: {
  height: number;
  width: number;
  groupType: "group" | "stack";
}) {
  const numGroups = Math.max(Math.floor(width / groupLength), 3);
  const data = useMemo(() => genData(numGroups), [numGroups]);
  const GroupType = groupType === "group" ? BarGroup : BarStack;
  return (
    <XYChart
      theme={lightTheme}
      width={width}
      height={height}
      yScale={{ type: "linear" }}
      xScale={{ type: "band", padding: 0.1 }}
    >
      <Axis orientation="bottom" />
      <Axis orientation="left" />
      <GroupType>
        <BarSeries
          data={data}
          key="a"
          dataKey="a"
          xAccessor={(d) => d.key}
          yAccessor={(d) => d.a}
        />
        <BarSeries
          data={data}
          key="b"
          dataKey="b"
          xAccessor={(d) => d.key}
          yAccessor={(d) => d.b}
        />
        <BarSeries
          data={data}
          key="c"
          dataKey="c"
          xAccessor={(d) => d.key}
          yAccessor={(d) => d.c}
        />
      </GroupType>
    </XYChart>
  );
}

export function BarGrouped(props: { height: number; width: number }) {
  return <BaseChart groupType="group" {...props} />;
}

export function BarStacked(props: { height: number; width: number }) {
  return <BaseChart groupType="stack" {...props} />;
}
