FROM python:3

RUN apt-get update && apt-get install -y libgl1-mesa-glx

WORKDIR /app

RUN pip install flask deepface

COPY . .

EXPOSE 5000

CMD ["python3", "app.py"]
