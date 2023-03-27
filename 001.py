import json
import matplotlib.pyplot as plt

# Open the JSON file
with open('CoqTheorems.json') as f:
    # Load the JSON data into a Python dictionary
    data = json.load(f)

print(f"number of theorems : {len(data)}")

commits = []
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
    else:
        # If it's not a dictionary, print an error message
        print("Each element in the JSON file must be a dictionary.")

print(commits)
# Plot a histogram of the lengths using matplotlib
plt.figure(figsize=(9, 3))
plt.scatter(names, commits)
plt.suptitle('Commit Counts')
plt.show()