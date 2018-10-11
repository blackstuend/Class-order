import cv2
import os
import face_recognition
save_dirname=input('Enter your name:')
images_dir=os.path.join('.','images')
dir_name=os.path.join(images_dir,save_dirname)
photo_id=0
if not os.path.isdir(dir_name):
    os.mkdir(dir_name,755)
else:
    max=0
    for(root,dirs,files) in os.walk(dir_name):
        for file in files:
            main_number,ex=os.path.splitext(file)
            main_number=int(main_number)
            if max <= main_number:
                max=main_number
    photo_id=max+1
        
video_capture = cv2.VideoCapture(0) 

while True:
    ret, frame = video_capture.read()
    face_locations = face_recognition.face_locations(small_frame, model="cnn")
    for top, right, bottom, left in face_locations:
        # Scale back up face locations since the frame we detected in was scaled to 1/4 size
        top *= 4
        right *= 4
        bottom *= 4
        left *= 4
        # Extract the region of the image that contains the face
        str_photo_id=str(photo_id) 
        photo_name=str_photo_id+'.jpg'
        phote_dir=os.path.join(dir_name,photo_name)
        photo_id+=1
        face_image = frame[top:bottom, left:right]
        roi_frame = frame[y-20:y+h+20, x-20:x+w+20]
        cv2.imwrite(phote_dir,face_image)
        color=(255,0,0)
        stroke=2
        cv2.rectangle(frame,(left,top),(right,bottom),color,stroke)
    cv2.imshow('frame',frame)
    if cv2.waitKey(150) & 0xFF == ord('q'):
        break
video_capture.release()
cv2.destroyAllWindows()


