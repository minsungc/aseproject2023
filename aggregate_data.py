import coq_figures
import isabelle_figures
import lean_figures

import matplotlib.pyplot as plt
import numpy as np
import matplotlib.dates as mdates
from datetime import datetime
from matplotlib.dates import DateFormatter
import os

lean_commit_y_axis = lean_figures.y_values
coq_commit_y_axis = coq_figures.y_values
isabelle_commit_y_axis = isabelle_figures.y_values

lean_commit_x_axis = lean_figures.x_values
coq_commit_x_axis = coq_figures.x_values
isabelle_commit_x_axis = isabelle_figures.x_values

fig, ax = plt.subplots()
ax.plot_date(lean_commit_x_axis, lean_commit_y_axis, color="blue", label="Lean",  xdate=True, ydate=False)
ax.plot_date(coq_commit_x_axis, coq_commit_y_axis, color="red", label="Coq", xdate=True, ydate=False)
ax.plot_date(isabelle_commit_x_axis, isabelle_commit_y_axis, color="orange", label="Isabelle", xdate=True, ydate=False)

date_formatter = DateFormatter("%Y")
ax.xaxis.set_major_formatter(date_formatter)
ax.set_xlabel("Year")
ax.set_ylabel("Number of Commits")
plt.legend(fontsize="xx-large")
plt.show()