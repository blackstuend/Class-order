var path = require('path')
var fs = require('fs')

module.exports = {
    mkdir_user: function () {
        var user_images_path = path.join(__dirname, '..','public', "user_images")
        fs.exists(user_images_path, function (exists) {
            if (exists)
                return
            else
                fs.mkdir(user_images_path, function (err) {
                    if (err) console.log(err)
                })
        })
    },
    mkdir_class: function () {
        var class_path = path.join(__dirname, '..','tranning_class')
        fs.exists(class_path, function (exists) {
            if (exists)
                return
            else
                fs.mkdir(class_path, function (err) {
                    if (err) console.log(err)
                })
        })
    }
}