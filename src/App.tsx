import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import SimpleBar from './SimpleBar';
import { BarGrouped, BarStacked } from './SimpleBarGroup'
import CalendarPlot from './CalendarPlot';
import {  ParentSize } from '@visx/responsive';

interface IChartEntry {
  name: string;
  key: string;
  component: React.FunctionComponent<{ height: number, width: number }>;
}

const CHARTS: IChartEntry[] = [
  { name: "Let's make a bar chart", component: SimpleBar, key: 'xyBar' },
  { name: "Grouped Bars", component: BarGrouped, key: 'groupBar' },
  { name: "Stacked Bars", component: BarStacked, key: 'stackBar' },
  { name: "Calendar Plot (WIP)", component: CalendarPlot, key: 'calendar'}
]

function App() {
  const [chart, setChart] = useState<string>('');
  const selectedChart = CHARTS.find(c => c.key === chart);

  useEffect(()=> {
    function listenHash() {
      if (window.location.hash) {
        setChart(window.location.hash.slice(1))
      }
    }
    window.addEventListener('hashchange', listenHash);
    return () => window.removeEventListener('hashchange', listenHash)
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        VisX rodeo
      </header>
      <nav className="App-nav">
        {CHARTS.map(({ name, key }) => (<a className="Chart-link" key={key} href={`#${key}`} onClick={() => setChart(key)}>{name}</a>))}
        <div>Sankey</div>
        <div>SPLOM</div>
        <div>Sparklines</div>
        <div>Hexbins</div>
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
