from typing import Literal
from pydantic import BaseModel, ConfigDict, Field

class AnalysisParams(BaseModel):
    model_config = ConfigDict(extra='forbid')
    columns: list[str] = Field(default_factory=list, max_length=30)
    method: Literal['pearson', 'spearman', 'kendall'] = 'pearson'
    test: Literal['one_sample_t', 'independent_t', 'paired_t', 'wilcoxon', 'mann_whitney', 'chi_square', 'anova', 'welch_anova', 'kruskal'] = 'one_sample_t'
    posthoc: Literal['none', 'auto', 'tukey', 'games_howell', 'dunn_holm'] = 'auto'
    group: str | None = None
    alpha: float = Field(default=0.05, gt=0, lt=1)
    mu: float = 0
    missing: Literal['drop', 'error'] = 'drop'
