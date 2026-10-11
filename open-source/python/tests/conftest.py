import pytest
import numpy as np
import pandas as pd

@pytest.fixture
def frame():
    rng=np.random.default_rng(937)
    x=rng.normal(10,3,90);z=rng.normal(5,2,90)
    return pd.DataFrame({'x':x,'z':z,'y':2*x+.6*z+rng.normal(0,2,90),'group':['A']*30+['B']*30+['C']*30,'binary':['yes','no']*45,'constant':1,'duplicate':x*2,'missing':np.where(np.arange(90)%8==0,np.nan,x)})
