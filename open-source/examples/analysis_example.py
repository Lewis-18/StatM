"""Run after installing ../python. Data is generated locally."""
import json
import numpy as np
import pandas as pd
from statm_tools import descriptive, correlation, hypothesis
from statm_tools.common import clean
from statm_tools.params import AnalysisParams
from statm_tools.plugins import PluginRegistry

rng = np.random.default_rng(42)
x = rng.normal(size=40)
frame = pd.DataFrame({'x': x, 'y': 2*x + rng.normal(size=40)})
registry = PluginRegistry()
registry.register('summary', descriptive)
results = {
    'summary': registry.run('summary', frame, AnalysisParams(columns=['x'])),
    'correlation': correlation.run(frame, AnalysisParams(columns=['x', 'y'])),
    'one_sample_t': hypothesis.run(frame, AnalysisParams(columns=['x'], mu=0)),
}
print(json.dumps(clean(results), ensure_ascii=True, indent=2, allow_nan=False))
