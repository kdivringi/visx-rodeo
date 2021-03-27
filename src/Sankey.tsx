import React, { useMemo } from "react";
import { ChartProps } from "./interfaces";
import sankeyData from "./data/sankeygreenhouse.json"; // s/o https://github.com/micahstubbs/sankey-datasets
import { sankey } from "d3-sankey";
import { GradientLightgreenGreen } from "@visx/gradient";
import {
  LinkHorizontalCurve,
  LinkHorizontal,
  LinkHorizontalLine,
  pathHorizontalCurve,
  BarRounded,
} from "@visx/shape";

interface Node {
  name: string;
}
interface RawLink {
  source: string;
  target: string;
  value: string;
}
interface Link {
  source: string;
  target: string;
  value: number;
}

const { links, nodes }: { links: RawLink[]; nodes: Node[] } = sankeyData;

const layout = sankey<Node, Link>().nodeId((d) => d.name);

const padding = 10;

const gradientId = "node-gradient";
export default function SankeyPlot({ height, width }: ChartProps) {
  const graph = useMemo(
    () =>
      layout.extent([
        [padding, padding],
        [width - padding, height - padding],
      ])({
        nodes,
        links: links.map((l) => ({ ...l, value: Number(l.value) })),
      }),
    [height, width]
  );
  const linkToNode = useMemo(
    () => new Map(graph.nodes.map((n) => [layout.nodeId()(n), n])),
    [graph]
  );
  console.log(graph)
  return (
    <svg height={height} width={width}>
      <GradientLightgreenGreen id={gradientId} />
      <g>
        {graph.links.map((link) => (
          <LinkHorizontal
            data={link}
            source={l => ({ x: l.source.x1, y: l.y0 } )}
            target={l => ({ x: l.target.x0, y: l.y1 })}
            x={n => n.x}
            y={n => n.y}
            fill="none"
            stroke="firebrick"
            strokeWidth={link.width}
            opacity={0.2}
          />
        ))}
      </g>
      <g>
        {graph.nodes.map((node) => (
          <BarRounded
            x={node.x0 as number}
            height={(node.y1 as number) - (node.y0 as number)}
            width={(node.x1 as number) - (node.x0 as number)}
            y={node.y0 as number}
            radius={2.5}
            fill={`url(#${gradientId})`}
            all
          />
        ))}
      </g>
    </svg>
  );
  return <p>A sankey</p>;
}
