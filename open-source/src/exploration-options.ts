import {t,chartText} from './i18n';
import {scatterAppearance} from './chart-readability';
import {format,type EChartsOption} from 'echarts';
import {figureHeading} from './figure-export';
import {figureTheme,figureBackground,type FigureTheme} from './chart-theme';
import {fitCartesianLabels,axisName,wrapLabel} from './chart-layout';
import type {ChartSpec} from './types';
import {palettes,groupColor,groupSymbols,groupLineType,type PaletteName} from './chart-preferences';
import {bubbleOption} from './bubble-options';

const font='Inter, Microsoft YaHei, Noto Sans SC, sans-serif';
export function explorationInfo(spec:ChartSpec){
 if(spec.title==='EFA · 平行分析')return {title:spec.title,label:'探索性因子分析',caption:'观测特征值与置换分布的 95% 分位',tag:'EFA'};
 if(spec.kind==='category_bar'&&spec.yLabel==='有效样本占比')return {title:spec.title,label:'类别占比',caption:'各批有效样本内的比例',tag:'PROPORTIONS'};
 const names:Record<string,[string,string]>={scatter3d:['三维散点','拖动旋转 · 滚轮缩放 · PNG / PDF 导出当前视角'],bubble:['气泡图',`面积 ∝ ${spec.zLabel} · 零面积记录隐藏`],parallel:['平行坐标','各轴使用原始单位 · 沿轴拖动筛选'],grouped_box:['箱线与观测点','Q1–Q3 · 1.5 IQR 须线 · 每组最多 160 个排序观测点'],violin:['小提琴组合','Gaussian KDE / Scott · 等最大宽度 · 箱线与真实观测点'],category_bar:['分类频数','完整记录计数 · 各组并列比较']};
 const isProjection=spec.title.endsWith(' · 二维投影');
 if(!names[spec.kind]&&!spec.data.groups)return null;
 const [label,caption]=names[spec.kind]||[spec.title==='PC1 × PC2 · Scores'?'PCA 得分':isProjection?'二维投影':'散点图','每个点代表同一条完整记录；分组以颜色与点形区分'];
 return {title:spec.title.replace(' · 二维投影',''),label,caption:`${caption} · n=${spec.data.n?.toLocaleString()||'—'}${spec.data.shown!==undefined&&spec.data.shown!==spec.data.n?' · 显示 '+spec.data.shown.toLocaleString():''}`,tag:'EXPLORATION'};
}
export function explorationOption(spec:ChartSpec,palette:PaletteName,theme:'light'|'dark',exporting=false,width=600,canvasBackground?:string,exportTheme?:FigureTheme,height=420):EChartsOption|null{
 theme=figureTheme(theme,exporting,exportTheme);
 if(spec.kind==='bubble')return bubbleOption(spec,palette,theme,exporting,width,420,undefined,theme);
 if(!explorationInfo(spec))return null;
 const light=theme==='light',text=light?'#263348':'#dbe4ef',muted=light?'#57677b':'#a4b2c4',grid=light?'#e1e7ed':'#314057',background=light?'#ffffff':'#151f2d';
 const d=spec.data,info=explorationInfo(spec)!;
 const heading=figureHeading(chartText(spec,info.title),info.caption,width,false);
 const exportTop=heading.plotTop+Math.ceil((d.categories||[]).join('').length*10/Math.max(200,width-120))*25;
 const groups=d.categories||[t('全部样本')];
 const colorAt=(i:number)=>groups.length===1?palettes[palette][theme]:groupColor(palette,theme,i);
 const axis=(name?:string,authored=false)=>({type:'value' as const,name:axisName(authored?t(name||''):chartText(spec,name||''),width-130),nameLocation:'middle' as const,nameGap:width<480?34:45,nameTextStyle:{color:muted,fontSize:12},axisLabel:{color:muted,hideOverlap:true},axisLine:{show:false},axisTick:{show:false},splitLine:{lineStyle:{color:grid,type:'dashed' as const}},scale:true});
 const option:EChartsOption={animation:false,animationDuration:180,backgroundColor:figureBackground(theme,exporting),textStyle:{fontFamily:font,color:text},color:groups.map((_,i)=>colorAt(i)),
  title:exporting?{text:heading.text,subtext:heading.subtext,left:24,top:18,textStyle:{color:text,fontSize:18,lineHeight:22},subtextStyle:{color:muted,fontSize:12,lineHeight:17}}:undefined,
  tooltip:{trigger:'item',confine:true,backgroundColor:background,borderColor:grid,textStyle:{color:text}},
  aria:{enabled:true,label:{description:info.title+'；'+info.caption},decal:{show:palette==='grayscale'}},
  legend:{show:groups.length>1,type:exporting?'plain':'scroll',top:exporting?heading.plotTop-5:4,left:'center',textStyle:{color:muted},pageTextStyle:{color:muted}},
  grid:{left:width<480?55:76,right:30,top:exporting?exportTop:52,bottom:70},xAxis:axis(spec.xLabel),yAxis:axis(spec.yLabel)};
 if(spec.kind==='scatter3d'||spec.kind==='scatter'){
  const points=d.points||[],appearance=scatterAppearance(points,Math.max(100,width-110),Math.max(100,height-exportTop-70));
  const series=groups.map((g,i)=>({type:spec.kind==='scatter3d'?'scatter3D':'scatter',name:g,
   data:points.flatMap((v,j)=>d.groups?.[j]===g||!d.groups?[{value:v,name:d.labels?.[j]||String(j+1),rowId:d.row_ids?.[j]}]:[]),
   symbol:spec.kind==='scatter3d'?'circle':groupSymbols[i%groupSymbols.length],
   symbolSize:spec.kind==='scatter3d'?6:appearance.symbolSize,
   itemStyle:{color:colorAt(i),opacity:spec.kind==='scatter3d'?.85:appearance.opacity,borderColor:background,borderWidth:spec.kind==='scatter3d'?0:appearance.borderWidth},emphasis:{itemStyle:{opacity:1}},
   tooltip:{formatter:(p:unknown)=>{const v=p as {value:number[];name:string};return [format.encodeHTML(v.name),format.encodeHTML(g),...[spec.xLabel,spec.yLabel,spec.zLabel].slice(0,spec.kind==='scatter'?2:3).map((label,k)=>`${format.encodeHTML(label||'')}: ${Number(v.value[k]).toLocaleString(undefined,{maximumSignificantDigits:6})}`)].join('<br/>')}}}));
  if(spec.kind==='scatter3d'){
   const axis3d=(name?:string)=>({...axis(name),nameLocation:undefined,nameGap:20,axisLine:{show:true,lineStyle:{color:muted}},axisLabel:{color:muted,fontSize:12},splitLine:{show:true,lineStyle:{color:grid}}});
   return {...option,xAxis:undefined,yAxis:undefined,grid:undefined,xAxis3D:axis3d(spec.xLabel),yAxis3D:axis3d(spec.yLabel),zAxis3D:axis3d(spec.zLabel),grid3D:{top:exporting?exportTop:40,height:exporting?'60%':'84%',boxWidth:100,boxDepth:90,boxHeight:85,environment:canvasBackground||background,viewControl:{alpha:22,beta:35,distance:220,minDistance:100,maxDistance:400,projection:'perspective',autoRotate:false},light:{main:{intensity:1.1,shadow:false},ambient:{intensity:.5}}},series} as EChartsOption;
  }
  option.series=series as EChartsOption['series'];
  option.dataZoom=exporting?[]:[{type:'inside',filterMode:'none',zoomOnMouseWheel:'ctrl',moveOnMouseMove:false}];
 }else if(spec.kind==='parallel'){
  option.xAxis=undefined;option.yAxis=undefined;option.grid=undefined;
  option.parallel={left:60,right:60,top:exporting?exportTop+12:80,bottom:55,parallelAxisDefault:{type:'value',nameLocation:'end',nameGap:24,nameTextStyle:{color:muted,fontSize:12},axisLabel:{color:muted,fontSize:12},axisLine:{lineStyle:{color:grid}},axisTick:{show:false}}};
  option.parallelAxis=(d.dimensions||[]).map((name,dim)=>({dim,name:wrapLabel(name,Math.max(60,(width-120)/Math.max(1,(d.dimensions?.length||1))),11),type:'value',min:'dataMin',max:'dataMax'}));
  option.series=groups.map((g,i)=>({type:'parallel',name:g,lineStyle:{color:colorAt(i),type:groupLineType(i),width:1.2,opacity:.35},inactiveOpacity:.03,activeOpacity:.8,data:(d.points||[]).filter((_,j)=>d.groups?.[j]===g||!d.groups)}));
 }else if(spec.kind==='grouped_box'||spec.kind==='violin'){
  option.legend={show:false};option.xAxis={...axis(spec.xLabel),type:'category',data:groups,axisLabel:{color:muted,interval:0,rotate:groups.length>5?25:0}};
  option.xAxis={...option.xAxis as object,axisLabel:{color:muted,interval:0,rotate:groups.length>5?25:0,formatter:(v:string,i:number)=>v+(d.group_n?'\nn='+d.group_n[i]:'')}};
  const boxes:EChartsOption['series']=[{type:'boxplot',name:'四分位数与须线',boxWidth:spec.kind==='violin'?[10,20]:[22,65],data:(d.boxes||[]).map((value,i)=>({value,itemStyle:{color:colorAt(i)+'24',borderColor:colorAt(i),borderWidth:1.7}}))},
   {type:'scatter',name:'离群值',data:(d.values||[]).map(v=>({value:v,itemStyle:{color:colorAt(v[0])}})),symbol:'emptyCircle',symbolSize:7,itemStyle:{opacity:.85}},
   {type:'custom',name:'真实观测点',silent:true,z:3,data:(d.observations||[]).map((v,i)=>[v[0],v[1],i]),renderItem:(_params,api)=>{const category=Number(api.value(0)),[x,y]=api.coord([category,Number(api.value(1))]);const band=Math.abs((api.size!([1,0]) as number[])[0]);let hash=Math.imul(Number(api.value(2))+1,0x9e3779b1);hash^=hash>>>16;const jitter=((hash>>>0)%101)/100-.5;return {type:'circle',shape:{cx:x+jitter*Math.min(52,band*.55),cy:y,r:2.5},style:{fill:colorAt(category),stroke:background,lineWidth:.4,opacity:.6}}}}];
  const violins:EChartsOption['series']=spec.kind==='violin'?[{type:'custom',name:'核密度形状',silent:true,z:0,data:(d.densities||[]).map(v=>[v.group]),renderItem:(params,api)=>{const density=d.densities?.[params.dataIndex];if(!density?.points.length)return;const category=Number(api.value(0)),half=Math.min(60,Math.abs((api.size!([1,0]) as number[])[0])*.37);const side=(sign:number)=>density.points.map(([value,size])=>{const [x,y]=api.coord([category,value]);return [x+sign*half*size,y]});return {type:'polygon',shape:{points:[...side(1),...side(-1).reverse()]},style:{fill:colorAt(category)+'32',stroke:colorAt(category),lineWidth:1}}}}]:[];
  option.series=[...violins,...boxes];
 }else if(spec.kind==='category_bar'){
  option.yAxis={...axis(spec.yLabel,true),min:0,scale:false,minInterval:1};
  option.xAxis={...axis(spec.xLabel),type:'category',data:d.categories,axisLabel:{color:muted,interval:0,rotate:(d.categories?.length||0)>6?35:0}};
  option.legend={...option.legend as object,show:(d.series?.length||0)>1};
  option.series=(d.series||[]).map((s,i)=>({name:s.name,type:'bar',data:s.values,itemStyle:{color:d.series?.length===1?palettes[palette][theme]:groupColor(palette,theme,i)},barMaxWidth:35}));
 }
 return fitCartesianLabels(option,width);
}

