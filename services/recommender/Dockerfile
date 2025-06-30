# Use official Python image
FROM python:3.10-slim

# Set work directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code and data
COPY . .

# Expose the port FastAPI will run on
EXPOSE 8008

# Run the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8008"]
