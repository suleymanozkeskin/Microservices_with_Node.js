## We have already built images for each of the microservices within their respective directories. Now we will build the image for the entire application.
## Since the dockerization of each service has been done with main.py , in this image we have to add python and pip to the image.
## We will also add the requirements.txt file to the image.
## We will also add the main.py file to the image.

FROM python:3.8.10-alpine3.13

WORKDIR /app

COPY ./ ./

CMD ["python3", "main.py"]


