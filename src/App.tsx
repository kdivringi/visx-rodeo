import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import SimpleBar from './SimpleBar';
import { BarGrouped, BarStacked } from './SimpleBarGroup'
import { withParentSize, ParentSize } from '@visx/responsive';

interface IChartEntry {
  name: string;
  key: string;
  component: React.FunctionComponent<{ height: number, width: number }>;
}

const CHARTS: IChartEntry[] = [
  { name: "Let's make a bar chart", component: SimpleBar, key: 'xyBar' },
  { name: "Grouped Bars", component: BarGrouped, key: 'groupBar' },
  { name: "Stacked Bars", component: BarStacked, key: 'stackBar' }
]

function App() {
  const [chart, setChart] = useState<string>('');
  const selectedChart = CHARTS.find(c => c.key === chart);

  useEffect(()=> {
    if (window.location.hash) {
      setChart(window.location.hash.slice(1))
    }
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        VisX rodeo
      </header>
      <nav className="App-nav">
        {CHARTS.map(({ name, key }) => (<a className="Chart-link" key={key} href={`#${key}`} onClick={() => setChart(key)}>{name}</a>))}
      </nav>
      <article className="App-content">{selectedChart && (
        <ParentSize>
          {parent => <selectedChart.component  height={parent.height - 10} width={parent.width - 10}/> }
        </ParentSize>
        )} </article>
    </div>
  )
}

export default App
