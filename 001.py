import json
import matplotlib.pyplot as plt
import numpy as np
import matplotlib.dates as mdates
from datetime import datetime

# Open the JSON file
with open('DataCollection/LeanTheorems.json') as f:
    # Load the JSON data into a Python dictionary
    data = json.load(f)

print(f"number of theorems : {len(data)}")

commits = []
last_commit_date =  []
names = []
# Loop through each element in the list
for element in data:
    # Check if the element is a dictionary
    if isinstance(element, dict):
        # Get the length of the dictionary (i.e., the number of key-value pairs)
        sources = element['sources'][0]
        if 'commits' in sources:
            commit = sources['commits']
            count = len(commit)
            # Print the length of the dictionary
            print(f"The number of commits of theorem {element['theorem_number']} is {count}")
            # Add the length to the list of lengths
            commits.append(count)
            names.append(element['theorem_number'])
            if len(commit) > 0:
                #print(f"last commit of theorem {element['theorem_number']} is {commit[len(commit) - 1]['date']}")
                last_commit_date.append(commit[len(commit) - 1]['date'])
    else:
        # If it's not a dictionary, print an error message
        print("Each element in the JSON file must be a dictionary.")


# These are here because of a JSON bug in theorem 96 of Lean.
# Uncomment if you want the Lean plot
# names.append(96)
# commits.append(1)

# print(commits)
# print(last_commit_date)
# # Plot a histogram of the lengths using matplotlib
# plt.figure(figsize=(15, 3))
# plt.scatter(names, commits)
# plt.suptitle('Lean Commit Counts per Therem\n')
# # plt.title('\nTheorem 41 excluded as outlier', fontsize = 6)
# plt.show()

# Convert date strings (e.g. 2014-10-18) to datetime
dates = [datetime.strptime(d, "%Y-%m-%dT%H:%M:%S%z") for d in last_commit_date]

# Choose some nice levels
levels = np.tile([-5, 5, -3, 3, -1, 1],
                 int(np.ceil(len(dates)/6)))[:len(dates)]

# Create figure and plot a stem plot with the date
fig, ax = plt.subplots(figsize=(14, 4), layout="constrained")
ax.set(title="CoqTheorems latest commit dates per theorem")

ax.vlines(dates, 0, levels, color="tab:red")  # The vertical stems.
ax.plot(dates, np.zeros_like(dates), "-o",
        color="k", markerfacecolor="w")  # Baseline and markers on it.

# annotate lines
for d, l, r in zip(dates, levels, names):
    ax.annotate(r, xy=(d, l),
                xytext=(-3, np.sign(l)*3), textcoords="offset points",
                horizontalalignment="right",
                verticalalignment="bottom" if l > 0 else "top")

# format x-axis with 4-month intervals
ax.xaxis.set_major_locator(mdates.MonthLocator(interval=12))
ax.xaxis.set_major_formatter(mdates.DateFormatter("%b %Y"))
plt.setp(ax.get_xticklabels(), rotation=30, ha="right")

# remove y-axis and spines
ax.yaxis.set_visible(False)
ax.spines[["left", "top", "right"]].set_visible(False)

ax.margins(y=0.3)
plt.show()