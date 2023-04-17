import json
import matplotlib.pyplot as plt
import numpy as np
import matplotlib.dates as mdates
from datetime import datetime

# Open the JSON file
with open('CoqTheorems.json') as f:
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
            # Uncomment 27-28 if don't want to see that random theorem with 900 commits
            # if int(element['theorem_number'])==41 :
            #     continue
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

print(commits)
print(last_commit_date)
# Plot a histogram of the lengths using matplotlib
plt.figure(figsize=(15, 3))
plt.scatter(names, commits)
plt.suptitle('CoqTheorems Commit Counts per Therem')
plt.show()

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
ax.xaxis.set_major_locator(mdates.MonthLocator(interval=6))
ax.xaxis.set_major_formatter(mdates.DateFormatter("%b %Y"))
plt.setp(ax.get_xticklabels(), rotation=30, ha="right")

# remove y-axis and spines
ax.yaxis.set_visible(False)
ax.spines[["left", "top", "right"]].set_visible(False)

ax.margins(y=0.1)
plt.show()