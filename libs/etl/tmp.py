from etl.extract.posthog_extractor import PosthogExtractor
from etl.extract.generic_extractor import GenericExtractor
import json

# result = PosthogExtractor().get_clicks_events()
# events = result["results"]


# from collections import Counter

# pairs = []
# for event in events:
#     parsed_object = json.loads(event[2])
#     url = parsed_object.get("url", "")
#     referrer = parsed_object.get("referrer", "")
#     pairs.append((url, referrer))

# counter = Counter(pairs)
# # print(counter)

# import csv

# # Define CSV file name
# csv_filename = "url_referrer_count.csv"

# # Write to CSV
# with open(csv_filename, "w", newline="") as f:
#     writer = csv.writer(f)
#     writer.writerow(["URL", "Referrer", "Count"])  # Header
#     for (url, referrer), count in counter.items():
#         writer.writerow([url, referrer, count])

# print(f"Data successfully saved to {csv_filename}")

from datetime import datetime, timedelta
from etl.transform.dto.posthog import PosthogDTO

start_stat_date = last_stat_date = datetime.now() - timedelta(days=10)
yesterday_evening = datetime.now().replace(hour=23, minute=59, second=59) - timedelta(
    days=1
)
now = datetime.now()

# raw_visits_data = PosthogExtractor().get_unique_visitors_by_date_range(
#     start_stat_date,
#     yesterday_evening,
# )
# print(raw_visits_data["results"])
# detail_visits = PosthogExtractor().get_unique_visitors_detail_page_view_by_date_range(
#     start_stat_date, yesterday_evening
# )
# print(detail_visits["results"])

raw_response = GenericExtractor().get_detail_page_view_events(start_stat_date, now)
events = raw_response["results"]
improv = [PosthogDTO().convert_raw_event_to_posthog_events(event) for event in events]
print(improv[0])
print([item["company_id"] for item in improv])
# print(GenericExtractor().get_detail_page_view_events(start_stat_date, now))
# type: type,
# title: title,
# url: window.location.href,
# company: CompanyData.toString()

# print(GenericExtractor().get_external_link_click_events(start_stat_date, now))
# type: type,
# link: link.href,
# url: window.location.href,
# company: CompanyData.toString()
