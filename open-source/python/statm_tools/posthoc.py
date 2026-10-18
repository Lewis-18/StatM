"""Preselected pairwise comparisons; directions are always group A minus B."""
from itertools import combinations
import numpy as np
from scipy import stats
from statsmodels.stats.multitest import multipletests
from .common import fail

def comparisons(groups,labels,test,method,alpha):
    expected={'anova':'tukey','welch_anova':'games_howell','kruskal':'dunn_holm'}[test]
    if method=='none':return [],'未执行事后比较。'
    if method=='auto':method=expected
    if method!=expected:fail('事后比较方法与总体检验不匹配。')
    pairs=list(combinations(range(len(groups)),2));rows=[]
    if method in ('tukey','games_howell'):
        result=stats.tukey_hsd(*groups,equal_var=method=='tukey')
        interval=result.confidence_interval(1-alpha)
        for i,j in pairs:
            rows.append({'group A':str(labels[i]),'group B':str(labels[j]),'method':method,
                         'estimate':float(result.statistic[i,j]),'adjusted p':float(result.pvalue[i,j]),
                         'CI low':float(interval.low[i,j]),'CI high':float(interval.high[i,j]),
                         'reject':bool(result.pvalue[i,j]<alpha)})
        note='事后比较：'+('Tukey–Kramer（等方差）' if method=='tukey' else 'Games–Howell（方差不齐）')+'；全部组对同时比较。差值方向为 A − B，区间对应均值差。'
    else:
        values=np.concatenate(groups);ranks=stats.rankdata(values);n=len(values)
        _,ties=np.unique(values,return_counts=True)
        variance=n*(n+1)/12-sum(int(t)**3-int(t) for t in ties)/(12*(n-1))
        means=[];start=0
        for group in groups:means.append(float(ranks[start:start+len(group)].mean()));start+=len(group)
        z=[(means[i]-means[j])/np.sqrt(variance*(1/len(groups[i])+1/len(groups[j]))) for i,j in pairs]
        adjusted=multipletests(2*stats.norm.sf(np.abs(z)),alpha=alpha,method='holm')[1]
        for (i,j),statistic,pval in zip(pairs,z,adjusted):
            rows.append({'group A':str(labels[i]),'group B':str(labels[j]),'method':method,'statistic':float(statistic),
                         'adjusted p':float(pval),'CI low':None,'CI high':None,'reject':bool(pval<alpha)})
        note='事后比较：Dunn 检验（合并秩、并列秩校正），所有组对的 p 值使用 Holm 校正。未计算位置差区间；不能解释为中位数差检验。'
    return rows,note

def estimation_chart(groups,labels,estimates,confidence,value,reference=0):
    rng=np.random.default_rng(937);points=[]
    for i,group in enumerate(groups):
        # The inference uses all records; only the observation layer is bounded.
        selected=np.sort(rng.choice(len(group),min(len(group),400),replace=False))
        points.extend([[i,float(group[j])] for j in selected])
    return {'title':value+' · Estimation','kind':'estimation','yLabel':value,
            'data':{'points':points,'categories':[str(label) for label in labels],
                    'estimates':estimates[:10],'estimate_total':len(estimates),'confidence':confidence,'reference':reference,
                    'n':sum(len(g) for g in groups),'shown':len(points)}}
