import {figureHeading} from './figure-export';
import {format,type EChartsOption} from 'echarts';
import {figureTheme,figureBackground,type FigureTheme} from './chart-theme';
import {axisName,wrapLabel} from './chart-layout';
import type {ChartSpec} from './types';
import {groupColor,type PaletteName} from './chart-preferences';

export function facetHeight(width:number,count:number){return 100+Math.ceil(count/(width<520?1:2))*270}
export function facetOption(spec:ChartSpec,palette:PaletteName,theme:'light'|'dark',exporting:boolean,width:number,height:number,exportTheme?:FigureTheme):EChartsOption{
 theme=figureTheme(theme,exporting,exportTheme);
 const panels=spec.data.panels||[],hist=spec.data.mode==='histogram',edges=spec.data.edges||[];
 const heading=figureHeading(spec.title,'',width);
 const columns=width<520?1:2,rows=Math.ceil(panels.length/columns),top=exporting?heading.plotTop:42,bottom=42;
 const rowHeight=(height-top-bottom)/Math.max(1,rows),cellWidth=width/columns;
 const text=theme==='light'?'#263348':'#dbe4ef',muted=theme==='light'?'#536379':'#a5b2c3',line=theme==='light'?'#e8edf3':'#2c3848';
 const peak=Math.max(...panels.flatMap(p=>(p.counts||[]).map(n=>spec.data.proportion?n/p.n:n)),1e-10)*1.06;const unit=10**Math.floor(Math.log10(peak))/2;const yMax=hist?(spec.data.proportion?Math.ceil(peak/unit)*unit:Math.max(1,Math.ceil(Math.ceil(peak/unit)*unit))):undefined;
 const range=(bounds?:number[])=>{if(!bounds)return {};const pad=(bounds[1]-bounds[0]||Math.max(1,Math.abs(bounds[0])*.1))*.04;return {min:bounds[0]-pad,max:bounds[1]+pad}};
 const grid=panels.map((_,i)=>({left:(i%columns)*cellWidth+58,right:width-(i%columns+1)*cellWidth+22,top:top+Math.floor(i/columns)*rowHeight+32,height:Math.max(60,rowHeight-110)}));
 const title=panels.map((p,i)=>({text:wrapLabel(`${String.fromCharCode(97+i)}  ${p.name} · n=${p.n}${p.shown!==p.n?` (${p.shown})`:''}`,cellWidth-76,12),left:(i%columns)*cellWidth+52,top:top+Math.floor(i/columns)*rowHeight,textStyle:{color:text,fontSize:12,width:cellWidth-76,overflow:'break' as const}}));
 if(exporting)title.unshift({text:heading.text,left:24,top:20,textStyle:{color:text,fontSize:17,width:width-48,overflow:'break'}});
 const axis={nameLocation:'middle' as const,nameTextStyle:{color:muted,fontSize:11},axisLabel:{color:muted,fontSize:10,hideOverlap:true},axisLine:{show:false},axisTick:{show:false},splitLine:{lineStyle:{color:line,type:'dashed' as const}},splitNumber:3};
 return {animation:false,backgroundColor:figureBackground(theme,exporting),textStyle:{fontFamily:'Inter, Microsoft YaHei, sans-serif'},title,grid,
  xAxis:panels.map((_,i)=>({...axis,type:hist?'category':'value',gridIndex:i,name:axisName(spec.xLabel,cellWidth-100),nameGap:32,...(hist?{data:edges.slice(0,-1).map((e,j)=>String(Number(((e+edges[j+1])/2).toPrecision(4)))),axisLabel:{...axis.axisLabel,interval:Math.max(0,Math.floor((edges.length-1)/4))},splitLine:{show:false}}:range(spec.data.x_range))})),
  yAxis:panels.map((_,i)=>({...axis,type:'value',gridIndex:i,name:axisName(spec.yLabel,rowHeight-110),nameGap:40,axisLabel:{...axis.axisLabel,formatter:(v:number)=>spec.data.proportion?`${Number((v*100).toPrecision(4))}%`:String(Number(v.toPrecision(5)))},...(hist?{min:0,max:yMax,...(!spec.data.proportion?{minInterval:1}:{})}:range(spec.data.y_range))})),
  tooltip:{trigger:'item',confine:true,formatter:(raw:unknown)=>{const p=raw as {seriesIndex:number;data:unknown;dataIndex:number};const panel=panels[p.seriesIndex];return `${format.encodeHTML(panel.name)}<br/>${hist?`${format.encodeHTML(String(edges[p.dataIndex]))} ≤ x ${p.dataIndex===edges.length-2?'≤':'<'} ${format.encodeHTML(String(edges[p.dataIndex+1]))}<br/>${p.data}`:format.encodeHTML(String(p.data))}`}},
  series:panels.map((p,i)=>({type:hist?'bar':'scatter',xAxisIndex:i,yAxisIndex:i,symbolSize:5,itemStyle:{color:groupColor(palette,theme,i),opacity:.8},...(hist?{barWidth:'98%'}:{}),data:hist?(p.counts||[]).map(n=>spec.data.proportion?n/p.n:n):p.points||[]}))};
}
