"use client";
import {useSyncExternalStore} from 'react';
export const palettes = {
  science: {name:'科研蓝橙',dark:'#85b9e5',light:'#0072B2',secondary:'#D55E00',groups:['#0072B2','#D55E00','#009E73','#CC79A7','#8A6800','#56B4E9','#333333'],darkGroups:['#85b9e5','#EF9A63','#65C8A5','#DCABD2','#DDC169','#8FD7F4','#D5DBE3'],negative:'#D55E00',hint:'基于 Okabe–Ito；分组颜色配合点形阅读'},
  indigo: {name:'靛蓝',dark:'#9caeff',light:'#5264cc',secondary:'#168c82',groups:['#5264cc','#168c82','#b65f2f','#9b5692','#687e3c','#447fa4'],darkGroups:['#9caeff','#6fd5c4','#edbd79','#dca9d3','#c1d49c','#85b9e5'],negative:'#b65f2f',hint:'离散分类色板，配合点形区分分组'},
  teal: {name:'青绿',dark:'#6fd5c4',light:'#168c82',secondary:'#7663b0',groups:['#168c82','#7663b0','#b27628','#b15366','#337da4','#687e3c'],darkGroups:['#6fd5c4','#bca7e4','#edbd79','#e8a1b1','#85b9e5','#c1d49c'],negative:'#9b5692',hint:'青绿与紫色区分分组和正负方向'},
  amber: {name:'琥珀',dark:'#edbd79',light:'#b27628',secondary:'#337da4',groups:['#b27628','#337da4','#168c82','#9b5692','#5264cc','#b15366'],darkGroups:['#edbd79','#85b9e5','#6fd5c4','#dca9d3','#9caeff','#e8a1b1'],negative:'#337da4',hint:'暖色主色，搭配冷色比较'},
  muted: {name:'柔和分组',dark:'#a9c2d6',light:'#507c99',secondary:'#af625d',groups:['#507c99','#af625d','#67834d','#96729d','#a17b36','#548881'],darkGroups:['#a9c2d6','#dea8a3','#b3ca9d','#cfb3d4','#dfc18a','#a1cdc4'],negative:'#af625d',hint:'柔和分类色与深色轮廓，适用于白底图'},
  grayscale: {name:'灰度打印',dark:'#d5dbe3',light:'#303030',secondary:'#757575',groups:['#303030','#686868','#919191','#b6b6b6'],darkGroups:['#e3e3e3','#bcbcbc','#969696','#737373'],negative:'#888888',hint:'按点形、线型与填充纹理区分；相关矩阵保留正负数值'},
} as const;
export type PaletteName = keyof typeof palettes;
export const groupSymbols=['circle','rect','triangle','diamond','pin','arrow','roundRect','emptyCircle','emptyRect','emptyTriangle','emptyDiamond','emptyRoundRect'];
export function groupColor(palette:PaletteName,theme:'light'|'dark',index:number){const colors=theme==='light'?palettes[palette].groups:palettes[palette].darkGroups;return colors[index%colors.length]}
export function groupLineType(index:number){return (['solid','dashed','dotted'] as const)[index%3]}
const eventName='statlab-chart-style';
function subscribe(callback:()=>void){window.addEventListener(eventName,callback);window.addEventListener('storage',callback);return()=>{window.removeEventListener(eventName,callback);window.removeEventListener('storage',callback)}}
function snapshot():PaletteName{try{const value=localStorage.getItem('statlab-chart-palette');return value&&value in palettes?value as PaletteName:'science'}catch{return 'science'}}
export function useChartPalette(){return useSyncExternalStore(subscribe,snapshot,()=> 'science' as PaletteName)}
export function setChartPalette(value:PaletteName){try{localStorage.setItem('statlab-chart-palette',value)}catch{/* The current page still remains usable if browser storage is restricted. */}window.dispatchEvent(new Event(eventName))}
export const figurePresets={wide:{name:'论文双栏',widthMm:180,dpi:300},column:{name:'论文单栏',widthMm:90,dpi:300}} as const;
export type FigurePresetName=keyof typeof figurePresets;
function exportSnapshot():FigurePresetName{try{return localStorage.getItem('statlab-figure-preset')==='column'?'column':'wide'}catch{return 'wide'}}
export function useFigurePreset(){return useSyncExternalStore(subscribe,exportSnapshot,()=> 'wide' as FigurePresetName)}
export function setFigurePreset(value:FigurePresetName){try{localStorage.setItem('statlab-figure-preset',value)}catch{/* Export remains available with current preset. */}window.dispatchEvent(new Event(eventName))}
