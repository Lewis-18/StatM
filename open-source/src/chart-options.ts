import type {EChartsOption,SeriesOption} from 'echarts';
import {format} from 'echarts';
import {figureHeading} from './figure-export';
import type {ChartSpec} from './types';
import {palettes,type PaletteName} from './chart-preferences';
import {explorationOption,explorationInfo} from './exploration-options';
import {bubbleOption,defaultBubbleView,type BubbleView} from './bubble-options';
import {estimationOption} from './estimation-options';

export type ChartTheme='light'|'dark';
const font='Inter, Microsoft YaHei, Noto Sans SC, sans-serif';
export function numberLabel(value:number|string):string {
 const n=Number(value);if(!Number.isFinite(n))return String(value);
 if(n===0)return '0';if(Math.abs(n)>=1e6)return (n/1e6).toLocaleString(undefined,{maximumFractionDigits:1})+'M';
 if(Math.abs(n)>=1e4)return (n/1000).toLocaleString(undefined,{maximumFractionDigits:1})+'k';
 if(Math.abs(n)<.001)return n.toExponential(1);
 return n.toLocaleString(undefined,{maximumFractionDigits:3});
}
export function chartInfo(spec:ChartSpec){
 if(spec.kind==='estimation')return {title:spec.title.replace(' · Estimation',''),label:'估计图',caption:`原始观测与均值差区间 · ${Number(((spec.data.confidence||.95)*100).toFixed(8))}% CI · ${spec.data.shown}/${spec.data.n}`,tag:'ESTIMATION'};
 const exploration=explorationInfo(spec);if(exploration)return exploration;
 const raw=spec.title;
 if(raw.endsWith(' · ECDF'))return {title:raw.replace(' · ECDF',''),label:'经验分布函数',caption:`累计比例 · n=${spec.data.n?.toLocaleString()||'—'}${(spec.data.ecdf_total_steps||0)>500?' · 显示 500 个阶梯节点':''}`,tag:'EMPIRICAL CDF'};
 if(raw.endsWith(' · Normal Q-Q'))return {title:raw.replace(' · Normal Q-Q',''),label:'正态 Q–Q',caption:`样本与正态分位数对照 · 参考线为线性拟合 · n=${spec.data.n?.toLocaleString()||'—'}`,tag:'NORMAL Q–Q'};
 if(raw.endsWith(' · Histogram'))return {title:raw.replace(' · Histogram',''),label:'直方图',caption:`频数分布 · 等宽分箱 · n=${spec.data.n?.toLocaleString()||'—'}`,tag:'DISTRIBUTION'};
 if(raw.endsWith(' · Density'))return {title:raw.replace(' · Density',''),label:'核密度曲线',caption:`Gaussian KDE · Scott 带宽 · n=${spec.data.n?.toLocaleString()||'—'}`,tag:'DENSITY'};
 if(raw.endsWith(' · Boxplot'))return {title:raw.replace(' · Boxplot',''),label:'箱线与观测点',caption:`四分位距 · 1.5 IQR 须线 · 观测点最多 160 / n=${spec.data.n?.toLocaleString()||'—'}`,tag:'BOX PLOT'};
 if(spec.kind==='heatmap')return {title:raw.replace(' · Correlation',''),label:'相关矩阵',caption:'相关系数 −1 至 +1 · 点击单元格查看详情',tag:'CORRELATION'};
 const titles:Record<string,{title:string;label:string;caption:string;tag:string}>={
  'Scree plot':{title:'主成分特征值',label:'碎石图',caption:'各主成分的方差贡献',tag:'EIGENVALUES'},
  'Cumulative variance':{title:'累计解释方差',label:'累计曲线',caption:'保留主成分与累计信息量',tag:'EXPLAINED VARIANCE'},
  'PC1 × PC2 · Scores':{title:'主成分空间',label:'PC1 × PC2',caption:'每个点代表一个观测样本',tag:'SCORES'},
  'PC1 × PC2 · Loadings':{title:'变量载荷',label:'PC1 × PC2',caption:'箭头从原点指向各变量的真实载荷',tag:'LOADINGS'},
  'Residual vs Fitted':{title:'残差与拟合值',label:'回归诊断',caption:'虚线表示零残差',tag:'RESIDUAL VS FITTED'},
  'Normal Q–Q':{title:'残差正态 Q–Q',label:'回归诊断',caption:'理论正态分位数与观测残差分位数',tag:'NORMAL Q–Q'},
  "Cook’s Distance":{title:'观测影响程度',label:'回归诊断',caption:'各观测的 Cook 距离',tag:"COOK’S DISTANCE"},
  'Residuals':{title:'残差序列',label:'回归诊断',caption:'按观测顺序展示 · 不作曲线平滑',tag:'RESIDUALS'},
 };
 return titles[raw]||{title:raw,label:spec.kind==='scatter'?'散点图':'频数图',caption:spec.kind==='scatter'?'每个点代表一个观测样本':'各类别的观测频数',tag:spec.kind==='scatter'?'SCATTER PLOT':'FREQUENCY'};
}
export function makeChartOption(spec:ChartSpec,palette:PaletteName,theme:ChartTheme,zoom=false,exporting=false,width=600,height=420,bubbleView:BubbleView=defaultBubbleView):EChartsOption {
 if(spec.kind==='estimation')return estimationOption(spec,palette,theme,exporting,width);
 if(spec.kind==='bubble')return bubbleOption(spec,palette,theme,exporting,width,height,bubbleView);
 const exploration=explorationOption(spec,palette,theme,exporting,width);if(exploration)return exploration;
 const light=theme==='light';const color=palettes[palette][theme];
 const text=light?'#263348':'#dbe4ef',muted=light?'#69788c':'#8d9caf',grid=light?'#e8edf3':'#263243',panel=light?'#ffffff':'#151f2d';
 const neutral=light?'#f0f3f7':'#263448';const negative=palettes[palette].negative;
 const d=spec.data,info=chartInfo(spec);const small=width<480;
 const heading=figureHeading(info.title+' · '+info.label,info.caption,width);
 const density=spec.title.endsWith(' · Density'),ecdf=spec.title.endsWith(' · ECDF'),histogram=spec.title.endsWith(' · Histogram'),cumulative=spec.title==='Cumulative variance',loadings=spec.title==='PC1 × PC2 · Loadings';
 const xTitle=spec.xLabel||(histogram||density||ecdf?info.title:undefined);
 const yTitle=spec.yLabel||(histogram?'频数':density?'密度':ecdf?'累计比例':spec.kind==='boxplot'?info.title:undefined);
 const residual=spec.title==='Residuals'||spec.title==='Residual vs Fitted';
 const split={show:true,lineStyle:{color:grid,type:'dashed' as const,width:1}};
 const axisLine={show:false};const axisTick={show:false};const nameTextStyle={color:muted,fontSize:12,padding:[0,0,0,0]};
 const option:EChartsOption={
  animation:false,animationDuration:200,animationDurationUpdate:180,
  backgroundColor:exporting?'#ffffff':'transparent',color:[color,palettes[palette].secondary],
  textStyle:{color:text,fontFamily:font,fontSize:12},
  aria:{enabled:true,label:{description:spec.title}},
  title:exporting?{text:heading.text,subtext:heading.subtext,left:30,top:20,textStyle:{color:text,fontFamily:font,fontSize:18,lineHeight:22,fontWeight:600},subtextStyle:{color:muted,fontFamily:font,fontSize:12,lineHeight:17}}:undefined,
  tooltip:{trigger:'item',confine:true,backgroundColor:panel,borderColor:grid,borderWidth:1,padding:[12,16],textStyle:{color:text,fontSize:12,fontFamily:font},extraCssText:'border-radius:8px;box-shadow:0 8px 32px rgba(0,0,0,.14);line-height:1.8;',axisPointer:{type:'line',lineStyle:{color:muted,type:'dashed'}}},
  grid:{left:small?56:76,right:small?26:34,top:exporting?heading.plotTop:34,bottom:zoom&&!exporting?116:76},
  xAxis:{type:'category',data:d.x,axisLine,axisTick,axisLabel:{color:muted,fontSize:12,margin:14,hideOverlap:true,formatter:(v:string)=>numberLabel(v)},name:xTitle,nameLocation:'middle',nameGap:42,nameTextStyle,splitLine:{show:false}},
  yAxis:{type:'value',name:yTitle,nameLocation:'middle',nameGap:small?38:52,nameTextStyle,axisLine,axisTick,axisLabel:{color:muted,fontSize:12,margin:12,formatter:(v:number)=>numberLabel(v)},splitLine:split,splitNumber:4},
  dataZoom:exporting?[]:[{type:'inside',zoomOnMouseWheel:'ctrl',moveOnMouseMove:false,filterMode:'none'},...(zoom?[{type:'slider' as const,height:17,bottom:18,borderColor:'transparent',backgroundColor:neutral,fillerColor:color+'25',handleSize:'95%',handleStyle:{color,borderColor:panel},dataBackground:{lineStyle:{color:muted,opacity:.2},areaStyle:{opacity:0}},selectedDataBackground:{lineStyle:{color,opacity:.3},areaStyle:{opacity:.1}},textStyle:{color:muted,fontSize:10},brushSelect:false,showDetail:false}]:[])],
 };
 const zeroLine={silent:true,symbol:'none',label:{show:false},lineStyle:{color:muted,width:1,type:'dashed' as const},data:[{yAxis:0}]};
 if(spec.kind==='scatter'){
  option.xAxis={type:'value',name:spec.xLabel,nameLocation:'middle',nameGap:42,nameTextStyle,scale:!loadings,axisLine,axisTick,axisLabel:{color:muted,fontSize:12,margin:14,formatter:(v:number)=>numberLabel(v)},splitLine:{show:loadings,...(loadings?split:{})},splitNumber:4};
  const points=d.points||[];
  const scatter:SeriesOption={type:'scatter',name:info.title,symbolSize:points.length>500?5.5:loadings?8:7.5,
   itemStyle:{color,opacity:loadings?1:.76,borderColor:panel,borderWidth:1},emphasis:{scale:1.5,itemStyle:{opacity:1,borderColor:light?'#263348':'#ffffff',borderWidth:1.5}},
   data:points.map((v,i)=>({value:v,name:d.labels?.[i]})),
   label:{show:loadings,position:'top',distance:9,color:text,fontSize:12,formatter:p=>p.name.length>24?p.name.slice(0,22)+'…':p.name},labelLayout:{hideOverlap:true},
   markLine:residual?zeroLine:undefined};
  option.series=[scatter];
  if(d.trend&&!loadings)option.series=[{type:'line',name:'正态参考线',data:d.trend,symbol:'none',lineStyle:{color:palettes[palette].secondary,width:2,type:'dashed'},tooltip:{show:false}},scatter];
  if(loadings){
   option.series=[{type:'lines',coordinateSystem:'cartesian2d',z:1,silent:true,polyline:false,symbol:['none','arrow'],symbolSize:7,lineStyle:{color,width:1.8,opacity:.85},data:points.map(v=>({coords:[[0,0],v]}))},scatter];
  }
 }else if(spec.kind==='heatmap'){
  const labels=d.labels||[];const n=labels.length;const side=small?78:Math.min(145,Math.max(95,...labels.map(v=>v.length*5.5)));
  const tick=(v:string)=>v.length>18?v.slice(0,16)+'…':v;
  option.grid={left:side,right:24,top:exporting?heading.plotTop:26,bottom:n>5?132:106};
  option.xAxis={type:'category',data:labels,axisLine,axisTick,axisLabel:{color:muted,fontSize:12,rotate:n>4?30:0,margin:14,formatter:tick}};
  option.yAxis={type:'category',data:labels,inverse:true,axisLine,axisTick,axisLabel:{color:muted,fontSize:12,margin:12,formatter:tick}};
  option.visualMap={dimension:2,min:-1,max:1,orient:'horizontal',left:'center',bottom:18,itemWidth:10,itemHeight:Math.min(200,width-150),calculable:false,precision:1,text:['+1','−1'],textGap:9,inRange:{color:[negative,neutral,color]},textStyle:{color:muted,fontSize:12}};
  option.dataZoom=[];
  option.tooltip={...option.tooltip,formatter:(params:unknown)=>{const p=params as {data:{value:number[]}};const v=p.data.value;return `<strong>${format.encodeHTML(labels[v[1]]||'')} × ${format.encodeHTML(labels[v[0]]||'')}</strong><br/>r <b>${v[2].toFixed(4)}</b><br/>p ${v[3].toPrecision(4)}<br/>n ${v[4].toLocaleString()}`}};
  option.series=[{type:'heatmap',data:(d.values||[]).map(v=>({value:v,label:{color:light&&Math.abs(v[2])>.65?'#fff':text}})),itemStyle:{borderColor:panel,borderWidth:n>10?2:4,borderRadius:4},label:{show:n<=12,fontSize:n<=5?16:12,fontWeight:500,formatter:p=>Number((p.data as {value:number[]}).value[2]).toFixed(2)},emphasis:{itemStyle:{borderColor:text,borderWidth:2}}}];
 }else if(spec.kind==='boxplot'){
  option.xAxis={type:'category',data:d.labels,axisLine,axisTick,axisLabel:{color:muted,fontSize:12,margin:16}};
  option.series=[{type:'boxplot',name:info.title,data:d.values,boxWidth:[36,90],itemStyle:{color:color+'24',borderColor:color,borderWidth:2},emphasis:{itemStyle:{borderWidth:3}}},{type:'custom',name:'观测点样本',silent:true,z:2,data:(d.samples||[]).map((v,i)=>[i,v]),renderItem:(_params,api)=>{const [x,y]=api.coord([0,Number(api.value(1))]);let hash=Math.imul(Number(api.value(0))+1,0x9e3779b1);hash^=hash>>>16;hash=Math.imul(hash,0x85ebca6b);hash^=hash>>>13;return {type:'circle',shape:{cx:x+((hash>>>0)%71)-35,cy:y,r:2.5},style:{fill:palettes[palette].secondary,opacity:.65}}}},{type:'scatter',name:'离群点',data:(d.outliers||[]).map(v=>[0,v]),symbolSize:6,itemStyle:{color:negative,opacity:.8}}];
 }else if(spec.kind==='bar'){
  option.series=[{type:'bar',name:info.title,data:d.y,barMaxWidth:histogram?70:46,barCategoryGap:histogram?'4%':'40%',itemStyle:{color,borderRadius:histogram?[2,2,0,0]:[4,4,0,0],opacity:.85},emphasis:{itemStyle:{opacity:1,color}},label:{show:!histogram&&(d.y?.length||0)<10,position:'top',distance:10,color:muted,fontSize:12,formatter:p=>numberLabel(Number(p.value))}}];
 }else{
  if(density||ecdf){option.xAxis={type:'value',scale:true,axisLine,axisTick,axisLabel:{color:muted,fontSize:12,margin:14,formatter:(v:number)=>numberLabel(v)},splitLine:{show:false},splitNumber:4,name:xTitle,nameLocation:'middle',nameGap:42,nameTextStyle};}
  if(cumulative||ecdf){option.yAxis={type:'value',min:0,max:1,interval:.25,axisLine,axisTick,axisLabel:{color:muted,fontSize:12,margin:12,formatter:(v:number)=>Math.round(v*100)+'%'},splitLine:split,name:ecdf?yTitle:undefined,nameLocation:'middle',nameGap:small?38:52,nameTextStyle};}
  const xy=density||ecdf?(d.y||[]).map((v,i)=>[Number(d.x?.[i]),v]):[];
  if(ecdf&&xy.length)xy.unshift([xy[0][0],0]);
  option.series=[{type:'line',name:info.title,data:density||ecdf?xy:d.y,smooth:false,step:ecdf?'end':undefined,symbol:cumulative?'circle':'none',symbolSize:7,lineStyle:{width:2.3,color},itemStyle:{color,borderColor:panel,borderWidth:2},areaStyle:density||cumulative?{color,opacity:light?.08:.1}:undefined,label:{show:cumulative&&(d.y?.length||0)<=8,position:'top',distance:10,fontSize:12,color:muted,formatter:p=>(Number(p.value)*100).toFixed(1)+'%'},markLine:residual?zeroLine:undefined}];
 }
 return option;
}
