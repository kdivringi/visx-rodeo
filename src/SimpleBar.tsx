import React from "react";
import { XYChart, BarSeries, Axis, lightTheme, Tooltip } from "@visx/xychart";

const data: { key: string; val: number }[] = [
  { key: "1", val: 4 },
  { key: "2", val: 10 },
  { key: "3", val: 15 },
  { key: "4", val: 23 },
  { key: "10", val: 43 },
];

export default function SimpleBar({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  return (
    <XYChart
      theme={lightTheme}
      height={height}
      width={width}
      xScale={{ type: "band", padding: 0.1 }}
      yScale={{ type: "linear" }}
    >
      <Axis orientation="left" />
      <Axis orientation="bottom" />
      <BarSeries
        data={data}
        dataKey="val"
        xAccessor={(d) => d.key}
        yAccessor={(d) => d.val}
      />
      <Tooltip
        renderTooltip={(d) => (
          <p>{`Stuff: ${JSON.stringify(
            (d as any).tooltipData?.nearestDatum.datum.val
          )}`}</p>
        )}
      />
    </XYChart>
  );
}
