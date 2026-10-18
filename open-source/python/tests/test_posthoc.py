import numpy as np
import pytest
from scipy import stats
from statm_tools import hypothesis
from statm_tools.common import clean
from statm_tools.params import AnalysisParams


@pytest.mark.parametrize('test,method', [('anova', 'tukey'), ('welch_anova', 'games_howell'), ('kruskal', 'dunn_holm')])
def test_public_tool_keeps_complete_pairwise_results(frame, test, method):
    result = clean(hypothesis.run(frame, AnalysisParams(columns=['x'], group='group', test=test, alpha=.025)))
    pairs = result['tables']['事后比较']
    assert len(pairs) == 3
    assert {pair['method'] for pair in pairs} == {method}
    assert all(0 <= pair['adjusted p'] <= 1 for pair in pairs)
    if method != 'dunn_holm':
        groups = [g.x.to_numpy() for _, g in frame.groupby('group')]
        expected = stats.tukey_hsd(*groups, equal_var=method == 'tukey')
        assert pairs[0]['estimate'] == pytest.approx(float(expected.statistic[0, 1]))
        assert pairs[0]['adjusted p'] == pytest.approx(float(expected.pvalue[0, 1]))
        assert result['charts'][0]['data']['confidence'] == .975


def test_comparisons_can_be_disabled(frame):
    result = hypothesis.run(frame, AnalysisParams(columns=['x'], group='group', test='welch_anova', posthoc='none'))
    assert not result['tables'].get('事后比较')
