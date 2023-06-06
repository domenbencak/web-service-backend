FROM python:3

WORKDIR /app

RUN pip install flask
RUN pip install Image
RUN pip install deepface

COPY . .

EXPOSE 5000

CMD ["python3", "app.py"]
