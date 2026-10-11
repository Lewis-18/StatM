"""A small in-process interface for extending standalone analysis scripts."""
from typing import Protocol
import pandas as pd
from .params import AnalysisParams

class AnalysisPlugin(Protocol):
    def run(self, frame: pd.DataFrame, params: AnalysisParams) -> dict: ...

class PluginRegistry:
    def __init__(self):
        self._plugins: dict[str, AnalysisPlugin] = {}

    def register(self, name: str, plugin: AnalysisPlugin):
        if not name.strip() or name in self._plugins or not callable(getattr(plugin, 'run', None)):
            raise ValueError('Provide a unique nonempty name and a callable run method.')
        self._plugins[name] = plugin

    def run(self, name: str, frame: pd.DataFrame, params: AnalysisParams):
        if name not in self._plugins:
            raise ValueError('Unknown analysis: ' + name)
        return self._plugins[name].run(frame, params)
