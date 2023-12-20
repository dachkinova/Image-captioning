from flask import Flask, request, jsonify
from transformers import VisionEncoderDecoderModel, ViTImageProcessor, AutoTokenizer
import torch
from PIL import Image
from translate import Translator
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

model = VisionEncoderDecoderModel.from_pretrained(
    "nlpconnect/vit-gpt2-image-captioning")
feature_extractor = ViTImageProcessor.from_pretrained(
    "nlpconnect/vit-gpt2-image-captioning")
tokenizer = AutoTokenizer.from_pretrained(
    "nlpconnect/vit-gpt2-image-captioning")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

max_length = 16
num_beams = 4


def translate_to_bulgarian(text):
    translator = Translator(to_lang="bg")
    translation = translator.translate(text)
    return translation


@app.route("/generateCaption", methods=["POST"])
def generate_caption():
    if "image" not in request.files:
        return jsonify({"error": "No image provided"})

    image = request.files["image"]
    if image:
        i_image = Image.open(image)
        if i_image.mode != "RGB":
            i_image = i_image.convert(mode="RGB")

        images = [i_image]
        pixel_values = feature_extractor(
            images=images, return_tensors="pt").pixel_values
        pixel_values = pixel_values.to(device)

        output_ids = model.generate(
            pixel_values, max_length=max_length, num_beams=num_beams)
        preds = tokenizer.batch_decode(output_ids, skip_special_tokens=True)
        preds = [pred.strip() for pred in preds]

        translated_preds = [translate_to_bulgarian(pred) for pred in preds]

        response = {
            "english_caption": preds,
            "bulgarian_caption": translated_preds
        }

        return jsonify(response)
    else:
        return jsonify({"error": "Failed to generate captions"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
