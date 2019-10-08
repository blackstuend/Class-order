var request = require('request')
request.post({url:'http://localhost:3000/selet_rasberry',form:{ras_num:1,class_number:110,time:new Date()}},function(err,res,body){
    if(err)
        return console.log('error')
    else
        console.log(body);
})