import {figureHeading} from './figure-export';
import {format,type EChartsOption} from 'echarts';
import {figureTheme,figureBackground,type FigureTheme} from './chart-theme';
import {axisName,wrapLabel} from './chart-layout';
import {t,chartText} from './i18n';
import {scatterAppearance} from './chart-readability';
import type {ChartSpec} from './types';
import {groupColor,type PaletteName} from './chart-preferences';

export type FacetLayout='full'|'compact';
export function canShareFacetAxes(spec:ChartSpec){
 const valid=(range?:number[])=>range?.length===2&&range.every(Number.isFinite)&&range[0]<=range[1];
 return spec.kind==='facet'&&(spec.data.mode==='histogram'?(spec.data.edges?.length||0)>1:!!valid(spec.data.x_range)&&!!valid(spec.data.y_range));
}
/** Measure complete titles first; all panels keep equal plotting areas. */
export function facetMetrics(spec:ChartSpec,width:number,exporting=false,layout:FacetLayout='full'){
 const panels=spec.data.panels||[],columns=width<520?1:2,rows=Math.ceil(panels.length/columns);
 const compact=layout==='compact'&&canShareFacetAxes(spec);
 const yName=axisName(spec.data.mode==='histogram'?t(spec.yLabel||'频数'):chartText(spec,spec.yLabel||''),160)||'',left=48+Math.max(1,yName.split('\n').length)*15,right=24;
 const gap=compact?28:left+20,plotWidth=(width-left-right-gap*(columns-1))/columns;
 const xName=axisName(chartText(spec,spec.xLabel||''),plotWidth)||'';
 const titles=panels.map((p,i)=>wrapLabel(String.fromCharCode(97+i)+'  '+p.name,plotWidth,12,600)+'\nn='+p.n+(p.shown!==undefined&&p.shown!==p.n?' · '+t('显示 {0}').replace('{0}',String(p.shown)):''));
 const showX=panels.map((_,i)=>!compact||i+columns>=panels.length),showY=panels.map((_,i)=>!compact||i%columns===0);
 const titleHeights=Array.from({length:rows},(_,r)=>Math.max(1,...titles.slice(r*columns,(r+1)*columns).map(text=>text.split('\n').length))*16+12);
 const axisHeights=Array.from({length:rows},(_,r)=>showX.slice(r*columns,(r+1)*columns).some(Boolean)?32+(xName?xName.split('\n').length*15:0):12);
 const heading=figureHeading(chartText(spec,spec.title),'',width,false),top=exporting?heading.plotTop:12;
 const overhead=top+12+titleHeights.reduce((a,b)=>a+b,0)+axisHeights.reduce((a,b)=>a+b,0)+Math.max(0,rows-1)*24;
 return {panels,columns,rows,compact,left,right,gap,plotWidth,xName,yName,titles,titleHeights,axisHeights,showX,showY,heading,top,overhead};
}
export function facetHeight(width:number,count:number,spec?:ChartSpec,exporting=false,layout:FacetLayout='full'){
 if(!spec)return 100+Math.ceil(count/(width<520?1:2))*270;
 const metrics=facetMetrics(spec,width,exporting,layout);return Math.ceil(metrics.overhead+Math.max(1,metrics.rows)*160);
}
export function facetOption(spec:ChartSpec,palette:PaletteName,theme:'light'|'dark',exporting:boolean,width:number,height:number,exportTheme?:FigureTheme,layout:FacetLayout='full'):EChartsOption{
 theme=figureTheme(theme,exporting,exportTheme);
 const m=facetMetrics(spec,width,exporting,layout),{panels,columns,rows,plotWidth}=m,hist=spec.data.mode==='histogram',edges=spec.data.edges||[];
 const plotHeight=Math.max(60,(height-m.overhead)/Math.max(1,rows));
 const text=theme==='light'?'#263348':'#dbe4ef',muted=theme==='light'?'#536379':'#a5b2c3',line=theme==='light'?'#e8edf3':'#2c3848';
 const peak=Math.max(...panels.flatMap(p=>(p.counts||[]).map(n=>spec.data.proportion?n/p.n:n)),1e-10)*1.06;
 const unit=10**Math.floor(Math.log10(peak))/2,yMax=hist?(spec.data.proportion?Math.ceil(peak/unit)*unit:Math.max(1,Math.ceil(Math.ceil(peak/unit)*unit))):undefined;
 const range=(bounds?:number[])=>{if(!bounds)return {};const pad=(bounds[1]-bounds[0]||Math.max(1,Math.abs(bounds[0])*.1))*.04;return {min:bounds[0]-pad,max:bounds[1]+pad}};
 const rowTops=Array.from({length:rows},(_,r)=>m.top+m.titleHeights.slice(0,r).reduce((a,b)=>a+b,0)+m.axisHeights.slice(0,r).reduce((a,b)=>a+b,0)+r*(plotHeight+24));
 const grid=panels.map((_,i)=>({left:m.left+(i%columns)*(plotWidth+m.gap),width:plotWidth,top:rowTops[Math.floor(i/columns)]+m.titleHeights[Math.floor(i/columns)],height:plotHeight}));
 const title=panels.map((_,i)=>({text:m.titles[i],left:grid[i].left,top:rowTops[Math.floor(i/columns)],padding:0,textStyle:{color:text,fontSize:12,fontWeight:600,lineHeight:16}}));
 const axis={nameLocation:'middle' as const,nameTextStyle:{color:muted,fontSize:12,lineHeight:15},axisLabel:{color:muted,fontSize:10,hideOverlap:true,showMinLabel:false,showMaxLabel:false},axisLine:{show:false},axisTick:{show:false},splitLine:{lineStyle:{color:line,type:'dashed' as const}},splitNumber:3};
 return {animation:false,backgroundColor:figureBackground(theme,exporting),textStyle:{fontFamily:'Inter, Microsoft YaHei, sans-serif'},title:[...(exporting?[{text:m.heading.text,left:24,top:20,padding:0,textStyle:{color:text,fontSize:18,lineHeight:22}}]:[]),...title],grid,
  xAxis:panels.map((_,i)=>({...axis,type:hist?'category':'value',gridIndex:i,name:m.showX[i]?m.xName:'',nameGap:28,...(hist?{data:edges.slice(0,-1).map((e,j)=>String(Number(((e+edges[j+1])/2).toPrecision(4)))),splitLine:{show:false}}:range(spec.data.x_range)),axisLabel:{...axis.axisLabel,show:m.showX[i],...(hist?{interval:Math.max(0,Math.floor((edges.length-1)/4))}:{})}})),
  yAxis:panels.map((_,i)=>({...axis,type:'value',gridIndex:i,name:m.showY[i]?m.yName:'',nameGap:38,axisLabel:{...axis.axisLabel,show:m.showY[i],formatter:(v:number)=>spec.data.proportion?String(Number((v*100).toPrecision(4)))+'%':String(Number(v.toPrecision(5)))},...(hist?{min:0,max:yMax,...(!spec.data.proportion?{minInterval:1}:{})}:range(spec.data.y_range))})),
  tooltip:{trigger:'item',confine:true,formatter:(raw:unknown)=>{const p=raw as {seriesIndex:number;data:unknown;dataIndex:number};const panel=panels[p.seriesIndex];return format.encodeHTML(panel.name)+'<br/>'+(hist?format.encodeHTML(String(edges[p.dataIndex]))+' ≤ x '+(p.dataIndex===edges.length-2?'≤':'<')+' '+format.encodeHTML(String(edges[p.dataIndex+1]))+'<br/>'+p.data:format.encodeHTML(String(p.data)))}},
  series:panels.map((p,i)=>{const appearance=scatterAppearance(p.points||[],plotWidth,plotHeight);return {type:hist?'bar':'scatter',xAxisIndex:i,yAxisIndex:i,symbolSize:appearance.symbolSize,itemStyle:{color:groupColor(palette,theme,i),opacity:hist?.8:appearance.opacity},emphasis:{itemStyle:{opacity:1}},...(hist?{barWidth:'98%'}:{}),data:hist?(p.counts||[]).map(n=>spec.data.proportion?n/p.n:n):p.points||[]}})};
}
