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

# # Figure 1

# # Coq
# with open('DataCollection/CoqTheorems.json') as f:
#     # Load the JSON data into a Python dictionary
#     theorem_data = json.load(f)

# # Incrementing date every time a theorem is proved
# date_theorem = {}
# totaltheorems = 0
# for element in theorem_data:
#     totaltheorems += 1
#     if isinstance(element, dict):
#         sources = element['sources'][0]
#         if 'commits' in sources:
#             commit = sources['commits']
#             if len(commit) > 0:
#                 last_commit_date = commit[len(commit) - 1]['date']
#                 lcd_datetime = datetime.strptime(last_commit_date, "%Y-%m-%dT%H:%M:%S%z").year
#                 date_theorem[lcd_datetime] = date_theorem.get(lcd_datetime, 0) + 1
#     else:
#         print("Each element in the JSON file must be a dictionary.")

# # manual input for those without valid json entries
# sort_dates = list(date_theorem.keys())
# sort_dates.sort()
# sorted_dt= {i: date_theorem[i] for i in sort_dates}

# sorted_dt[2002] = sorted_dt.get(2002, 0) + 1
# sorted_dt[2007] = sorted_dt.get(2007, 0) + 2
# sorted_dt[2008] = sorted_dt.get(2008, 0) + 1
# sorted_dt[2003] = sorted_dt.get(2003, 0) + 2
# sorted_dt[2000] = 1
# sorted_dt[1999] = 1
# sorted_dt[2002] = sorted_dt.get(2002, 0) + 1
# sorted_dt[2006] = sorted_dt.get(2006, 0) + 2
# sorted_dt[2021] = sorted_dt.get(2021, 0) + 2
# sorted_dt[2022] = sorted_dt.get(2022, 0) + 1
# sorted_dt[2004] = sorted_dt.get(2004, 0) + 5
# sorted_dt[2014] = sorted_dt.get(2014, 0) + 1
# sorted_dt[2020] = sorted_dt.get(2020, 0) + 1
# sorted_dt[2005] = sorted_dt.get(2005, 0) + 1
# sorted_dt[2010] = sorted_dt.get(2010, 0) + 1
# sorted_dt[2015] = sorted_dt.get(2015, 0) + 4

# final_sort = list(sorted_dt.keys())
# final_sort.sort()
# final_sort= list({i: sorted_dt[i] for i in final_sort}.items())

# cp_coq = list(map(lambda x: list(x),final_sort))

# # Accumulate values 
# for i in range(len(final_sort)) :
#     (_, v) = final_sort[i]
#     for j in range(i+1, len(final_sort)):
#         cp_coq[j][1] += v

# print(cp_coq)

# # Do same thing for Lean
# with open('DataCollection/LeanTheorems.json') as f:
#     # Load the JSON data into a Python dictionary
#     theorem_data = json.load(f)

# date_theorem = {}
# totaltheorems = 0
# for element in theorem_data:
#     totaltheorems += 1
#     if isinstance(element, dict):
#         sources = element['sources'][0]
#         if 'commits' in sources:
#             commit = sources['commits']
#             if len(commit) > 0:
#                 last_commit_date = commit[len(commit) - 1]['date']
#                 lcd_datetime = datetime.strptime(last_commit_date, "%Y-%m-%dT%H:%M:%S%z").year
#                 date_theorem[lcd_datetime] = date_theorem.get(lcd_datetime, 0) + 1
#             else :
#                 print("zero commit github:" + str(element['theorem_number']))
#         else :
#             print("non github:" + str(element['theorem_number']))
#     else:
#         print("Each element in the JSON file must be a dictionary.")

# date_theorem[2020] = date_theorem.get(2020, 0) + 1

# final_sort = list(date_theorem.keys())
# final_sort.sort()
# final_sort= list({i: date_theorem[i] for i in final_sort}.items())

# cp_lean = list(map(lambda x: list(x),final_sort))

# for i in range(len(final_sort)) :
#     (_, v) = final_sort[i]
#     for j in range(i+1, len(final_sort)):
#         cp_lean[j][1] += v

# # and Isabelle
# with open('DataCollection/IsabelleTheorems.json') as f:
#     # Load the JSON data into a Python dictionary
#     theorem_data = json.load(f)

# date_theorem = {}
# totaltheorems = 0
# for element in theorem_data:
#     totaltheorems += 1
#     if isinstance(element, dict):
#         sources = element['sources'][0]
#         if 'commits' in sources:
#             commit = sources['commits']
#             if len(commit) > 0:
#                 last_commit_date = commit[len(commit) - 1]['date']
#                 lcd_datetime = datetime.strptime(last_commit_date, "%Y-%m-%dT%H:%M:%S%z").year
#                 date_theorem[lcd_datetime] = date_theorem.get(lcd_datetime, 0) + 1
#         #     else :
#         #         print("zero commit github:" + str(element['theorem_number']))
#         # else :
#         #     print("non github:" + str(element['theorem_number']))
#     else:
#         print("Each element in the JSON file must be a dictionary.")

