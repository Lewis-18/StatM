import numpy as np
import pandas as pd
import pytest
from statm_tools.data_io import read_table, profile
from statm_tools import correlation, descriptive
from statm_tools.common import clean
from statm_tools.params import AnalysisParams
from statm_tools.plugins import PluginRegistry
from fastapi import HTTPException

@pytest.mark.parametrize('delimiter', [',', '\t', ';', '|', ' '])
@pytest.mark.parametrize('encoding', ['utf-8-sig', 'gb18030'])
def test_txt_delimiters_and_encoding(tmp_path, delimiter, encoding):
    path=tmp_path/'data.txt'
    path.write_text(delimiter.join(['地区','value'])+'\n'+delimiter.join(['南京','2'])+'\n'+delimiter.join(['北京','4']), encoding=encoding)
    frame=read_table(path)
    assert frame.columns.tolist()==['地区','value']
    assert frame['地区'].tolist()==['南京','北京']
    assert frame['value'].tolist()==[2,4]

@pytest.mark.parametrize('extension', ['csv', 'xlsx', 'xls'])
def test_table_formats(tmp_path, extension):
    path=tmp_path/('data.'+extension)
    frame=pd.DataFrame({'value':[1,2,3]})
    if extension=='csv':frame.to_csv(path,index=False)
    elif extension=='xlsx':frame.to_excel(path,index=False)
    else:
        import xlwt
        workbook=xlwt.Workbook();sheet=workbook.add_sheet('Data')
        sheet.write(0,0,'value')
        for i,value in enumerate([1,2,3],1):sheet.write(i,0,value)
        workbook.save(str(path))
    assert read_table(path).equals(frame)

def test_limits_and_excel_expansion(tmp_path):
    path=tmp_path/'data.csv'
    pd.DataFrame({'x':[1,2,3],'y':[2,3,4]}).to_csv(path,index=False)
    for kwargs in [{'max_bytes':2},{'max_rows':2},{'max_columns':1},{'max_rows':0}]:
        with pytest.raises(ValueError):read_table(path,**kwargs)
    excel=tmp_path/'data.xlsx'
    pd.DataFrame({'x':[1]}).to_excel(excel,index=False)
    with pytest.raises(ValueError,match='Expanded'):read_table(excel,max_excel_expanded=1)
    first=pd.DataFrame({'x':[1,2]})
    with pd.ExcelWriter(excel) as writer:
        first.to_excel(writer,sheet_name='first',index=False)
        pd.DataFrame({'other':[999]}).to_excel(writer,sheet_name='second',index=False)
    assert read_table(excel).equals(first)

def test_missing_nonfinite_and_validation():
    frame=pd.DataFrame({'x':[1.,2.,np.nan,4.,np.inf], 'y':[2.,3.,5.,7.,8.]})
    registry=PluginRegistry();registry.register('summary',descriptive)
    result=registry.run('summary',frame,AnalysisParams(columns=['x']))
    assert result['tables']['描述统计'][0]['n']==3
    assert profile(frame)['fields'][0]['missing']==1
    assert clean({'x':float('inf'),'array':np.array([1.,np.nan])})=={'x':None,'array':[1.,None]}
    with pytest.raises(HTTPException):descriptive.run(frame,AnalysisParams(columns=['x'],missing='error'))
    with pytest.raises(HTTPException):correlation.run(pd.DataFrame({'x':[1,1,1],'y':[2,3,4]}),AnalysisParams(columns=['x','y']))
    with pytest.raises(ValueError):registry.register('summary',descriptive)
    with pytest.raises(ValueError):registry.register('bad',object())
    with pytest.raises(ValueError):registry.run('absent',frame,AnalysisParams(columns=['x']))
    with pytest.raises(ValueError):AnalysisParams(columns=['x'],alpha=1)
