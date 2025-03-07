class DailyWebStat:
    def __init__(self, date, visit_count):
        self.date = date
        self.visit_count = visit_count

    def __repr__(self):
        return f"Visiteurs uniques du {self.date} : {self.visit_count})"
