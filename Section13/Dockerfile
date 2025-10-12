# GPU対応TensorFlowの公式イメージを使用
FROM tensorflow/tensorflow:2.20.0-gpu

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    # TF の冗長ログを抑制
    TF_CPP_MIN_LOG_LEVEL=2 \
    # OOM回避のためGPUメモリを必要分だけ確保
    TF_FORCE_GPU_ALLOW_GROWTH=true

WORKDIR /workspace

RUN pip install --no-cache-dir --upgrade pip setuptools wheel
COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade --ignore-installed -r requirements.txt

COPY . .
CMD ["python", "-m", "flask", "run", "--host", "0.0.0.0", "--port", "5000"]