import type {ChartSpec} from './types';
export type ChartTranslator=(value:string)=>string;
let translate:ChartTranslator=value=>value;
/** Install the host's synchronous translation function; return the previous one. */
export function setChartTranslator(next:ChartTranslator){const previous=translate;translate=next;return previous}
export function t(value:string){return translate(value)}
export function chartNames(spec:ChartSpec):string[]{
 const authored=spec.title==='校正题总相关'||spec.title.startsWith('EFA ·');
 const countAxis=spec.kind==='facet'&&spec.data.mode==='histogram'||spec.kind==='category_bar';
 const qq=spec.title.endsWith(' · Normal Q-Q');
 const axes=authored?[]:countAxis?[spec.xLabel]:qq?[spec.yLabel]:[spec.xLabel,spec.yLabel,spec.zLabel];
 const suffix=[' · Histogram',' · Density',' · ECDF',' · Boxplot',' · Normal Q-Q',' · Estimation'].find(suffix=>spec.title.endsWith(suffix));
 return [...axes,...(suffix?[spec.title.slice(0,-suffix.length)]:[]),...(spec.data.labels||[]),...(spec.data.dimensions||[]),...(spec.data.groups||[]),...(spec.data.categories||[]),...(spec.data.x||[]),...(spec.title.startsWith('EFA ·')?[]:(spec.data.series||[]).map(s=>s.name))].filter((value):value is string=>typeof value==='string');
}
export function chartText(spec:ChartSpec,value:string){return chartNames(spec).includes(value)?value:t(value)}
