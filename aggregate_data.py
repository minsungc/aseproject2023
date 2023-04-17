import coq_figures
import isabelle_figures
import lean_figures
import json
import matplotlib.pyplot as plt
import numpy as np
import matplotlib.dates as mdates
from datetime import datetime
from matplotlib.dates import DateFormatter
import os

# Figure 1

# lean_commit_y_axis = lean_figures.y_values
# coq_commit_y_axis = coq_figures.y_values
# isabelle_commit_y_axis = isabelle_figures.y_values

# lean_commit_x_axis = lean_figures.x_values
# coq_commit_x_axis = coq_figures.x_values
# isabelle_commit_x_axis = isabelle_figures.x_values

# fig, ax = plt.subplots()
# ax.plot_date(lean_commit_x_axis, lean_commit_y_axis, color="blue", label="Lean",  xdate=True, ydate=False)
# ax.plot_date(coq_commit_x_axis, coq_commit_y_axis, color="red", label="Coq", xdate=True, ydate=False)
# ax.plot_date(isabelle_commit_x_axis, isabelle_commit_y_axis, color="orange", label="Isabelle", xdate=True, ydate=False)

# date_formatter = DateFormatter("%Y")
# ax.xaxis.set_major_formatter(date_formatter)
# ax.set_xlabel("Year")
# ax.set_ylabel("Number of Commits")
# plt.legend(fontsize="xx-large")
# plt.show()


# Figure 2

# Coq
with open('DataCollection/CoqTheorems.json') as f:
    # Load the JSON data into a Python dictionary
    theorem_data = json.load(f)

date_theorem = {}
totaltheorems = 0
for element in theorem_data:
    totaltheorems += 1
    if isinstance(element, dict):
        sources = element['sources'][0]
        if 'commits' in sources:
            commit = sources['commits']
            if len(commit) > 0:
                last_commit_date = commit[len(commit) - 1]['date']
                lcd_datetime = datetime.strptime(last_commit_date, "%Y-%m-%dT%H:%M:%S%z").year
                date_theorem[lcd_datetime] = date_theorem.get(lcd_datetime, 0) + 1
    else:
        print("Each element in the JSON file must be a dictionary.")

sort_dates = list(date_theorem.keys())
sort_dates.sort()
sorted_dt= {i: date_theorem[i] for i in sort_dates}

sorted_dt[2002] = sorted_dt.get(2002, 0) + 1
sorted_dt[2007] = sorted_dt.get(2007, 0) + 2
sorted_dt[2008] = sorted_dt.get(2008, 0) + 1
sorted_dt[2003] = sorted_dt.get(2003, 0) + 2
sorted_dt[2000] = 1
sorted_dt[1999] = 1
sorted_dt[2002] = sorted_dt.get(2002, 0) + 1
sorted_dt[2006] = sorted_dt.get(2006, 0) + 2
sorted_dt[2021] = sorted_dt.get(2021, 0) + 2
sorted_dt[2022] = sorted_dt.get(2022, 0) + 1
sorted_dt[2004] = sorted_dt.get(2004, 0) + 5
sorted_dt[2014] = sorted_dt.get(2014, 0) + 1
sorted_dt[2020] = sorted_dt.get(2020, 0) + 1
sorted_dt[2005] = sorted_dt.get(2005, 0) + 1
sorted_dt[2010] = sorted_dt.get(2010, 0) + 1
sorted_dt[2015] = sorted_dt.get(2015, 0) + 4

final_sort = list(sorted_dt.keys())
final_sort.sort()
final_sort= list({i: sorted_dt[i] for i in final_sort}.items())

cp_coq = list(map(lambda x: list(x),final_sort))

for i in range(len(final_sort)) :
    (_, v) = final_sort[i]
    for j in range(i+1, len(final_sort)):
        cp_coq[j][1] += v

print(cp_coq)
# Lean
with open('DataCollection/LeanTheorems.json') as f:
    # Load the JSON data into a Python dictionary
    theorem_data = json.load(f)

