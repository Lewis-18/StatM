import {figurePresets,type FigurePresetName} from './chart-preferences';

export function figureSize(name:FigurePresetName,canvasHeight:number,canvasWidth=1100){
 const {widthMm,dpi}=figurePresets[name];
 const widthPx=Math.round(widthMm/25.4*dpi);
 const heightPx=Math.round(widthPx*canvasHeight/canvasWidth);
 return {widthMm,heightMm:widthMm*canvasHeight/canvasWidth,widthPx,heightPx,dpi};
}

export function sizeVectorFigure(svg:SVGSVGElement,name:FigurePresetName,canvasHeight:number,canvasWidth=1100){
 const dimensions=figureSize(name,canvasHeight,canvasWidth);
 svg.setAttribute('viewBox',`0 0 ${canvasWidth} ${canvasHeight}`);
 svg.setAttribute('width',`${dimensions.widthMm}mm`);
 svg.setAttribute('height',`${dimensions.heightMm.toFixed(3)}mm`);
 return dimensions;
}

// Both presets use the same physical font scale: 12 logical px is about 7.3 pt.
export function figureCanvasWidth(name:FigurePresetName){return name==='column'?420:840}
export function figureHeading(title:string,caption:string,width:number){
 
 const wrap=(value:string,capacity:number)=>{const lines:string[]=[];let line='',used=0;const tokens=value.match(/[A-Za-z0-9]+(?:[.,][0-9]+)*|./gu)||[];for(const token of tokens){const size=[...token].reduce((sum,char)=>sum+(char.charCodeAt(0)>255?2:1),0);if(used&&used+size>capacity){lines.push(line.trimEnd());line='';used=0}if(size>capacity){for(const char of token){if(used>=capacity){lines.push(line);line='';used=0}line+=char;used++}}else if(line||token.trim()){line+=token;used+=size}}if(line)lines.push(line.trimEnd());return lines.join('\n')};
 const text=wrap(title,Math.floor((width-48)/9)),subtext=wrap(caption,Math.floor((width-48)/7));
 return {text,subtext,plotTop:24+text.split('\n').length*22+subtext.split('\n').length*17+24};
}

// PNG pHYs uses integer pixels/metre. Set it explicitly so layout tools recognise 300 DPI.
export async function withPngResolution(blob:Blob,dpi:number):Promise<Blob>{
 const bytes=new Uint8Array(await blob.arrayBuffer());
 const signature=[137,80,78,71,13,10,26,10];
 if(signature.some((value,index)=>bytes[index]!==value))throw new Error('PNG 文件格式无效');
 const reader=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 const parts:Uint8Array[]=[bytes.subarray(0,8)];
 const chunk=new Uint8Array(21),view=new DataView(chunk.buffer);
 view.setUint32(0,9);chunk.set([112,72,89,115],4);
 const pixelsPerMetre=Math.round(dpi*1000/25.4);
 view.setUint32(8,pixelsPerMetre);view.setUint32(12,pixelsPerMetre);chunk[16]=1;
 let crc=0xffffffff;
 for(let i=4;i<17;i++){
  crc^=chunk[i];
  for(let bit=0;bit<8;bit++)crc=crc&1?(crc>>>1)^0xedb88320:crc>>>1;
 }
 view.setUint32(17,(crc^0xffffffff)>>>0);
 let offset=8,inserted=false;
 while(offset+12<=bytes.length){
  const length=reader.getUint32(offset);
  const end=offset+12+length;
  if(end>bytes.length)throw new Error('PNG 数据不完整');
  const type=String.fromCharCode(...bytes.subarray(offset+4,offset+8));
  if(type!=='pHYs')parts.push(bytes.subarray(offset,end));
  if(type==='IHDR'){parts.push(chunk);inserted=true}
  offset=end;
  if(type==='IEND')break;
 }
 if(!inserted)throw new Error('PNG 缺少图像头');
 return new Blob(parts.map(part=>new Uint8Array(part)),{type:'image/png'});
}
