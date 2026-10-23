import {format,graphic,type EChartsOption,type ScatterSeriesOption} from 'echarts';
import {figureTheme,figureBackground,type FigureTheme} from './chart-theme';
import {axisName,wrapLabel} from './chart-layout';
import type {ChartSpec} from './types';
import {figureHeading} from './figure-export';
import {groupColor,palettes,type PaletteName} from './chart-preferences';

export interface BubbleView{layout:'overlay'|'facet';finish:'gradient'|'flat';scale:number;labels:boolean}
export const defaultBubbleView:BubbleView={layout:'overlay',finish:'gradient',scale:1,labels:false};
export function bubbleColumns(width:number,groups:number){return Math.min(groups,width<560?1:width<800?2:3)}
export function bubbleHeight(width:number,groups:number,view:BubbleView){return view.layout==='facet'&&groups>1?Math.ceil(groups/bubbleColumns(width,groups))*330+140:Math.max(420,Math.min(620,width*.65))}
const number=(value:number)=>value.toLocaleString(undefined,{maximumSignificantDigits:4});
const key=(value:number[])=>JSON.stringify(value.slice(0,2));
function tint(hex:string,amount:number){const digits=hex.replace('#','');return '#'+[0,2,4].map(i=>Math.round(parseInt(digits.slice(i,i+2),16)*(1-amount)+255*amount).toString(16).padStart(2,'0')).join('')}

