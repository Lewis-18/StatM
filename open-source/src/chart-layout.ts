import type {EChartsOption} from 'echarts';
import type {ChartSpec} from './types';
const font='Inter, Microsoft YaHei, Noto Sans SC, sans-serif';
let context:CanvasRenderingContext2D|null|undefined;
export function labelWidth(value:string,size=12,weight=400){
 if(context===undefined)context=typeof document==='undefined'?null:document.createElement('canvas').getContext('2d');
 if(context){context.font=`${weight} ${size}px ${font}`;return context.measureText(value).width}
 return [...value].reduce((sum,c)=>sum+(c.codePointAt(0)!>255?size:size*.6),0);
}
/** Wrap complete labels, including unbroken identifiers, without hiding characters. */
export function wrapLabel(value:string,width:number,size=12,weight=400){
 const lines:string[]=[];let line='';
 for(const char of String(value)){
  if(char==='\n'){lines.push(line);line='';continue}
  if(line&&labelWidth(line+char,size,weight)>Math.max(size*2,width)){
   const boundary=Math.max(line.lastIndexOf(' '),line.lastIndexOf('\t'));
   if(boundary>0&&boundary<line.length-1){lines.push(line.slice(0,boundary+1));line=line.slice(boundary+1)}
   else{lines.push(line);line=''}
  }
  line+=char;
 }
 if(line)lines.push(line);
 return lines.join('\n');
}
export function categoryLayout(labels:string[],width:number,size=12){
 const available=Math.max(40,width-112),slot=available/Math.max(1,labels.length);
 const limit=Math.max(38,Math.min(180,slot-8));
 const formatter=(value:string)=>wrapLabel(value,limit,size);
 const lines=Math.max(1,...labels.map(value=>formatter(value).split('\n').length));
 return {formatter,lines,bottom:Math.max(76,lines*(size+3)+50)};
}
export function axisName(value:string|undefined,width:number){
 return value?wrapLabel(value,Math.max(90,width),12):value;
}
type Axis={type?:string;data?:unknown[];name?:string;nameGap?:number;nameTextStyle?:Record<string,unknown>;axisLabel?:Record<string,unknown>};
type Grid={left?:number;right?:number;bottom?:number;top?:number;containLabel?:boolean};
export function fitCartesianLabels(option:EChartsOption,width:number,height=620):EChartsOption{
 const axes=option as unknown as {xAxis?:Axis|Axis[];yAxis?:Axis|Axis[];grid?:Grid|Grid[]};
 if(!axes.grid||Array.isArray(axes.grid))return option;
 const grid=axes.grid;
 for(const [dimension,value] of [['x',axes.xAxis],['y',axes.yAxis]] as const){
  if(!value||Array.isArray(value))continue;
  const label=axisName(value.name,dimension==='x'?width-130:Math.max(120,height-210));
  if(label){value.name=label;value.nameTextStyle={...value.nameTextStyle,lineHeight:15};
   if(dimension==='y'){const lines=label.split('\n').length;grid.left=Math.max(grid.left||56,52+lines*15)}}
  if(dimension==='x'&&value.type==='category'&&value.data?.length){
   const labels=value.data.map(v=>String(v));const layout=categoryLayout(labels,width);
   const previous=value.axisLabel?.formatter;
   value.axisLabel={...value.axisLabel,lineHeight:15,rotate:0,formatter:(v:string,i:number)=>layout.formatter(typeof previous==='function'?String(previous(v,i)):v),...(labels.length<=12?{interval:0}:{})};
   value.nameGap=26+layout.lines*15;
   grid.bottom=Math.max(grid.bottom||76,layout.bottom+Math.max(0,(label?.split('\n').length||1)-1)*15);
  }else if(dimension==='x'&&label){grid.bottom=Math.max(grid.bottom||76,61+label.split('\n').length*15)}
 }
 return option;
}
/** Reserve room for full category labels at the same physical font scale. */
export function figureChartHeight(spec:ChartSpec,width:number,base:number){
 const labels=spec.kind==='category_bar'||spec.kind==='grouped_box'||spec.kind==='violin'?spec.data.categories:
  spec.kind==='bar'?spec.data.x?.map(v=>String(v)):undefined;
 return labels?.length?Math.max(base,360+categoryLayout(labels,width).bottom):base;
}
