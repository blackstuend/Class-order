# Class-order

## Install
* install [zeromq](https://github.com/zeromq/zeromq.js/)
* install [opencv4nodejs](https://github.com/justadudewhohacks/opencv4nodejs)


```
$ cd server
$ npm install
```

## Before open server,we need to get class.

```
$ cd ./server/web
$ node get_class
```


## Open web server and zeromq

* use two process to exectue

1. first terminal open web server 

```
$ cd server/web
$ npm install 
$ node app.js
```

2. second terminal open zeromq server

```
$ cd server/zeromq
$ node respone.js
```