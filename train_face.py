import face_recognition
import cv2
import os
import pickle

known_face_encodings = []
known_face_names = []
BASE_DIR=os.path.dirname(os.path.abspath(__file__))
image_dir=os.path.join(BASE_DIR,'images')


for (root,dirs,files) in os.walk(image_dir):
    for file in files:
        if file.endswith('png') or file.endswith('jpg'):
            path = os.path.join(root,file)
            label=os.path.basename(root).replace(' ',"-").lower()
            person_image = face_recognition.load_image_file(path)
            person_face_encoding = face_recognition.face_encodings(person_image)[0]
            known_face_encodings.append(person_face_encoding)
            known_face_names.append(label)
print(known_face_names)
with open('./train_data/know_face.pickle','wb') as f:
    pickle.dump(known_face_names,f)
with open("./train_data/know_face_encode.pickle",'wb') as f:
    pickle.dump(known_face_encodings,f)
