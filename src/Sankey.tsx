import React, { useCallback, useMemo, useState } from "react";
import { ChartProps } from "./interfaces";
import sankeyData from "./data/sankeygreenhouse.json"; // s/o https://github.com/micahstubbs/sankey-datasets
import { sankey } from "d3-sankey";
import {
  GradientLightgreenGreen,
  GradientDarkgreenGreen,
  GradientOrangeRed,
  GradientPinkBlue,
  GradientPinkRed,
  GradientPurpleOrange,
  GradientPurpleRed,
  GradientPurpleTeal,
  GradientSteelPurple,
  GradientTealBlue,
} from "@visx/gradient";
import { LinkHorizontal, BarRounded } from "@visx/shape";
import { Text } from "@visx/text";
import tw from "twin.macro";

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

const gradientSeq = [
  GradientLightgreenGreen,
  GradientDarkgreenGreen,
  GradientOrangeRed,
  GradientPinkBlue,
  GradientPinkRed,
  GradientPurpleOrange,
  GradientPurpleRed,
  GradientPurpleTeal,
  GradientSteelPurple,
  GradientTealBlue,
];

function indexToGradient(i: number) {
  return i % gradientSeq.length;
}

export default function SankeyPlot({ height, width }: ChartProps) {
  const [selected, setSelected] = useState("");

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

  const maxDepth = useMemo(
    () => Math.max(...graph.nodes.map((n) => n.depth!)),
    [graph]
  );

  const handleSelect = useCallback(
    (node) => {
      const id = layout.nodeId()(node) as string;
      if (selected === id) setSelected("");
      else setSelected(id);
    },
    [selected]
  );

  const activeLinks = useMemo(() => {
    if (selected === "") return new Set();
    return new Set(
      graph.links.filter(
        (l) =>
          layout.nodeId()(l.source as any) === selected ||
          layout.nodeId()(l.target as any) === selected
      )
    );
  }, [selected, graph]);

  return (
    <svg height={height} width={width}>
      {gradientSeq.map((G) => (
        <G id={G.name} />
      ))}
      <g>
        {graph.nodes.map((node) => (
          <Text
            dx={node.depth === maxDepth ? node.x0! - 2 : node.x1! + 2}
            dy={node.y0! + (node.y1! - node.y0!) / 2}
            verticalAnchor="middle"
            textAnchor={node.depth === maxDepth ? "end" : "start"}
            tw="font-mono text-sm"
          >
            {node.name}
          </Text>
        ))}
      </g>
      <g>
        {graph.links.map((link) => (
          <LinkHorizontal
            data={link}
            source={(l: any) => ({ x: l.source.x1, y: l.y0 })}
            target={(l: any) => ({ x: l.target.x0, y: l.y1 })}
            x={(n) => n.x}
            y={(n) => n.y}
            fill="none"
            stroke={activeLinks.has(link) ? "firebrick" : "grey"}
            strokeWidth={link.width}
            tw="opacity-20 hover:opacity-60"
          />
        ))}
      </g>
      <g>
        {graph.nodes.map((node) => {
          const nodeId = layout.nodeId()(node);
          return (
            <BarRounded
              x={node.x0!}
              height={node.y1! - node.y0!}
              width={node.x1! - node.x0!}
              y={node.y0 as number}
              onClick={() => handleSelect(node)}
              radius={2.5}
              fill={`url(#${gradientSeq[indexToGradient(node.index!)].name})`}
              all
              css={[selected === nodeId && tw`animate-pulse`]}
            />
          );
        })}
      </g>
    </svg>
  );
}
