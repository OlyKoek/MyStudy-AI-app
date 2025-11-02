import os, shutil
from flask import Flask, request, redirect, url_for, render_template
from markupsafe import Markup
from werkzeug.utils import secure_filename
from PIL import Image
import numpy as np

# tensorflow.keras.modelsからkeras3に変更
import keras
import tensorflow as tf

# GPUメモリの増殖対策
gpus = tf.config.list_physical_devices('GPU')
for gpu in gpus:
    tf.config.experimental.set_memory_growth(gpu, True)

# 色々とモデル学習側をいじったらエラーになったので、以下を追加
print("KERAS_VERSION:", keras.__version__)
print("TF_VERSION:", tf.__version__)
try:
    from keras import backend as K
    print("KERAS_BACKEND:", K.backend())
except Exception as e:
    print("KERAS_BACKEND_CHECK_FAILED:", e)


UPLOAD_FOLDER = "./static/images/"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

labels = ["飛行機","自動車", "鳥", "猫", "鹿", "犬", "カエル", "馬", "船", "トラック"]
n_class = len(labels)
img_size = 32
n_result = 3  # 上位3つの結果を表示



app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

MODEL_PATH = "./image_classifier.keras"
model = keras.models.load_model(MODEL_PATH, compile=False)

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/", methods=["GET", "POST"])
def index():
    return render_template("index.html")

@app.route("/result", methods=["GET","POST"])
def result():
    if request.method == "POST":
        # ファイルの存在と形式を確認
        if "file" not in request.files:
            print("File doesn't exist!")
            return redirect(url_for("index"))
        file = request.files["file"]
        if not allowed_file(file.filename):
            print(file.filename + ": File not allowed!")
            return redirect(url_for("index"))

        # ファイルの保存
        if os.path.isdir(UPLOAD_FOLDER):
            shutil.rmtree(UPLOAD_FOLDER) 
        os.mkdir(UPLOAD_FOLDER)
        filename = secure_filename(file.filename)  # ファイル名を安全なものに
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        # 画像の読み込み
        image = Image.open(filepath)
        image = image.convert("RGB")
        image = image.resize((img_size, img_size))
        x = np.asarray(image, dtype="float32")
        x = x.reshape(1, img_size, img_size, 3)    

        # 予測
        y = model.predict(x, verbose=0)[0]
        sorted_idx = np.argsort(y)[::-1]  # 降順でソート
        result = ""
        for i in range(n_result):
            idx = sorted_idx[i]
            ratio = y[idx]
            label = labels[idx]
            result += "<p>" + str(round(ratio*100, 1)) + "%の確率で" + label + "です。</p>"
        return render_template("result.html", result=Markup(result), filepath=filepath)
    else:
        return redirect(url_for("index"))

if __name__ == "__main__":
    app.run(debug=True)