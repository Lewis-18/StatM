"use client";
import {useSyncExternalStore} from 'react';
export type FigureLanguage='auto'|'zh-CN'|'en';
export type FigureTypography='standard'|'readable';
const eventName='statm-figure-preferences';
function subscribe(callback:()=>void){window.addEventListener(eventName,callback);window.addEventListener('storage',callback);return()=>{window.removeEventListener(eventName,callback);window.removeEventListener('storage',callback)}}
function read(key:string,allowed:string[],fallback:string){try{const value=localStorage.getItem(key);return value&&allowed.includes(value)?value:fallback}catch{return fallback}}
function write(key:string,value:string){try{localStorage.setItem(key,value)}catch{}window.dispatchEvent(new Event(eventName))}
export function useFigureLanguage(){return useSyncExternalStore(subscribe,()=>read('statm-figure-language',['auto','zh-CN','en'],'auto') as FigureLanguage,()=> 'auto' as FigureLanguage)}
export function setFigureLanguage(value:FigureLanguage){write('statm-figure-language',value)}
export function useFigureTypography(){return useSyncExternalStore(subscribe,()=>read('statm-figure-typography',['standard','readable'],'standard') as FigureTypography,()=> 'standard' as FigureTypography)}
export function setFigureTypography(value:FigureTypography){write('statm-figure-typography',value)}
