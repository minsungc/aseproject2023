import json
import matplotlib.pyplot as plt
import numpy as np
import matplotlib.dates as mdates
from datetime import datetime
import os
from langdetect import detect
from langdetect import detect_langs
import pandas as pd

coq_issue_data = []

# Loop through each file in the folder
for filename in os.listdir('DataCollection/coq-issues'):
    # Check if the file is a JSON file
    if filename.endswith(".json"):
        filepath = os.path.join('DataCollection/coq-issues', filename)
        try:
            with open(filepath) as f:
                data = json.load(f)
                coq_issue_data.extend(data)
        except json.JSONDecodeError:
            pass

comments = []

for element in coq_issue_data:
    if len(element['discussion']) > 0:
        comments.append(element['discussion'])

# Initialize a pandas DataFrame to store the language and year data
lang_data = pd.DataFrame(columns=["language", "year", "count"])

# Iterate over the comments and detect the language of each text
for comment in comments:
    for item in comment:
            try:
                print('.')
                lang = detect(item['comment'])
                date = pd.to_datetime(item["date"], format="%Y-%m-%dT%H:%M:%S%z")
                year = date.year
                lang_data = lang_data.append({"language": lang, "year": year, "count": 1}, ignore_index=True)
                print(lang_data)
            except Exception as e:
                #print(f"Failed to detect language for '{comment['date']}': {e}")
                pass

# Group the language data by language and year and count the number of comments in each group
lang_count = lang_data.groupby(["language", "year"]).count().reset_index()
# Compute the total count of comments in each year
year_count = lang_count.groupby("year")["count"].sum()
# Compute the percentage of comments in each language to all comments of the year
lang_count["percent"] = lang_count.apply(lambda x: x["count"] / year_count[x["year"]] * 100, axis=1)

# Create a plot with a line for each language
fig, ax = plt.subplots()
for lang in lang_count["language"].unique():
    lang_data = lang_count[lang_count["language"] == lang]
    ax.plot(lang_data["year"], lang_data["percent"], label=lang)
ax.set_xlabel("Year")
ax.set_ylabel("Percentage of Comments")
ax.legend(title='Language')
ax.set(title="issues in different languages '%' in each year")
plt.show()