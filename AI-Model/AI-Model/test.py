import cv2
from cvzone.HandTrackingModule import HandDetector
from cvzone.ClassificationModule import Classifier
import numpy as np
import math
import time

last_error_displayed = {
    "camera_error": 0,
    "aspect_ratio_error": 0,
    "close_to_camera_error": 0,
    "no_hand_detected_error": 0,
    "general_error": 0
}


def can_display_error(error_key):
    current_time = time.time()
    if current_time - last_error_displayed[error_key] >= 5:
        last_error_displayed[error_key] = current_time
        return True
    return False


s = ""
my_message = []

cap = cv2.VideoCapture(0)
detector = HandDetector(maxHands=1)
classifier = Classifier("Model/keras_model.h5", "Model/labels.txt")

offset = 20
imgSize = 300

counter = 0

labels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W",
          "X", "Y", "Z"]

while True:
    try:
        success, img = cap.read()
        if not success:
            if can_display_error("camera_error"):
                print("Failed to read frame from camera. Please check your camera connection.")
            continue

        imgOutput = img.copy()
        hands, img = detector.findHands(img)
        if hands:
            hand = hands[0]
            x, y, w, h = hand['bbox']

            imgWhite = np.ones((imgSize, imgSize, 3), np.uint8) * 255
            imgCrop = img[y - offset:y + h + offset, x - offset:x + w + offset]

            imgCropShape = imgCrop.shape
            aspectRatio = h / w

            if aspectRatio > 1:
                k = imgSize / h
                wCal = math.ceil(k * w)
                imgResize = cv2.resize(imgCrop, (wCal, imgSize))
                wGap = math.ceil((imgSize - wCal) / 2)
                imgWhite[:, wGap:wCal + wGap] = imgResize
                prediction, index = classifier.getPrediction(imgWhite, draw=False)
            else:
                k = imgSize / w
                hCal = math.ceil(k * h)
                imgResize = cv2.resize(imgCrop, (imgSize, hCal))
                hGap = math.ceil((imgSize - hCal) / 2)
                imgWhite[hGap:hCal + hGap, :] = imgResize
                prediction, index = classifier.getPrediction(imgWhite, draw=False)

            last_print_time = 0
            current_time = time.time()
            if current_time - last_print_time >= 2:
                my_message.append(labels[index])
                print(f"{labels[index]}")
                last_print_time = current_time

            cv2.rectangle(imgOutput, (x - offset, y - offset - 50), (x - offset + 90, y - offset - 50 + 50), (0, 245, 0), cv2.FILLED)
            cv2.putText(imgOutput, labels[index], (x, y - 25), cv2.FONT_HERSHEY_COMPLEX, 1.7, (255, 255, 255), 2)
            cv2.rectangle(imgOutput, (x - offset, y - offset), (x + w + offset, y + h + offset), (0, 245, 0), 4)

            cv2.imshow("ImageCrop", imgCrop)
            cv2.imshow("ImageWhite", imgWhite)

            if len(hands) > 1:
                for x in my_message:
                    s += x
                print(s)
                s = ""
                my_message.clear()


        cv2.imshow("Image", imgOutput)
        cv2.waitKey(1)

    except Exception as e:
        if can_display_error("general_error"):
            print(f"An error occurred: {e}")
            print("Please ensure your hand is visible and not too close to the camera.")
        continue

    if not hands:
        if can_display_error("no_hand_detected_error"):
            print("No hand detected. Please place your hand inside the frame.")