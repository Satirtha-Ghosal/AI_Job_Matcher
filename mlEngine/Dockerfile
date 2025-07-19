FROM python:3.10-slim

# Set workdir
WORKDIR /app

# ✅ Set Hugging Face cache directory (only use HF_HOME — it's enough)
ENV HF_HOME=/tmp/huggingface
RUN mkdir -p $HF_HOME && chmod -R 777 $HF_HOME


# ✅ Let HF Spaces know what port to expect
ENV PORT=7860

# Install system dependencies
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy your source code
COPY . .

# Run the FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
