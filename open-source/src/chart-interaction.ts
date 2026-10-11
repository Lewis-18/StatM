/** Keep ordinary wheel events away from chart zoom handlers without cancelling native scrolling. */
export function allowChartPageScroll(element:HTMLElement){
 const wheel=(event:WheelEvent)=>{if(!event.ctrlKey)event.stopPropagation()};
 element.addEventListener('wheel',wheel,{capture:true,passive:true});
 return()=>element.removeEventListener('wheel',wheel,true);
}
