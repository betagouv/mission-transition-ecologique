FROM python:3.11-slim
WORKDIR /usr/src
COPY requirements.txt .
RUN apt-get update \
    && apt-get -y install libpq-dev gcc \
    && pip install psycopg2
RUN pip install -r requirements.txt
COPY . .
CMD ["sh", "-c", "python -m etl.pipelines.database_update"]
