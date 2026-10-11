import math
import sys
from .lazy import LazyModule
np=LazyModule('numpy')
pd=LazyModule('pandas')
from fastapi import HTTPException
def fail(message,status=422): raise HTTPException(status,detail=message)
def clean(value):
    if isinstance(value,dict): return {str(k):clean(v) for k,v in value.items()}
    if isinstance(value,(list,tuple)): return [clean(v) for v in value]
    if value is None or isinstance(value,(str,int,bool)): return value
    if isinstance(value,float): return value if math.isfinite(value) else None
    # Plain JSON responses must not cause a pandas/numpy import during launch.
    if 'numpy' in sys.modules and isinstance(value,np.ndarray): return [clean(v) for v in value]
    if 'pandas' in sys.modules and isinstance(value,(pd.Series,pd.Index)): return [clean(v) for v in value]
    if 'numpy' in sys.modules and isinstance(value,np.generic): return clean(value.item())
    if isinstance(value,float) and not math.isfinite(value): return None
    if 'pandas' in sys.modules:
        if value is pd.NA or value is pd.NaT: return None
        if isinstance(value,pd.Timestamp): return value.isoformat()
    return value
def ok(data=None,message='操作成功'): return {'success':True,'data':clean(data),'error':None,'message':message}
def numeric(df,cols,missing='drop',minimum=3,constant=False):
    if not cols or len(set(cols))!=len(cols): fail('请选择不重复的数值变量。')
    if any(c not in df.columns for c in cols): fail('变量不存在，请重新选择。')
    if any(not pd.api.types.is_numeric_dtype(df[c]) for c in cols): fail('此方法仅支持数值变量，请检查变量类型。')
    frame=df[cols].replace([np.inf,-np.inf],np.nan)
    if missing=='error' and frame.isna().any().any(): fail('选定变量包含缺失值或无穷值，请先清洗或选择删除缺失行。')
    frame=frame.dropna()
    if len(frame)<minimum: fail(f'有效样本不足：至少需要 {minimum} 行，当前 {len(frame)} 行。')
    constants=[c for c in cols if frame[c].nunique()<2]
    if constants and not constant: fail('存在常量变量：'+', '.join(constants)+'。请移除后重试。')
    return frame
def chart(title,kind,data,**extra): return {'title':title,'kind':kind,'data':clean(data),**extra}
