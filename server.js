//服务器及页面响应部分
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),//引入socket.io模块并绑定到服务器
    users=[];//用于保存所有的uses用户
app.use(express.static(__dirname));
server.listen(8000);
console.log("服务器已经开启");

//socket部分
io.on('connection', function(socket) {
    //处理登录事件
    socket.on('login', function(nickname) {
        //判读users数组是不是包含nickname
        if(users.indexOf(nickname)>-1){
        	socket.emit("nickExisted");
        }else{
        	socket.userIndex=users.length;
        	socket.nickname=nickname;
        	users.push(nickname);
        	socket.emit('loginSuccess',nickname,users);
        	io.sockets.emit('system',nickname,users.length,'login',users);
        }       
    });
    socket.on('disconnect',function(){
    	//将断开链接的用户从users中删除
    	users.splice(socket.userIndex,1);
    	//通知除自己以外的人
    	socket.broadcast.emit('system',socket.nickname,users.length,'logout',users);
    });
    socket.on("sendmsg",function(msg,color){
    	//将消息发给除自己以外的人
    	socket.broadcast.emit('sendmsg',socket.nickname,msg,color);
    });
    socket.on("img",function(result){
    	//将消息发给除自己以外的人
    	socket.broadcast.emit('newimg',socket.nickname,result);
    });
});