export function bubbleOption(spec:ChartSpec,palette:PaletteName,theme:'light'|'dark',exporting=false,width=600,height=420,view=defaultBubbleView,exportTheme?:FigureTheme):EChartsOption{
 theme=figureTheme(theme,exporting,exportTheme);
 const light=theme==='light',text=light?'#263348':'#dbe4ef',muted=light?'#57677b':'#a4b2c4',gridColor=light?'#e1e7ed':'#314057',panel=light?'#fff':'#151f2d';
 const d=spec.data,points=d.points||[],groups=d.categories?.length?d.categories:['全部样本'];
 const faceted=view.layout==='facet'&&groups.length>1,columns=faceted?bubbleColumns(width,groups.length):1,rows=faceted?Math.ceil(groups.length/columns):1;
 const caption=`面积 ∝ ${spec.zLabel||'第三变量'} · n=${d.n??points.length}${d.shown!==undefined&&d.shown!==d.n?' · 显示 '+d.shown:''} · 零面积隐藏`;
 const heading=figureHeading(spec.title,caption,width);
 const top=exporting?heading.plotTop+28:faceted?30:groups.length>1?34:14,bottom=faceted?110:150;
 const plotWidth=(width-76)/columns-38,plotHeight=Math.max(110,(height-top-bottom)/rows-(faceted?88:24));
 const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
 const extent=(values:number[])=>{const min=Math.min(...values),max=Math.max(...values);return {min:Number.isFinite(min)?min:0,max:Number.isFinite(max)?max:1,span:max-min||Math.max(Math.abs(min)*.1,1)}};
 const x=extent(xs),y=extent(ys),positive=points.filter(p=>p[2]>0);
 const cells=new Set(positive.map(p=>`${Math.floor((p[0]-x.min)/x.span*24)},${Math.floor((p[1]-y.min)/y.span*16)}`)).size;
 // One common scale across all groups and facets: diameter squared stays proportional to area.
 const diameter=Math.max(12,Math.min(58,Math.sqrt(Math.max(1,plotWidth*plotHeight)/Math.max(1,positive.length/(faceted?groups.length:1)))*.55,52/Math.sqrt(Math.max(1,positive.length/Math.max(1,cells)))))*view.scale;
 const sizeMax=d.size_max??Math.max(0,...points.map(p=>p[2]));
 const size=(value:number[])=>sizeMax>0?diameter*Math.sqrt(Math.max(0,value[2])/sizeMax):0;
 const xPad=x.span*Math.max(.07,diameter/Math.max(100,plotWidth)/2),yPad=y.span*Math.max(.09,diameter/Math.max(100,plotHeight)/2);
 const overlaps=new Map<string,number[]>();points.forEach((p,i)=>{if(p[2]>0)overlaps.set(key(p),[...(overlaps.get(key(p))||[]),i])});
 const color=(i:number)=>groups.length===1?palettes[palette][theme]:groupColor(palette,theme,i);
 const grids=Array.from({length:faceted?groups.length:1},(_,i)=>({left:54+(i%columns)*(width-24)/columns,right:width-(54+(i%columns)*(width-24)/columns+plotWidth),top:top+Math.floor(i/columns)*(height-top-bottom)/rows+24,bottom:height-(top+Math.floor(i/columns)*(height-top-bottom)/rows+24+plotHeight)}));
 const axis=(dimension:'x'|'y',index:number)=>({type:'value' as const,gridIndex:index,name:axisName(dimension==='x'?spec.xLabel:spec.yLabel,dimension==='x'?plotWidth:plotHeight),nameLocation:'middle' as const,nameGap:dimension==='x'?34:40,nameTextStyle:{color:muted,fontSize:12},min:dimension==='x'?x.min-xPad:y.min-yPad,max:dimension==='x'?x.max+xPad:y.max+yPad,splitNumber:4,axisLabel:{color:muted,fontSize:12,hideOverlap:true,showMinLabel:false,showMaxLabel:false,formatter:number},axisTick:{show:false},axisLine:{show:true,lineStyle:{color:gridColor}},splitLine:{lineStyle:{color:gridColor,type:'dashed' as const}}});
 const series:ScatterSeriesOption[]=groups.map((g,i)=>({name:g,type:'scatter',xAxisIndex:faceted?i:0,yAxisIndex:faceted?i:0,symbol:'circle',symbolSize:size,
  data:points.map((value,j)=>({value,name:d.labels?.[j]||`记录 ${j+1}`,group:d.groups?.[j]||groups[0]})).filter(p=>p.group===g).sort((a,b)=>b.value[2]-a.value[2]),
  itemStyle:{color:view.finish==='gradient'&&palette!=='grayscale'?new graphic.RadialGradient(.35,.3,1,[{offset:0,color:tint(color(i),.42)},{offset:1,color:color(i)}]):color(i),opacity:positive.length>100?.52:.76,borderColor:color(i),borderWidth:.8,shadowBlur:!exporting&&positive.length<80&&view.finish==='gradient'?5:0,shadowOffsetY:2,shadowColor:light?'rgba(38,51,72,.12)':'rgba(0,0,0,.15)'},
  label:{show:view.labels,position:'top',fontSize:11,color:text,formatter:p=>p.name.length>20?p.name.slice(0,18)+'…':p.name},labelLayout:{hideOverlap:true},
  emphasis:{focus:'series',scale:false,itemStyle:{opacity:1,borderColor:text,borderWidth:1.5},label:{show:true,position:'top',color:text,formatter:p=>p.name.length>28?p.name.slice(0,26)+'…':p.name}},
  tooltip:{formatter:(params:unknown)=>{const p=params as {value:number[];name:string};const ids=overlaps.get(key(p.value))||[];return `<strong>${format.encodeHTML(p.name)}</strong><br/>${format.encodeHTML(g)}<br/>`+[spec.xLabel,spec.yLabel,spec.zLabel].map((label,k)=>`${format.encodeHTML(label||'')}: <b>${number(p.value[k])}</b>`).join('<br/>')+(ids.length>1?`<br/><br/>同一 X / Y 坐标：${ids.length} 条记录<br/>`+ids.slice(0,6).map(j=>`${format.encodeHTML(d.labels?.[j]||`记录 ${j+1}`)} · ${format.encodeHTML(d.groups?.[j]||groups[0])} · ${number(points[j][2])}`).join('<br/>')+(ids.length>6?'<br/>…':''):'')}}}));
 const graphics:NonNullable<EChartsOption['graphic']>=[];
 if(faceted)groups.forEach((g,i)=>graphics.push({type:'text',left:grids[i].left,top:grids[i].top-25,style:{text:wrapLabel(g,plotWidth,12),fill:color(i),fontSize:12,fontWeight:600,lineHeight:15}}));
 const legendY=height-48,legendText=spec.zLabel||'面积',legendStart=width<480?24:54;
 graphics.push({type:'text',left:legendStart,top:legendY-34,style:{text:`气泡面积：${legendText.length>28?legendText.slice(0,26)+'…':legendText}`,fill:muted,fontSize:12}});
 if(sizeMax>0)[sizeMax/16,sizeMax/4,sizeMax].forEach((value,i)=>{const cx=legendStart+14+i*Math.min(115,(width-130)/3),r=size([0,0,value])/2;graphics.push({type:'circle',shape:{cx,cy:legendY,r},style:{fill:light?'#eaf0f5':'#25364b',stroke:muted,lineWidth:1}},{type:'text',left:cx+r+8,top:legendY-6,style:{text:number(value),fill:muted,fontSize:12}})});
 else graphics.push({type:'text',left:'center',top:'middle',style:{text:'面积值全部为 0，没有可见气泡',fill:muted,fontSize:13}});
 return {animation:false,animationDuration:180,backgroundColor:figureBackground(theme,exporting),textStyle:{fontFamily:'Inter, Microsoft YaHei, Noto Sans SC, sans-serif',color:text},
  title:exporting?{text:heading.text,subtext:heading.subtext,left:24,top:18,textStyle:{color:text,fontSize:18,lineHeight:22},subtextStyle:{color:muted,fontSize:12,lineHeight:17}}:undefined,
  legend:{show:!faceted&&groups.length>1,type:exporting?'plain':'scroll',top:exporting?heading.plotTop-3:4,left:'center',icon:'circle',itemWidth:10,itemHeight:10,textStyle:{color:muted,fontSize:12},pageTextStyle:{color:muted}},
  tooltip:{trigger:'item',confine:true,backgroundColor:panel,borderColor:gridColor,textStyle:{color:text,fontSize:12}},
  aria:{enabled:true,label:{description:spec.title+'；'+caption}},grid:grids,xAxis:grids.map((_,i)=>axis('x',i)),yAxis:grids.map((_,i)=>axis('y',i)),series,graphic:graphics,
  dataZoom:exporting?[]:[{type:'inside',xAxisIndex:grids.map((_,i)=>i),yAxisIndex:grids.map((_,i)=>i),filterMode:'none',zoomOnMouseWheel:'ctrl',moveOnMouseMove:false}]};
}
