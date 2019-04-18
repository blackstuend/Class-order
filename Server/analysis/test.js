const delay = 10;
const {
    cv,
    getDataFilePath,
    drawBlueRect
} = require('./utils');
const fr = require('face-recognition').withCv(cv)
var region;
const devicePort = 0;
const vCap = new cv.VideoCapture(devicePort);
const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
const numDetectionsTh = 10;
let done = false;
const modelState = require('./model.json')
const recognizer = fr.AsyncFaceRecognizer()
recognizer.load(modelState)
var newFrame;
const intvl = setInterval(() => {
    let frame = vCap.read();
    // loop back to start on end of stream reached
    if (frame.empty) {
        vCap.reset();
        frame = vCap.read();
    }
    const { objects, numDetections } = classifier.detectMultiScale(frame.bgrToGray());
    objects.forEach((rect, i) => {
        const thickness = numDetections[i] < numDetectionsTh ? 1 : 2;
        region = frame.getRegion(new cv.Rect(rect.x, rect.y, rect.width, rect.height))
        newFrame = frame.getRegion(rect).copy();
        drawBlueRect(frame, rect);
        const region_fr = fr.CvImage(newFrame)
        // recognizer.predictBest(region_fr).then((prediction) => {console.log(prediction)})
    });
    cv.imshow('frame', frame);
    const key = cv.waitKey(delay);
    done = key !== -1 && key !== 255;
    if (done) {
        clearInterval(intvl);
        console.log('Key pressed, exiting.');
    }
}, 0);