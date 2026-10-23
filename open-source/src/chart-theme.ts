export type FigureTheme='light'|'dark';

/** Export colors are independent of the application chrome. Black is opt-in. */
export function figureTheme(screen:FigureTheme,exporting:boolean,explicit?:FigureTheme):FigureTheme{
 return exporting?(explicit||'light'):screen;
}
export function figureBackground(theme:FigureTheme,exporting:boolean){
 return exporting?(theme==='dark'?'#000000':'#ffffff'):'transparent';
}
