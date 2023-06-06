FROM python:3

# Install system dependencies
RUN apt-get update && apt-get install -y libgl1-mesa-glx

WORKDIR /app

RUN pip install flask opencv-python-headless deepface

COPY . .

EXPOSE 5000

CMD ["python3", "app.py"]
