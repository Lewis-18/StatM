import numpy as np
import pytest
from scipy import stats
from statm_tools import descriptive,correlation,hypothesis
from statm_tools.params import AnalysisParams

def params(**kw):return AnalysisParams(**kw)

def test_descriptive_reference(frame):
    result=descriptive.run(frame,params(columns=['x']))
    row=result['tables']['描述统计'][0]
    assert row['mean']==pytest.approx(frame.x.mean())
    assert row['std']==pytest.approx(frame.x.std(ddof=1))
    assert row['kurtosis']==pytest.approx(stats.kurtosis(frame.x,bias=False))
    ecdf=next(item for item in result['charts'] if item['title'].endswith(' · ECDF'))
    assert ecdf['data']['n']==len(frame)
    assert ecdf['data']['y'][-1]==1
    assert ecdf['data']['y']==sorted(ecdf['data']['y'])
    assert len(ecdf['data']['x'])<=500
    box=next(item for item in result['charts'] if item['title'].endswith(' · Boxplot'))
    assert len(box['data']['samples'])<=160
    assert box['data']['samples'][0]==pytest.approx(frame.x.min())
    assert box['data']['samples'][-1]==pytest.approx(frame.x.max())
    qq=next(item for item in result['charts'] if item['title'].endswith(' · Normal Q-Q'))
    assert len(qq['data']['points'])<=500
    assert len(qq['data']['trend'])==2
    assert len(descriptive.run(frame,params(columns=['constant']))['charts'])==3

@pytest.mark.parametrize('method',['pearson','spearman','kendall'])
def test_correlation_reference(frame,method):
    row=correlation.run(frame,params(columns=['x','y'],method=method))['tables']['相关系数 r / p / n'][1]
    fn={'pearson':stats.pearsonr,'spearman':stats.spearmanr,'kendall':stats.kendalltau}[method]
    expected=fn(frame.x,frame.y)
    assert row['r']==pytest.approx(expected.statistic)
    assert row['p']==pytest.approx(expected.pvalue)

@pytest.mark.parametrize('test',['one_sample_t','paired_t','wilcoxon','independent_t','mann_whitney','anova','kruskal','chi_square'])
def test_hypothesis_reference(frame,test):
    if test in ('independent_t','mann_whitney'):frame=frame.iloc[:60]
    cols=['x','z'] if test in ('paired_t','wilcoxon') else ['group','binary'] if test=='chi_square' else ['x']
    result=hypothesis.run(frame,params(columns=cols,test=test,group='group'))
    row=result['tables']['检验结果'][0]
    groups=[g.x for _,g in frame.groupby('group')]
    expected={'one_sample_t':lambda:stats.ttest_1samp(frame.x,0),'paired_t':lambda:stats.ttest_rel(frame.x,frame.z),'wilcoxon':lambda:stats.wilcoxon(frame.x,frame.z),'independent_t':lambda:stats.ttest_ind(*groups,equal_var=False),'mann_whitney':lambda:stats.mannwhitneyu(*groups),'anova':lambda:stats.f_oneway(*groups),'kruskal':lambda:stats.kruskal(*groups),'chi_square':lambda:stats.chi2_contingency(__import__('pandas').crosstab(frame.group,frame.binary),correction=False)}[test]()
    assert row['statistic']==pytest.approx(expected[0])
    assert row['p']==pytest.approx(expected[1])
    assert np.isfinite(row['effect size'])
    assert row['CI low'] is not None and row['CI high'] is not None
    assert row['CI low']<=row['CI high']
    assert '统计显著性不等于实际意义' in result['notes'][0]

def test_pairwise_missing_n(frame):
    r=correlation.run(frame,params(columns=['x','missing']))
    assert r['tables']['相关系数 r / p / n'][1]['n']==frame.missing.notna().sum()

def test_chi_sparse_warns(frame):
    frame=frame.iloc[:8]
    result=hypothesis.run(frame.assign(group=['a','a','a','b','a','a','a','b']),params(columns=['group','binary'],test='chi_square'))
    assert result['warnings']
