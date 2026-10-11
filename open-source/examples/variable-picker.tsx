"use client";
import {useState} from 'react';
import VariablePicker from '../src/variable-picker';

// Demonstration fields only; these do not represent a real analysis result.
const fields=[
 {name:'Harvested_Area_Rainfed_(ha)',type:'continuous',missing:17500},
 {name:'Production_(tonnes)',type:'continuous',missing:21},
 {name:'Yield_(tonnes_per_ha)',type:'continuous',missing:42},
 {name:'Precipitation_(mm)',type:'continuous',missing:0},
];
export default function VariablePickerExample(){
 const [value,setValue]=useState<string[]>([]);
 return <main style={{maxWidth:420,margin:'40px auto',padding:24}}>
  <h1>变量选择组件演示</h1>
  <VariablePicker fields={fields} value={value} onChange={setValue} max={3} roles={['X','Y','Z']}/>
 </main>;
}
