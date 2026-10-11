"""Resolve optional numerical modules only when a computation needs them."""
from importlib import import_module
from threading import RLock, current_thread, main_thread
import sys


class LazyModule:
    def __init__(self, name):
        self._name = name
        self._module = None
        self._lock = RLock()

    def _resolve(self):
        with self._lock:
            if self._module is None:
                self._module = import_module(self._name)
            return self._module

    def __getattr__(self, name):
        if self._module is None and getattr(sys, 'frozen', False) and current_thread() is not main_thread():
            # Windows native numerical extensions can deadlock on their first
            # import from a frozen worker thread. Resolve on the server loop,
            # then leave calculations on the requesting worker as before.
            from anyio.from_thread import run_sync
            module = run_sync(self._resolve)
        else:
            module = self._resolve()
        return getattr(module, name)
