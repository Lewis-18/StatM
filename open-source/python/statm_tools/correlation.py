from scipy import stats
from .common import numeric,chart,fail
def run(df,p):
    if len(p.columns)<2: fail('相关分析至少选择两个数值变量。')
    methods={'pearson':stats.pearsonr,'spearman':stats.spearmanr,'kendall':stats.kendalltau}
    if p.method not in methods: fail('请选择 Pearson、Spearman 或 Kendall。')
    rows=[]; heat=[]; charts=[]
    for i,a in enumerate(p.columns):
        for j,b in enumerate(p.columns):
            frame=numeric(df,list(dict.fromkeys([a,b])),p.missing)
            r,pval=methods[p.method](frame[a],frame[b])
            heat.append([j,i,r,pval,len(frame)])
            rows.append({'x':a,'y':b,'r':r,'p':pval,'n':len(frame)})
            if i<j:
                charts.append(chart(a+' × '+b,'scatter',{'points':frame[[a,b]].head(1500).values},xLabel=a,yLabel=b))
    return {'tables':{'相关系数 r / p / n':rows},'charts':[chart(p.method.title()+' · Correlation','heatmap',{'labels':p.columns,'values':heat})]+charts,'warnings':['逐对删除缺失值；不同变量对的 n 可能不同。p 值未经多重比较校正。'],'notes':['散点矩阵按变量对展开，每图最多展示前 1500 行；统计量使用全部有效数据。']}