# date_theorem[2004] = date_theorem.get(2004, 0) + 2
# date_theorem[2006] = date_theorem.get(2006, 0) + 1
# date_theorem[2017] = date_theorem.get(2017, 0) + 6
# date_theorem[2018] = date_theorem.get(2018, 0) + 4
# date_theorem[2013] = date_theorem.get(2013, 0) + 3
# date_theorem[2012] = date_theorem.get(2012, 0) + 2
# date_theorem[2015] = date_theorem.get(2015, 0) + 5
# date_theorem[2007] = date_theorem.get(2007, 0) + 3
# date_theorem[2022] = date_theorem.get(2022, 0) + 1
# date_theorem[2021] = date_theorem.get(2021, 0) + 3
# date_theorem[2014] = date_theorem.get(2014, 0) + 1
# date_theorem[2016] = date_theorem.get(2016, 0) + 3
# date_theorem[2009] = date_theorem.get(2009, 0) + 1
# date_theorem[2019] = date_theorem.get(2019, 0) + 1
# date_theorem[2008] = date_theorem.get(2008, 0) + 1

# final_sort = list(date_theorem.keys())
# final_sort.sort()
# final_sort= list({i: date_theorem[i] for i in final_sort}.items())

# cp_isa = list(map(lambda x: list(x),final_sort))

# for i in range(len(final_sort)) :
#     (_, v) = final_sort[i]
#     for j in range(i+1, len(final_sort)):
#         cp_isa[j][1] += v

# print(cp_isa)

# # Plotting Figure 1
# fig, ax = plt.subplots()
# lean_thm_x_axis = list(map(lambda x: x[0], cp_lean))
# lean_thm_y_axis = list(map(lambda x: x[1], cp_lean))

# coq_thm_x_axis = list(map(lambda x: x[0], cp_coq))
# coq_thm_y_axis = list(map(lambda x: x[1], cp_coq))

# isa_thm_x_axis = list(map(lambda x: x[0], cp_isa))
# isa_thm_y_axis = list(map(lambda x: x[1], cp_isa))
# ax.plot(lean_thm_x_axis, lean_thm_y_axis, color="blue", label="Lean")
# ax.plot(coq_thm_x_axis, coq_thm_y_axis, color="red", label="Coq")
# ax.plot(isa_thm_x_axis, isa_thm_y_axis, color="orange", label="Isabelle")

# ax.set_xlabel("Year")
# ax.set_ylabel("Number of proven theorems with code")
# plt.legend(fontsize="xx-large")
# plt.show()

# Figure 2

# # This just displays all the different assistants in the same graph.
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


# Figure 3

# coq_names = coq_figures.names
# coq_commits = coq_figures.commits_copy

# lean_names = lean_figures.names
# lean_commits = lean_figures.commits_copy

# isa_names = isabelle_figures.names
# isa_commits = isabelle_figures.commits_copy

# Delete invalid entry
# del isa_names[11]
# del isa_commits[11]

# isa_names = list(map(lambda x: int(x), isa_names))
# isa_commits = list(map(lambda x: int(x), isa_commits))

# plt.figure(figsize=(15, 3))
# plt.scatter(coq_names, coq_commits, color='red', label ="Coq")
# plt.scatter(lean_names, lean_commits, color='blue', label ="Lean")
# plt.scatter(isa_names, isa_commits, color='orange', label ="Isabelle")
# plt.xlabel("Theorem", fontsize=24)
# plt.ylabel("Number of Commits", fontsize=16)
# plt.xticks([5*x for x in range(0, 20)])
# plt.legend(fontsize="xx-large")
# plt.savefig('test.png', bbox_inches='tight')

# # Figure 4

# # Add everything to a dictionary with Year::Eq1 for Coq
# coq_pr_data = []
# for filename in os.listdir('DataCollection/coq-prs'):
#     # Check if the file is a JSON file
#     if filename.endswith(".json"):
#         # Read the JSON data from the file
#         with open(os.path.join('DataCollection/coq-prs', filename), "r") as f:
#             coq_pr = json.load(f)
#         # Append the JSON data to the list
#         coq_pr_data.extend(coq_pr)

# coq_year_num = {}
# for element in coq_pr_data:
#     date = datetime.strptime(element['open_date'], "%Y-%m-%dT%H:%M:%S%z").year
#     coq_year_num[date] = coq_year_num.get(date, 0) + 1

