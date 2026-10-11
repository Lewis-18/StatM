import numpy as np
from scipy import stats
from matplotlib.cbook import boxplot_stats
from .common import numeric,chart
def distribution(x,name):
    count,edges=np.histogram(x,bins=min(40,max(5,int(np.sqrt(len(x))))))
    box=boxplot_stats(x,whis=1.5)[0]
    sorted_x=np.sort(x)
    sample=sorted_x[np.linspace(0,len(x)-1,min(len(x),160),dtype=int)]
    empirical=stats.ecdf(sorted_x).cdf
    unique,cumulative=empirical.quantiles,empirical.probabilities
    total_steps=len(unique)
    if len(unique)>500:
        selected=np.unique(np.linspace(0,len(unique)-1,500,dtype=int))
        unique,cumulative=unique[selected],cumulative[selected]
    charts=[
        chart(name+' · Histogram','bar',{'x':np.round((edges[:-1]+edges[1:])/2,5),'y':count,'n':len(x)}),
        chart(name+' · Boxplot','boxplot',{'values':[[box['whislo'],box['q1'],box['med'],box['q3'],box['whishi']]],'labels':[name],'outliers':box['fliers'].tolist(),'samples':sample,'n':len(x)}),
        chart(name+' · ECDF','line',{'x':unique,'y':cumulative,'n':len(x),'ecdf_total_steps':total_steps}),
    ]
    if len(x)>2 and np.ptp(x)>0:
        grid=np.linspace(min(x),max(x),100)
        charts.append(chart(name+' · Density','line',{'x':grid,'y':stats.gaussian_kde(x)(grid),'n':len(x)}))
        (theoretical,observed),(slope,intercept,_)=stats.probplot(x,dist='norm',fit=True)
        selected=np.unique(np.linspace(0,len(x)-1,min(len(x),500),dtype=int))
        reference=[[theoretical[0],slope*theoretical[0]+intercept],[theoretical[-1],slope*theoretical[-1]+intercept]]
        charts.append(chart(name+' · Normal Q-Q','scatter',{'points':np.column_stack((theoretical[selected],observed[selected])),'trend':reference,'n':len(x)},xLabel='理论正态分位数',yLabel=name))
    return charts
def run(df,p):
    rows=[]; charts=[]; warnings=[]
    for col in p.columns:
        x=numeric(df,[col],p.missing,minimum=1,constant=True)[col]
        row={'variable':col,'n':len(x),'mean':x.mean(),'std':x.std(),'var':x.var(),'min':x.min(),'Q1':x.quantile(.25),'median':x.median(),'Q3':x.quantile(.75),'max':x.max(),'skew':x.skew(),'kurtosis':x.kurt(),'CV':x.std()/abs(x.mean()) if not np.isclose(x.mean(),0) else None,'missing':len(df)-len(x)}
        rows.append(row); charts.extend(distribution(x.to_numpy(),col))
        if x.nunique()<2: warnings.append(col+' 是常量；偏度、峰度和密度估计可能不可用。')
        if row['CV'] is None: warnings.append(col+' 均值接近零，CV 不定义。')
    return {'tables':{'描述统计':rows},'charts':charts,'warnings':warnings,'notes':['标准差/方差使用 ddof=1；峰度为超额峰度；CV=样本标准差/均值绝对值。各列分别删除缺失值。','箱线图最多展示 160 个按顺序分位抽取的观测点；ECDF 在唯一值超过 500 个时抽取最多 500 个阶梯节点用于绘图，统计量仍使用全部有效数据。','正态 Q–Q 图由 SciPy probplot 计算，参考线为样本分位数的线性拟合；它是诊断图，不替代正式正态性检验。']}
