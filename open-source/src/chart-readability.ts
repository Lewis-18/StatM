import {color} from 'echarts';

export function luminance(background:string){
 const channels=(color.parse(background)||[255,255,255]).slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});
 return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;
}
export function contrastRatio(a:string,b:string){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)}
/** Use the same interpolated color as ECharts' continuous visual map. */
export function heatmapTextColor(value:number,stops:string[]){
 const fill=color.lerp(Math.max(0,Math.min(1,(value+1)/2)),stops)||stops[1];
 return contrastRatio('#000000',fill)>=contrastRatio('#ffffff',fill)?'#000000':'#ffffff';
}

/** Display styling only. Neither observations nor record identities are changed. */
export function scatterAppearance(points:number[][],width:number,height:number){
 const n=points.length;if(n<100)return {symbolSize:7.5,opacity:.82,borderWidth:1};
 let xMin=Infinity,yMin=Infinity,xMax=-Infinity,yMax=-Infinity;
 for(const point of points){xMin=Math.min(xMin,point[0]);xMax=Math.max(xMax,point[0]);yMin=Math.min(yMin,point[1]);yMax=Math.max(yMax,point[1])}
 const xSpan=xMax-xMin||1,ySpan=yMax-yMin||1;
 const columns=Math.max(8,Math.min(40,Math.floor(width/16))),rows=Math.max(8,Math.min(32,Math.floor(height/16)));
 const occupied=new Set(points.map(p=>`${Math.min(columns-1,Math.floor((p[0]-xMin)/xSpan*columns))}:${Math.min(rows-1,Math.floor((p[1]-yMin)/ySpan*rows))}`)).size;
 const area=Math.max(10000,width*height),crowding=n/Math.max(1,occupied);
 const symbolSize=Math.max(3,Math.min(7.5,Math.sqrt(area/n)*.42,10/Math.sqrt(Math.max(1,crowding/3))));
 const opacity=Math.max(.32,Math.min(.78,.82/Math.max(1,Math.sqrt(crowding/4),Math.sqrt(n/400))));
 return {symbolSize,opacity,borderWidth:symbolSize<5?.35:.7};
}
