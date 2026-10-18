import type {EChartsOption,CustomSeriesRenderItem,SeriesOption} from 'echarts';
import type {ChartSpec} from './types';
import {palettes,type PaletteName} from './chart-preferences';
import {figureHeading} from './figure-export';

export function estimationOption(spec:ChartSpec,palette:PaletteName,theme:'light'|'dark',exporting:boolean,width:number):EChartsOption{
 const light=theme==='light',text=light?'#263348':'#dbe4ef',muted=light?'#536379':'#a7b5c7',grid=light?'#e1e7ef':'#354052';
 const color=palettes[palette][theme],heading=figureHeading(spec.title,`${'原始观测与均值差区间'} · ${Number(((spec.data.confidence||.95)*100).toFixed(8))}% CI · n=${spec.data.n}`,width);
 const categories=spec.data.categories||[],estimates=spec.data.estimates||[];
 const points=(spec.data.points||[]).map(([group,value],i)=>[group+(((i*137)%97)/97-.5)*.24,value]);
 const render:CustomSeriesRenderItem=(params,api)=>{const center=api.coord([Number(api.value(0)),Number(api.value(1))]),low=api.coord([Number(api.value(2)),Number(api.value(1))]),high=api.coord([Number(api.value(3)),Number(api.value(1))]);return {type:'group',children:[{type:'line',shape:{x1:low[0],y1:low[1],x2:high[0],y2:high[1]},style:{stroke:color,lineWidth:2}},{type:'line',shape:{x1:low[0],y1:low[1]-4,x2:low[0],y2:low[1]+4},style:{stroke:color,lineWidth:2}},{type:'line',shape:{x1:high[0],y1:high[1]-4,x2:high[0],y2:high[1]+4},style:{stroke:color,lineWidth:2}},{type:'circle',shape:{cx:center[0],cy:center[1],r:4},style:{fill:color,stroke:light?'#fff':'#111827',lineWidth:1}}]}};
 const series:SeriesOption[]=[{type:'scatter',xAxisIndex:0,yAxisIndex:0,data:points,symbolSize:4,itemStyle:{color,opacity:.5},tooltip:{show:false},...(categories.length===1?{markLine:{silent:true,symbol:'none',label:{show:false},lineStyle:{color:muted,type:'dashed'},data:[{yAxis:spec.data.reference||0}]}}:{})},
 {type:'custom',renderItem:render,xAxisIndex:1,yAxisIndex:1,data:estimates.map((e,i)=>[e.estimate,i,e.low,e.high]),encode:{x:[0,2,3],y:1},tooltip:{show:false}}];
 if(spec.data.pairs)for(const pair of spec.data.pairs)series.push({type:'line',xAxisIndex:0,yAxisIndex:0,data:[[0,pair[0]],[1,pair[1]]],showSymbol:false,lineStyle:{color:muted,opacity:.12,width:1},tooltip:{show:false},silent:true});
 series.push({type:'line',xAxisIndex:1,yAxisIndex:1,data:[],markLine:{silent:true,symbol:'none',label:{show:false},lineStyle:{color:muted,type:'dashed'},data:[{xAxis:0}]}});
 return {animation:false,textStyle:{color:text,fontFamily:'Inter, Microsoft YaHei, sans-serif',fontSize:12},backgroundColor:exporting?'#ffffff':'transparent',title:exporting?{text:heading.text,subtext:heading.subtext,left:20,top:16,textStyle:{color:text,fontSize:16,lineHeight:20},subtextStyle:{color:muted,fontSize:11,lineHeight:15}}:undefined,
 grid:[{left:68,right:30,top:exporting?heading.plotTop:24,height:'40%'},{left:Math.min(width*.4,240),right:38,top:'69%',bottom:44}],
 xAxis:[{type:'value',min:-1,max:Math.max(1,categories.length),interval:1,axisLabel:{color:muted,formatter:(v:number)=>categories[v]||'',hideOverlap:true},splitLine:{show:false},axisTick:{show:false},axisLine:{show:false}},
 {type:'value',gridIndex:1,min:value=>Math.min(value.min,0),max:value=>Math.max(value.max,0),name:'均值差 A − B',nameLocation:'middle',nameGap:28,nameTextStyle:{color:muted},axisLabel:{color:muted},splitLine:{lineStyle:{color:grid,type:'dashed'}}}],
 yAxis:[{type:'value',name:spec.yLabel,nameLocation:'middle',nameGap:44,nameTextStyle:{color:muted},axisLine:{show:false},axisTick:{show:false},axisLabel:{color:muted},splitLine:{lineStyle:{color:grid,type:'dashed'}}},
 {type:'category',gridIndex:1,data:estimates.map(e=>e.label),inverse:true,axisLabel:{color:muted,width:Math.min(width*.32,205),overflow:'truncate'},axisTick:{show:false},axisLine:{show:false}}],series};
}