# coq_issue_data = []
# for filename in os.listdir('DataCollection/coq-issues'):
#     # Check if the file is a JSON file
#     if filename.endswith(".json"):
#         filepath = os.path.join('DataCollection/coq-issues', filename)
#         try:
#             with open(filepath) as f:
#                 data = json.load(f)
#                 coq_issue_data.extend(data)
#         except json.JSONDecodeError:
#             pass

# for element in coq_issue_data:
#     date = datetime.strptime(element['open_date'], "%Y-%m-%dT%H:%M:%S%z").year
#     coq_year_num[date] = coq_year_num.get(date, 0) + 1

# with open('DataCollection/CoqTheorems.json') as f:
#     # Load the JSON data into a Python dictionary
#     theorem_data = json.load(f)

# for element in theorem_data:
#     # Check if the element is a dictionary
#     if isinstance(element, dict):
#         # Get the length of the dictionary (i.e., the number of key-value pairs)
#         sources = element['sources'][0]
#         if 'commits' in sources:
#             commits = sources['commits']
#             if len(commits) > 0:
#                 for commit in commits:
#                     date = datetime.strptime(commit['date'], "%Y-%m-%dT%H:%M:%S%z").year
#                     coq_year_num[date] = coq_year_num.get(date, 0) + 1
#     else:
#         # If it's not a dictionary, print an error message
#         print("Each element in the JSON file must be a dictionary.")

# # print(coq_year_num)

# # Add everything to a dictionary with Year::Eq1 for Lean 
# lean_pr_data = []
# with open('DataCollection/leanprover-community_lean_PullRequests.json') as f_lean_pr:
#     lean_pr = json.load(f_lean_pr)
#     lean_pr_data.extend(lean_pr)

# with open('DataCollection/leanprover-community_mathlib_PullRequests.json') as f_mathlib_is:
#     # Load the JSON data into a Python dictionary
#     mathlib_prs = json.load(f_mathlib_is)
#     lean_pr_data.extend(mathlib_prs)

# lean_issue_data = []

# with open('DataCollection/leanprover-community_lean_Issues.json') as f_lean_is:
#     # Load the JSON data into a Python dictionary
#     lean_issues = json.load(f_lean_is)
#     lean_issue_data.extend(lean_issues)

# with open('DataCollection/leanprover-community_mathlib_Issues.json') as f_mathlib_is:
#     # Load the JSON data into a Python dictionary
#     mathlib_issues = json.load(f_mathlib_is)
#     lean_issue_data.extend(mathlib_issues)

# lean_year_num = {}
# for element in lean_pr_data:
#     date = datetime.strptime(element['open_date'], "%Y-%m-%dT%H:%M:%S%z").year
#     lean_year_num[date] = lean_year_num.get(date, 0) + 1
# for element in lean_issue_data:
#     date = datetime.strptime(element['open_date'], "%Y-%m-%dT%H:%M:%S%z").year
#     lean_year_num[date] = lean_year_num.get(date, 0) + 1

# with open('DataCollection/LeanTheorems.json') as f:
#     # Load the JSON data into a Python dictionary
#     theorem_data = json.load(f)

# for element in theorem_data:
#     # Check if the element is a dictionary
#     if isinstance(element, dict):
#         # Get the length of the dictionary (i.e., the number of key-value pairs)
#         sources = element['sources'][0]
#         if 'commits' in sources:
#             commits = sources['commits']
#             if len(commits) > 0:
#                 for commit in commits:
#                     date = datetime.strptime(commit['date'], "%Y-%m-%dT%H:%M:%S%z").year
#                     lean_year_num[date] = lean_year_num.get(date, 0) + 1
#     else:
#         # If it's not a dictionary, print an error message
#         print("Each element in the JSON file must be a dictionary.")

# # print(lean_year_num)

# # And now generate graph
# coq_sort = list(coq_year_num.keys())
# coq_sort.sort()
# coq_sort = list({i: coq_year_num[i] for i in coq_sort}.items())
# coq_sort = list(map(lambda x: list(x), coq_sort))

# lean_sort = list(lean_year_num.keys())
# lean_sort.sort()
# lean_sort = list({i: lean_year_num[i] for i in lean_sort}.items())
# lean_sort = list(map(lambda x: list(x), lean_sort))

# print(coq_sort)
# print(lean_sort)

# coq_years = list(map(lambda x : x[0], coq_sort))
# coq_rate = list(map(lambda x : x[1], coq_sort))
# lean_years = list(map(lambda x : x[0], lean_sort))
# lean_rate = list(map(lambda x : x[1], lean_sort))

# fig, ax = plt.subplots()

# ax.plot(coq_years, coq_rate, label="Coq", color="red")
# ax.plot(lean_years, lean_rate, label="Lean", color="blue")
# ax.set_xlabel("Year")
# ax.set_ylabel("Rate of Growth")
# ax.legend(fontsize="xx-large")
# plt.show()