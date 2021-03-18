import React from 'react';
import { XYChart, BarSeries, BarGroup, BarStack, Axis, lightTheme } from '@visx/xychart'

const data = [
    [10, 20, 30],
    [15, 25, 35],
    [3, 4, 40]
].map(([a, b, c], i) => ({ key: i, a, b, c }));

function BaseChart({ height, width, groupType }: { height: number, width: number, groupType: 'group' | 'stack' }) {
    const GroupType = groupType === 'group' ? BarGroup : BarStack;
    return (
        <XYChart theme={lightTheme} width={width} height={height} yScale={{ type: 'linear' }} xScale={{ type: 'band', padding: 0.1 }}>
            <Axis orientation="bottom" />
            <Axis orientation="left" />
            <GroupType>
                <BarSeries data={data} key='a' dataKey='a' xAccessor={d => d.key} yAccessor={d => d.a} />
                <BarSeries data={data} key='b' dataKey='b' xAccessor={d => d.key} yAccessor={d => d.b} />
                <BarSeries data={data} key='c' dataKey='c' xAccessor={d => d.key} yAccessor={d => d.c} />
            </GroupType>
        </XYChart>
    )
}

export function BarGrouped(props: { height: number, width: number }) {
    return <BaseChart groupType="group" {...props}/>
}

export function BarStacked(props: { height: number, width: number }) {
    return <BaseChart groupType='stack' {...props}/>
}