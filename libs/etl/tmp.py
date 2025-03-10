from etl.extract.posthog_extractor import PosthogExtractor
import json

result = PosthogExtractor().get_clicks_event()
events = result["results"]


from collections import Counter

pairs = []
for event in events:
    parsed_object = json.loads(event[2])
    url = parsed_object.get("url", "")
    referrer = parsed_object.get("referrer", "")
    pairs.append((url, referrer))

counter = Counter(pairs)
# print(counter)

import csv

# Define CSV file name
csv_filename = "url_referrer_count.csv"

# Write to CSV
with open(csv_filename, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["URL", "Referrer", "Count"])  # Header
    for (url, referrer), count in counter.items():
        writer.writerow([url, referrer, count])

print(f"Data successfully saved to {csv_filename}")
