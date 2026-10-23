"use client";
import {useSyncExternalStore} from 'react';

export type ChartBackground='auto'|'light'|'dark';
const eventName='statlab-chart-background';
const fallback=new Map<string,ChartBackground>();
function subscribe(callback:()=>void){window.addEventListener(eventName,callback);window.addEventListener('storage',callback);return()=>{window.removeEventListener(eventName,callback);window.removeEventListener('storage',callback)}}
function subscribeTheme(callback:()=>void){const observer=new MutationObserver(callback);observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});return()=>observer.disconnect()}
export function useAppChartTheme(){return useSyncExternalStore(subscribeTheme,()=>document.documentElement.dataset.theme==='light'?'light':'dark',()=> 'dark' as const)}
export function useChartBackground(id:string){
 const key='statlab-chart-background:'+id;
 const value=useSyncExternalStore(subscribe,()=>{const session=fallback.get(key);if(session)return session;try{const stored=localStorage.getItem(key);return stored==='light'||stored==='dark'?stored:'auto'}catch{return 'auto'}},()=> 'auto' as ChartBackground);
 return [value,(next:ChartBackground)=>{try{localStorage.setItem(key,next);fallback.delete(key)}catch{fallback.set(key,next)}window.dispatchEvent(new Event(eventName))}] as const;
}
export function chartSurface(background:ChartBackground,element:HTMLElement|null){
 const theme=background==='auto'?(document.documentElement.dataset.theme==='light'?'light':'dark'):background;
 const color=background==='auto'?(element?getComputedStyle(element).getPropertyValue('--panel').trim():'')||(theme==='light'?'#ffffff':'#151f2d'):theme==='light'?'#ffffff':'#000000';
 return {theme,color} as const;
}
export function chartExportSurface(background:ChartBackground){
 const theme=background==='dark'?'dark':'light';
 return {theme,color:theme==='dark'?'#000000':'#ffffff'} as const;
}
