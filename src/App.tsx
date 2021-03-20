import React, { useState, useEffect, useRef } from "react";
import SimpleBar from "./SimpleBar";
import { BarGrouped, BarStacked } from "./SimpleBarGroup";
import CalendarPlot from "./CalendarPlot";
import { ParentSize } from "@visx/responsive";
import tw from "twin.macro";
import { css } from "@emotion/react";

const linkStyle = tw`block hover:font-semibold text-blue-600 visited:text-purple-600`;

const appCss = css`
  display: grid;
  grid-template-columns: 10em auto;
  grid-template-rows: 5em auto;
  grid-template-areas:
    "header header"
    "nav content";
  min-height: 100vh;
`;

const appHeader = css([
  css`
    grid-area: header;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `,
  tw`bg-gradient-to-r from-purple-500 to-pink-500 text-4xl font-semibold tracking-wider text-white`,
]);
const appNav = css`
  grid-area: nav;
  display: flex;
  flex-flow: column nowrap;
`;

interface IChartEntry {
  name: string;
  key: string;
  component: React.FunctionComponent<{ height: number; width: number }>;
}

const CHARTS: IChartEntry[] = [
  { name: "Let's make a bar chart", component: SimpleBar, key: "xyBar" },
  { name: "Grouped Bars", component: BarGrouped, key: "groupBar" },
  { name: "Stacked Bars", component: BarStacked, key: "stackBar" },
  { name: "Calendar Plot (WIP)", component: CalendarPlot, key: "calendar" },
];

function App() {
  const [chart, setChart] = useState<string>("");
  const selectedChart = CHARTS.find((c) => c.key === chart);

  useEffect(() => {
    function listenHash() {
      if (window.location.hash) {
        setChart(window.location.hash.slice(1));
      }
    }
    listenHash();
    window.addEventListener("hashchange", listenHash);
    return () => window.removeEventListener("hashchange", listenHash);
  }, []);

  return (
    <div css={appCss}>
      <header css={appHeader}>VisX Rodeo</header>
      <nav css={appNav}>
        {CHARTS.map(({ name, key }) => (
          <a
            css={[linkStyle, key === chart && tw`underline`]}
            key={key}
            href={`#${key}`}
            onClick={() => setChart(key)}
          >
            {name}
          </a>
        ))}
        <div>Sankey</div>
        <div>SPLOM</div>
        <div>Sparklines</div>
        <div>Hexbins</div>
        <hr />
        <div>
          <a css={linkStyle} href="https://github.com/kdivringi/visx-rodeo">
            (repo)
          </a>
        </div>
      </nav>
      <article css={css({ gridArea: "content" })}>
        {selectedChart && (
          <ParentSize>
            {(parent) => (
              <selectedChart.component
                height={parent.height - 10}
                width={parent.width - 10}
              />
            )}
          </ParentSize>
        )}
      </article>
    </div>
  );
}

export default App;
