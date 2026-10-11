import numpy as np
import pandas as pd
from scipy import stats
from scipy.stats.contingency import association
from statsmodels.stats.oneway import confint_effectsize_oneway
import pingouin as pg
from .common import numeric,fail
TESTS={'one_sample_t','independent_t','paired_t','wilcoxon','mann_whitney','chi_square','anova','kruskal'}
def boot_ci(fn,*arrays,paired=False,alpha=.05):
    result=stats.bootstrap(tuple(np.asarray(a) for a in arrays),fn,paired=paired,vectorized=False,n_resamples=999,method='percentile',confidence_level=1-alpha,rng=np.random.default_rng(42))
    return list(result.confidence_interval)
def run(df,p):
    test=p.test
    if test not in TESTS: fail('不支持的检验类型。')
    if not p.columns: fail('请选择检验变量。')
    ci=None; ci_note=''; effect=None; effect_name=''; dof=None; warnings=[]
    if test=='chi_square':
        cols=list(dict.fromkeys(p.columns))
        if len(cols)!=2 or any(c not in df for c in cols): fail('卡方检验需要两个分类变量。')
        if p.missing=='error' and df[cols].isna().any().any(): fail('变量包含缺失值。')
        frame=df[cols].dropna(); table=pd.crosstab(frame[cols[0]],frame[cols[1]])
        if min(table.shape)<2: fail('每个分类变量至少需要两个类别。')
        if max(table.shape)>50: fail('分类过多，请选择分类变量而非连续变量。')
        stat,pval,dof,expected=stats.chi2_contingency(table,correction=False)
        effect=association(table.to_numpy(),method='cramer',correction=False); effect_name="Cramér's V"
        if np.any(expected<5): warnings.append('存在期望频数 < 5 的单元格，卡方渐近近似可能不可靠。')
        codes_a=pd.Categorical(frame[cols[0]]).codes
        codes_b=pd.Categorical(frame[cols[1]]).codes
        def cramer(a,b):
            tab=pd.crosstab(a,b)
            return association(tab.to_numpy(),method='cramer',correction=False) if min(tab.shape)>1 else 0.0
        ci=boot_ci(cramer,codes_a,codes_b,paired=True,alpha=p.alpha)
        ci_note="Cramér's V percentile bootstrap CI（逐行重采样 999 次，seed 42）。退化为单类别的重采样关联量按 0 处理。"
        n=len(frame)
    elif test in ('anova','kruskal','independent_t','mann_whitney'):
        if len(p.columns)!=1 or not p.group or p.group not in df: fail('请选择一个数值变量和一个分组变量。')
        value=p.columns[0]
        if value==p.group: fail('分组变量不能与检验变量相同。')
        if not pd.api.types.is_numeric_dtype(df[value]): fail('检验变量必须为数值。')
        frame=df[[value,p.group]].replace([np.inf,-np.inf],np.nan)
        if p.missing=='error' and frame.isna().any().any(): fail('变量包含缺失值。')
        frame=frame.dropna(); groups=[g[value].to_numpy() for _,g in frame.groupby(p.group,sort=True)]
        if len(groups)<2 or len(groups)>30 or any(len(g)<3 for g in groups): fail('需要 2–30 个分组，且每组至少 3 个有效样本。')
        if np.ptp(frame[value])==0 or any(np.ptp(g)==0 for g in groups): fail('分组内存在常量变量，无法可靠推断。')
        n=len(frame)
        if test in ('independent_t','mann_whitney'):
            if len(groups)!=2: fail('此检验要求恰好两个分组。')
            a,b=groups
            warnings.append('差值方向：按分组标签排序后的第一组减第二组。')
            if test=='independent_t':
                result=stats.ttest_ind(a,b,equal_var=False); stat,pval=result.statistic,result.pvalue; dof=result.df
                ci=list(result.confidence_interval(1-p.alpha)); ci_note='Welch 均值差 CI'
                effect=pg.compute_effsize(a,b,eftype='cohen'); effect_name="Cohen's d"
            else:
                result=stats.mannwhitneyu(a,b,alternative='two-sided'); stat,pval=result.statistic,result.pvalue
                effect=pg.mwu(a,b).iloc[0]['RBC']; effect_name='Rank-biserial correlation (Pingouin convention)'
                ci=boot_ci(lambda x,y:np.median(x)-np.median(y),a,b,alpha=p.alpha); ci_note='中位数差 percentile bootstrap CI (999 次，seed 42)；非 U 检验参数 CI'
        else:
            result=stats.f_oneway(*groups) if test=='anova' else stats.kruskal(*groups)
            stat,pval=result.statistic,result.pvalue
            dof=[len(groups)-1,n-len(groups)] if test=='anova' else len(groups)-1
            effect_frame=frame.copy()
            if test=='kruskal': effect_frame[value]=stats.rankdata(effect_frame[value]); effect_name='Rank eta squared (对秩做 ANOVA 的描述性效应量)'
            else: effect_name='Eta squared'
            effect=pg.anova(data=effect_frame,dv=value,between=p.group,effsize='n2').iloc[0]['n2']
            if test=='anova':
                ci=list(confint_effectsize_oneway(stat,tuple(dof),alpha=p.alpha,nobs=n).eta2)
                ci_note='Eta squared CI（statsmodels 非中心 F 分布反演）；不是组间均值差区间。'
            else:
                def rank_eta(*samples):
                    boot=pd.DataFrame({'value':stats.rankdata(np.concatenate(samples)),'group':np.repeat(np.arange(len(samples)),[len(s) for s in samples])})
                    return pg.anova(data=boot,dv='value',between='group',effsize='n2').iloc[0]['n2']
                ci=boot_ci(rank_eta,*groups,alpha=p.alpha)
                ci_note='Rank eta squared percentile bootstrap CI（组内重采样 999 次，seed 42）；不是 Kruskal–Wallis 位置差区间。'
            warnings.append('总体显著不说明哪些组不同；本阶段未执行事后多重比较。')
    else:
        required=1 if test=='one_sample_t' else 2
        if len(p.columns)!=required: fail(f'此检验需要 {required} 个数值变量。')
        frame=numeric(df,p.columns,p.missing); n=len(frame); a=frame.iloc[:,0].to_numpy()
        if test=='one_sample_t':
            result=stats.ttest_1samp(a,p.mu); ci=list(result.confidence_interval(1-p.alpha)); ci_note='总体均值 CI'
            effect=pg.compute_effsize(a,p.mu,eftype='cohen'); effect_name="Cohen's d"
        else:
            b=frame.iloc[:,1].to_numpy()
            if np.ptp(a-b)==0: fail('配对差值为常量，无法进行可靠推断。')
            if test=='paired_t':
                result=stats.ttest_rel(a,b); ci=list(result.confidence_interval(1-p.alpha)); ci_note='配对均值差 CI'
                effect=pg.compute_effsize(a-b,0,eftype='cohen'); effect_name="Cohen's dz"
            else:
                result=stats.wilcoxon(a,b,alternative='two-sided')
                effect=pg.wilcoxon(a,b).iloc[0]['RBC']; effect_name='Rank-biserial correlation'
                ci=boot_ci(lambda x,y:np.median(x-y),a,b,paired=True,alpha=p.alpha); ci_note='配对差值中位数 percentile bootstrap CI (999 次，seed 42)'
        stat,pval=result.statistic,result.pvalue
        dof=getattr(result,'df',None)
    if not np.isfinite(stat) or not np.isfinite(pval): fail('检验产生非有限统计量，请检查样本量和数据变异。')
    interpretation=(f'p < α={p.alpha}，拒绝相应零假设。' if pval<p.alpha else f'p ≥ α={p.alpha}，没有足够证据拒绝相应零假设；这不证明零假设成立。')+'统计显著性不等于实际意义；请结合效应量、置信区间、研究设计与检验假设。'
    return {'tables':{'检验结果':[{'test':test,'statistic':stat,'df':dof,'p':pval,'n':n,'alpha':p.alpha,'CI low':ci[0] if ci else None,'CI high':ci[1] if ci else None,'effect size':effect,'effect type':effect_name}]},'charts':[],'warnings':warnings,'notes':[interpretation,ci_note,'所有检验均为双侧（总体 F/H/χ² 检验使用其上尾）。缺失行在本次检验所需变量范围内删除。']}