date_theorem = {}
totaltheorems = 0
for element in theorem_data:
    totaltheorems += 1
    if isinstance(element, dict):
        sources = element['sources'][0]
        if 'commits' in sources:
            commit = sources['commits']
            if len(commit) > 0:
                last_commit_date = commit[len(commit) - 1]['date']
                lcd_datetime = datetime.strptime(last_commit_date, "%Y-%m-%dT%H:%M:%S%z").year
                date_theorem[lcd_datetime] = date_theorem.get(lcd_datetime, 0) + 1
            else :
                print("zero commit github:" + str(element['theorem_number']))
        else :
            print("non github:" + str(element['theorem_number']))
    else:
        print("Each element in the JSON file must be a dictionary.")

date_theorem[2020] = date_theorem.get(2020, 0) + 1

final_sort = list(date_theorem.keys())
final_sort.sort()
final_sort= list({i: date_theorem[i] for i in final_sort}.items())

cp_lean = list(map(lambda x: list(x),final_sort))

for i in range(len(final_sort)) :
    (_, v) = final_sort[i]
    for j in range(i+1, len(final_sort)):
        cp_lean[j][1] += v

# Isabelle
with open('DataCollection/IsabelleTheorems.json') as f:
    # Load the JSON data into a Python dictionary
    theorem_data = json.load(f)

date_theorem = {}
totaltheorems = 0
for element in theorem_data:
    totaltheorems += 1
    if isinstance(element, dict):
        sources = element['sources'][0]
        if 'commits' in sources:
            commit = sources['commits']
            if len(commit) > 0:
                last_commit_date = commit[len(commit) - 1]['date']
                lcd_datetime = datetime.strptime(last_commit_date, "%Y-%m-%dT%H:%M:%S%z").year
                date_theorem[lcd_datetime] = date_theorem.get(lcd_datetime, 0) + 1
            else :
                print("zero commit github:" + str(element['theorem_number']))
        else :
            print("non github:" + str(element['theorem_number']))
    else:
        print("Each element in the JSON file must be a dictionary.")

date_theorem[2004] = date_theorem.get(2004, 0) + 2
date_theorem[2006] = date_theorem.get(2006, 0) + 1
date_theorem[2017] = date_theorem.get(2017, 0) + 6
date_theorem[2018] = date_theorem.get(2018, 0) + 4
date_theorem[2013] = date_theorem.get(2013, 0) + 3
date_theorem[2012] = date_theorem.get(2012, 0) + 2
date_theorem[2015] = date_theorem.get(2015, 0) + 5
date_theorem[2007] = date_theorem.get(2007, 0) + 3
date_theorem[2022] = date_theorem.get(2022, 0) + 1
date_theorem[2021] = date_theorem.get(2021, 0) + 3
date_theorem[2014] = date_theorem.get(2014, 0) + 1
date_theorem[2016] = date_theorem.get(2016, 0) + 3
date_theorem[2009] = date_theorem.get(2009, 0) + 1
date_theorem[2019] = date_theorem.get(2019, 0) + 1
date_theorem[2008] = date_theorem.get(2008, 0) + 1

final_sort = list(date_theorem.keys())
final_sort.sort()
final_sort= list({i: date_theorem[i] for i in final_sort}.items())

cp_isa = list(map(lambda x: list(x),final_sort))

for i in range(len(final_sort)) :
    (_, v) = final_sort[i]
    for j in range(i+1, len(final_sort)):
        cp_isa[j][1] += v


fig, ax = plt.subplots()
lean_thm_x_axis = list(map(lambda x: x[0], cp_lean))
lean_thm_y_axis = list(map(lambda x: x[1], cp_lean))

coq_thm_x_axis = list(map(lambda x: x[0], cp_coq))
coq_thm_y_axis = list(map(lambda x: x[1], cp_coq))

isa_thm_x_axis = list(map(lambda x: x[0], cp_isa))
isa_thm_y_axis = list(map(lambda x: x[1], cp_isa))
ax.plot(lean_thm_x_axis, lean_thm_y_axis, color="blue", label="Lean")
ax.plot(coq_thm_x_axis, coq_thm_y_axis, color="red", label="Coq")
ax.plot(isa_thm_x_axis, isa_thm_y_axis, color="orange", label="Isabelle")

ax.set_xlabel("Year")
ax.set_ylabel("Number of Commits")
plt.legend(fontsize="xx-large")
plt.show()