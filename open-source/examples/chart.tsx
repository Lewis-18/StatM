"use client";
import {useEffect, useRef} from 'react';
import * as echarts from 'echarts';
import {makeChartOption} from '../src/chart-options';
import {allowChartPageScroll} from '../src/chart-interaction';
import type {ChartSpec} from '../src/types';

const spec: ChartSpec = {title:'示例 · Histogram', kind:'bar', data:{x:[1,2,3,4], y:[3,7,5,2], n:17}};
export default function ChartExample(){
    const container = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if(!container.current)return;
        const chart = echarts.init(container.current, undefined, {renderer:'svg'});
        chart.setOption(makeChartOption(spec, 'science', 'light'));
        const stop = allowChartPageScroll(container.current);
        const observer = new ResizeObserver(() => chart.resize());
        observer.observe(container.current);
        return () => {observer.disconnect();stop();chart.dispose()};
    }, []);
    return <div ref={container} style={{width:'100%',height:420}}/>;
}
