"use client";
import {useId,useRef,useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {ArrowDown,ArrowUp,ListFilter,Search,X} from 'lucide-react';
import './variable-picker.css';

export interface VariableField {name:string;type:string;missing:number}
export interface VariablePickerProps {
 fields:VariableField[];
 value:string[];
 onChange:(value:string[])=>void;
 title?:string;
 max?:number;
 roles?:string[];
 translate?:(text:string)=>string;
}
const identity=(text:string)=>text;

/** Standalone public component. Variable names are always kept verbatim. */
export default function VariablePicker({fields,value,onChange,title='选择变量',max=30,roles=[],translate:tr=identity}:VariablePickerProps){
 const id=useId();
 const [open,setOpen]=useState(false),[search,setSearch]=useState(''),[draft,setDraft]=useState<string[]>([]);
 const selectedList=useRef<HTMLOListElement>(null),[announcement,setAnnouncement]=useState('');
 const available=new Set(fields.map(f=>f.name));
 const selected=value.filter(name=>available.has(name));
 const filtered=fields.filter(f=>f.name.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()));
 function changeOpen(next:boolean){if(next){setDraft([...new Set(selected)]);setSearch('');setAnnouncement('')}setOpen(next)}
 function toggle(name:string){setDraft(old=>old.includes(name)?old.filter(v=>v!==name):old.length<max?[...old,name]:old)}
 function move(index:number,offset:number,action=offset<0?'up':'down'){
  const name=draft[index];if(!name||index+offset<0||index+offset>=draft.length)return;
  setDraft(old=>{const next=[...old];[next[index],next[index+offset]]=[next[index+offset],next[index]];return next});
  setAnnouncement(`${name} · ${tr('已选顺序')} ${index+offset+1}`);
  requestAnimationFrame(()=>{const row=Array.from(selectedList.current?.children||[]).find(node=>node.getAttribute('data-variable')===name) as HTMLElement|undefined;
   const button=row?.querySelector<HTMLButtonElement>(`[data-action="${action}"]`);(button&&!button.disabled?button:row)?.focus({preventScroll:true});row?.scrollIntoView({block:'nearest',behavior:'instant'})});
 }
 const role=(index:number)=>roles[index]?tr(roles[index]):String(index+1);
 return <div className="variable-picker">
  <Dialog.Root open={open} onOpenChange={changeOpen}>
   <Dialog.Trigger asChild><button type="button" className="vp-trigger" disabled={!fields.length}>
    <ListFilter size={17} aria-hidden="true"/><span>{tr(title)}</span><small>{selected.length} / {max}</small>
   </button></Dialog.Trigger>
   <p className="vp-summary">{selected.length?selected.map((name,index)=><span key={name}><b>{role(index)}</b> {name}</span>):tr(fields.length?'尚未选择变量':'此数据集没有可用字段。')}</p>
   <Dialog.Portal>
    <Dialog.Overlay className="vp-overlay"/>
    <Dialog.Content className="vp-dialog">
     <div className="vp-heading"><Dialog.Title>{tr(title)}</Dialog.Title><Dialog.Description>{tr('搜索并勾选变量，确认后应用。按选择顺序设置坐标轴。')}</Dialog.Description></div>
     <Dialog.Close className="vp-close" aria-label={tr('关闭')}><X size={19}/></Dialog.Close>
     <div className="vp-body">
      <section className="vp-fields" aria-label={tr('可选变量')}>
       <label className="vp-search"><Search size={17} aria-hidden="true"/><input autoComplete="off" aria-label={tr('搜索变量')} placeholder={tr('搜索变量…')} value={search} onChange={e=>setSearch(e.target.value)}/></label>
       <div className="vp-tools"><span>{filtered.length} {tr('个可选变量')}</span><button type="button" disabled={!filtered.some(f=>!draft.includes(f.name))||draft.length>=max} onClick={()=>setDraft(old=>[...new Set([...old,...filtered.map(f=>f.name)])].slice(0,max))}>{tr('选择搜索结果')}</button></div>
       <div className="vp-list">{filtered.map((f,index)=>{const checked=draft.includes(f.name);return <label className="vp-field" key={f.name} htmlFor={`${id}-${index}`} data-selected={checked}>
        <input id={`${id}-${index}`} type="checkbox" checked={checked} disabled={!checked&&draft.length>=max} onChange={()=>toggle(f.name)}/>
        <span className="vp-field-info"><span>{f.name}</span><small>{tr(['continuous','discrete'].includes(f.type)?'数值变量':'分类 / 文本变量')} · {tr('缺失')} {f.missing.toLocaleString()}</small></span>
        {checked&&<b className="vp-role">{role(draft.indexOf(f.name))}</b>}
       </label>})}{!filtered.length&&<p className="vp-empty">{tr('没有匹配的变量')}</p>}</div>
      </section>
      <section className="vp-selected" aria-label={tr('已选变量')}>
       <div className="vp-tools"><strong>{tr('已选变量')} {draft.length} / {max}</strong><button type="button" disabled={!draft.length} onClick={()=>setDraft([])}>{tr('清空')}</button></div>
       <ol ref={selectedList} className="vp-selected-list">{draft.map((name,index)=><li key={name} data-variable={name} tabIndex={-1} onKeyDown={e=>{if(e.altKey&&['ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();move(index,e.key==='ArrowUp'?-1:1)}}}>
        <div className="vp-selected-name"><b className="vp-role">{role(index)}</b><span title={name}>{name}</span></div>
        <div className="vp-order"><button type="button" data-action="up" disabled={index===0} onClick={()=>move(index,-1)} title={`${tr('上移')} · Alt + ↑`} aria-keyshortcuts="Alt+ArrowUp" aria-label={`${tr('上移')} ${name}`}><ArrowUp size={16}/></button><button type="button" data-action="down" disabled={index===draft.length-1} onClick={()=>move(index,1)} title={`${tr('下移')} · Alt + ↓`} aria-keyshortcuts="Alt+ArrowDown" aria-label={`${tr('下移')} ${name}`}><ArrowDown size={16}/></button><button type="button" onClick={()=>toggle(name)} title={tr('移除')} aria-label={`${tr('移除')} ${name}`}><X size={16}/></button></div>
       </li>)}</ol>
       {!draft.length&&<p className="vp-empty">{tr('从左侧选择变量，完整名称和缺失情况会在列表中显示。')}</p>}
      </section>
     </div>
     <div className="vp-footer"><p role="status">{announcement||tr(draft.length>=max?'已达到选择上限，可取消勾选或调整顺序。':'取消或按 Esc 保留原来的选择。Alt + ↑ / ↓ 调整顺序。')}</p><div><Dialog.Close className="vp-button">{tr('取消')}</Dialog.Close><button type="button" className="vp-button vp-confirm" disabled={draft.length>max} onClick={()=>{onChange(draft.filter(name=>available.has(name)));setOpen(false)}}>{tr('确认选择')}</button></div></div>
    </Dialog.Content>
   </Dialog.Portal>
  </Dialog.Root>
 </div>;
}
