import { eachWeekOfInterval } from 'date-fns'
import React from 'react';

const [minDate, maxDate] = [new Date(2021, 1, 7), new Date(2021, 2, 27)]

export default function CalendarPlot({ width, height }: { width: number, height: number }) {
    return <div style={{ width, height }}>{JSON.stringify(eachWeekOfInterval({ start: minDate, end: maxDate }), undefined, 2)}</div>
}