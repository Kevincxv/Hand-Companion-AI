import numpy as np
import pandas as pd
import tensorflow as tf
from flask import Flask, render_template, request
from gtts import gTTS
import os

datasetPath = 'Dataset/'

# Load and preprocess the data
train_data = pd.read_csv(f'{datasetPath}sign_mnist_train/sign_mnist_train.csv')
test_data = pd.read_csv(f'{datasetPath}sign_mnist_test/sign_mnist_test.csv')

train_labels = train_data['label'].values
train_images = train_data.drop('label', axis=1).values

test_labels = test_data['label'].values
test_images = test_data.drop('label', axis=1).values

train_images = train_images.reshape(-1, 28, 28, 1).astype('float32') / 255.0
test_images = test_images.reshape(-1, 28, 28, 1).astype('float32') / 255.0

train_labels = tf.keras.utils.to_categorical(train_labels)
test_labels = tf.keras.utils.to_categorical(test_labels)

# Define the model
model = tf.keras.models.Sequential([
    tf.keras.layers.Conv2D(32, (3,3), activation='relu', input_shape=(28, 28, 1)),
    tf.keras.layers.MaxPooling2D(2, 2),
    tf.keras.layers.Conv2D(64, (3,3), activation='relu'),
    tf.keras.layers.MaxPooling2D(2,2),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(512, activation='relu'),
    tf.keras.layers.Dropout(0.5),
    tf.keras.layers.Dense(25, activation='softmax')
])

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(train_images, train_labels, validation_data=(test_images, test_labels), epochs=10, batch_size=32)

# Mapping of labels to letters
label_to_letter = {i: chr(65 + i) for i in range(9)}
label_to_letter.update({i: chr(66 + i) for i in range(9, 25)})

# Transcribe function
def transcribe(image_path):
    image = tf.keras.preprocessing.image.load_img(image_path, target_size=(28, 28), color_mode="grayscale")
    image = tf.keras.preprocessing.image.img_to_array(image)
    image = np.expand_dims(image, axis=0) / 255.0

    prediction = model.predict(image)
    predicted_label = np.argmax(prediction, axis=1)[0]

    return label_to_letter[predicted_label]

# Flask app
app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        image = request.files['image']
        image_path = f"uploads/{image.filename}"
        image.save(image_path)

        letter = transcribe(image_path)

        # Convert text to audio
        tts = gTTS(text=letter, lang='en')
        audio_path = f"static/audio/{letter}.mp3"
        tts.save(audio_path)

        return render_template('temp.html', letter=letter, audio_path=audio_path)

    return render_template('temp.html', letter=None, audio_path=None)


if __name__ == '__main__':
    app.run(debug=True)