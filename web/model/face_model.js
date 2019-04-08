var fs = require('fs');
var cv = require('opencv4nodejs')
var fr = require('face-recognition')
var path = require('path')
const numJitters = 15
const detector = fr.AsyncFaceDetector()
module.exports = obj = {
    cut_detct_face: function (user_id, image_name) {
        let dir_path = path.join(__dirname, '..', 'public', 'user_images', user_id.toString())
        let image_path = path.join(dir_path, image_name.toString())
        let image_ = fr.loadImage(image_path)
        fs.unlink(image_path, function (err) {
            if (err) console.log(err)
        })
        detector.detectFaces(image_).then(function (faceImages) {
            console.log('use detect')
            faceImages.forEach((face_image) => {
                console.log('detect face')
                let image_basenmae = path.basename(image_path, '.png');
                let finally_path = path.join(dir_path, `face${image_basenmae}.jpg`)
                fr.saveImage(finally_path, face_image)
            })
        })
    },
    tranning_class: function (class_name, user_id) {
        var recognizer = fr.AsyncFaceRecognizer()
        var class_name = class_name.toString()
        var user_dir = path.join(__dirname, '..', 'public', 'user_images', user_id.toString())
        var data_path = path.join(__dirname, '..', 'tranning_class', `${class_name}.json`)
        fs.exists(data_path, function (exists) {
            if (exists)
                recognizer.load(require(data_path))
            fs.readdir(user_dir, function (err, files) {
                var image_array = []
                files.forEach(function (element) {
                    var image_path = path.join(user_dir, element)
                    var image = fr.loadImage(image_path)
                    image_array.push(image)
                })
                recognizer.addFaces(image_array, user_id, numJitters)
                const modelState = recognizer.serialize()
                fs.writeFile(data_path, JSON.stringify(modelState),function(err){
                    if(err)
                    console.log(err)
                    else 
                    console.log('success')
                })
            })
        })

    }
}
