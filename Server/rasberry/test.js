const delay = 10;
const {
    cv,
    getDataFilePath,
    drawBlueRect
} = require('./utils');
const fr = require('face-recognition').withCv(cv)
const request = require('request')
var region;
const devicePort = 0;
const vCap = new cv.VideoCapture(devicePort);
const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
const numDetectionsTh = 10;
let done = false;
const modelState = require('./0395.json')
const recognizer = fr.AsyncFaceRecognizer()
recognizer.load(modelState)
var newFrame;
const machine_num = 1;
function send_stu(stu){
    request.post({url:'http://localhost:3000/save_class_stu',form:{stu:stu,machine_number:machine_num}},function(err,res,body){
        if(err)
        return err;
        return console.log(body)
    })
}
function finish(){
    request.post({url:'http://localhost:3000/finish_save',form:{machine_num:machine_num}},function(err,res,body){
        if(err)
        return err;
        return console.log(body)
    })
}
// finish();
function main() { //開始點名
    var stu_array = []
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
            // drawBlueRect(frame, rect);
            const region_fr = fr.CvImage(newFrame)
            recognizer.predictBest(region_fr).then((prediction) => {
                console.log(prediction) //test
                if (prediction.distance <= 0.7) {
                    if (!stu_array.includes(prediction.className)) {
                        send_stu(prediction.className)
                        stu_array.push(prediction.className)
                        console.log(stu_array) //test
                    }
                }
            })
        });
        cv.imshow('frame', frame);
        const key = cv.waitKey(1000);
        done = key !== -1 && key !== 255;
        if (done) {
            clearInterval(intvl);
            console.log('Key pressed, exiting.');
            finish()
        }
    }, 0);
    // setTimeout(function(){
    // finish()
    //     clearInterval(intvl);
    //     console.log('Timeout exit recognition')
    // },60*1000) //10分鐘自動關閉
}
main()
// module.exports = main;