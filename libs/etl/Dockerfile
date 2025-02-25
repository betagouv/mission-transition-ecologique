FROM python:3.11-slim
WORKDIR /usr/src
COPY . .
RUN apt-get update \
    && apt-get -y install libpq-dev gcc \
    && pip install psycopg2
RUN pip install -r requirements.txt

CMD ["python", "tmp.py"]
