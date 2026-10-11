"""Read tabular files and inspect fields without an application or database."""
import codecs, csv, zipfile
from pathlib import Path
import pandas as pd
def profile(df):
    fields=[]
    for col in df:
        s=df[col]; unique=s.nunique(); valid=s.dropna()
        if pd.api.types.is_bool_dtype(s): kind='categorical'
        elif pd.api.types.is_numeric_dtype(s): kind='discrete' if len(valid) and (valid%1==0).all() and unique<=max(20,len(s)*.05) else 'continuous'
        elif pd.api.types.is_datetime64_any_dtype(s): kind='date'
        else: kind='categorical' if unique<=max(30,len(s)*.1) else 'text'
        fields.append({'name':col,'type':kind,'dtype':str(s.dtype),'missing':int(s.isna().sum()),'missing_ratio':float(s.isna().mean()),'unique':int(unique)})
    return {'rows':len(df),'columns':len(df.columns),'fields':fields}

def read_text_data(path, max_rows=1_000_000):
    path=Path(path)
    encoding='utf-8-sig'
    with path.open('rb') as stream: sample=stream.read(65536)
    try: text=codecs.getincrementaldecoder(encoding)().decode(sample,final=False)
    except UnicodeDecodeError:
        encoding='gb18030';text=sample.decode(encoding,errors='ignore')
    try: separator=csv.Sniffer().sniff(text,delimiters=',\t;|').delimiter
    except csv.Error:
        header=next((line for line in text.splitlines() if line.strip()),'')
        separator=next((delimiter for delimiter in ('\t',',',';','|') if delimiter in header),None)
        if separator is None: separator=r'\s+' if any(char.isspace() for char in header.strip()) else ','
    try: return pd.read_csv(path,encoding=encoding,sep=separator,float_precision='round_trip',nrows=max_rows+1)
    except UnicodeDecodeError: return pd.read_csv(path,encoding='gb18030',sep=separator,float_precision='round_trip',nrows=max_rows+1)

def read_table(path, max_bytes=200*1024*1024, max_rows=1_000_000,
               max_columns=500, max_excel_expanded=500*1024*1024):
    path = Path(path)
    if min(max_bytes, max_rows, max_columns, max_excel_expanded) < 1:
        raise ValueError('Limits must be positive.')
    if path.stat().st_size > max_bytes:
        raise ValueError('File exceeds the configured size limit.')
    suffix = path.suffix.lower()
    if suffix == '.txt':
        frame = read_text_data(path, max_rows=max_rows)
    elif suffix == '.csv':
        try:
            frame = pd.read_csv(path, encoding='utf-8-sig', float_precision='round_trip', nrows=max_rows+1)
        except UnicodeDecodeError:
            frame = pd.read_csv(path, encoding='gb18030', float_precision='round_trip', nrows=max_rows+1)
    elif suffix in ('.xls', '.xlsx'):
        if suffix == '.xlsx':
            with zipfile.ZipFile(path) as archive:
                if sum(info.file_size for info in archive.infolist()) > max_excel_expanded:
                    raise ValueError('Expanded Excel file exceeds the configured limit.')
        frame = pd.read_excel(path, engine='xlrd' if suffix == '.xls' else 'openpyxl', sheet_name=0, nrows=max_rows+1)
    else:
        raise ValueError('Supported extensions: .csv, .txt, .xlsx, .xls.')
    if frame.empty or not len(frame.columns):
        raise ValueError('The table must contain a header and at least one data row.')
    if len(frame) > max_rows or len(frame.columns) > max_columns:
        raise ValueError('Table exceeds the configured row or column limit.')
    frame.columns = [str(column).strip() for column in frame.columns]
    if not all(frame.columns) or frame.columns.duplicated().any():
        raise ValueError('Column names must be nonempty and unique.')
    return frame
