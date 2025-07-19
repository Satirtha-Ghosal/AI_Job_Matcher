FROM python:3.10-slim

# Set workdir
WORKDIR /app

# Set Hugging Face cache directory to avoid permission issues
ENV HF_HOME=/data/.cache/huggingface
ENV TRANSFORMERS_CACHE=/data/.cache/huggingface/transformers
ENV HF_HUB_CACHE=/data/.cache/huggingface/hub

# Create cache dirs
RUN mkdir -p $HF_HOME $TRANSFORMERS_CACHE $HF_HUB_CACHE

# Install system dependencies
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy your source code
COPY . .

# Run the FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
