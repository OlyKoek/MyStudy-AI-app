import os
from io import BytesIO
import numpy as np
from fastapi import APIRouter, UploadFile, File, HTTPException
from tensorflow import config as tf_config
from PIL import Image
import keras

# GPUメモリ対策
gpus = tf_config.list_physical_devices('GPU')
for gpu in gpus:
    try:
        tf_config.experimental.set_memory_growth(gpu, True)
    except Exception as e:
        print("GPU memory growth setting failed:", e)

print("KERAS_VERSION:", keras.__version__)



# Load model
MODEL_PATH = os.getenv("MODEL_PATH", "app/model/image_classifier.keras")
model = keras.models.load_model(MODEL_PATH, compile=False)
print("✅ Model loaded:", MODEL_PATH)


labels = ["飛行機", "自動車", "鳥", "猫", "鹿", "犬", "カエル", "馬", "船", "トラック"]
n_result = 3
img_size = 32

router = APIRouter(prefix="/predict", tags=["Prediction"])

# ---------------------------
# Endpoint
# ---------------------------
@router.post("/")
async def predict_image(file: UploadFile = File(...)):
    """画像を受け取り、モデルで分類結果を返す"""
    try:
        contents = await file.read()
        image = Image.open(BytesIO(contents)).convert("RGB")
        image = image.resize((img_size, img_size))
        x = np.asarray(image, dtype="float32")
        x = x.reshape(1, img_size, img_size, 3)

        y = model.predict(x, verbose=0)[0]
        sorted_idx = np.argsort(y)[::-1]

        results = []
        for i in range(n_result):
            idx = sorted_idx[i]
            results.append({
                "label": labels[idx],
                "probability": round(float(y[idx]), 4)
            })

        return {"predictions": results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
