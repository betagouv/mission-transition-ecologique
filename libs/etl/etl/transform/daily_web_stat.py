class DailyWebStat:
    STAT_DATE = "stat_date"
    UNIQUE_VISITORS = "unique_visitors"
    DETAIL_PAGE_UNIQUE_VISITORS = "detail_page_unique_visitors"

    def __init__(self, date, visit_count, detail_page_visit_count):
        self.date = date
        self.visit_count = visit_count
        self.detail_page_visit_count = detail_page_visit_count

    def __repr__(self):
        return f"Visiteurs uniques du {self.date} : {self.visit_count})"

    @staticmethod
    def from_arrays(visit_counts, detail_page_visit_counts):
        stats = []
        visit_dict = {date: count for date, count in visit_counts}
        detail_dict = {date: count for date, count in detail_page_visit_counts}

        all_dates = set(visit_dict.keys()).union(set(detail_dict.keys()))

        for date in all_dates:
            visit_count = visit_dict.get(date, 0)
            detail_page_visit_count = detail_dict.get(date, 0)
            stats.append(DailyWebStat(date, visit_count, detail_page_visit_count))

        return stats
