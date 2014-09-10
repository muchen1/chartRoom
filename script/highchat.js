window.onload = function() {
    //实例并初始化我们的hichat程序
    var hichat = new HiChat();
    hichat.init();
};

//定义我们的hichat类
var HiChat = function() {
    this.socket = null;
};

//向原型添加业务方法
HiChat.prototype = {
    init: function() {//此方法初始化程序
        var that = this;
        //建立到服务器的socket连接
        this.socket = io.connect();
        //监听socket的connect事件，此事件表示连接已经建立
        this.socket.on('connect', function() {
            //连接到服务器后，显示昵称输入框
            document.getElementById('info').textContent = '请输入您的昵称：';
            document.getElementById('nickWrapper').style.display = 'block';
            document.getElementById('nicknameInput').focus();


        });
        //处理点击登录按钮
            document.getElementById("loginBtn").addEventListener("click",function(){
            	var nickname=document.getElementById('nicknameInput').value;
            	if(nickname.trim().length!=0){
            		
            		//向服务器端发送login事件
            		that.socket.emit("login",nickname);
            	}
            	else{
            		//重新使文本框获取焦点
            		document.getElementById('nicknameInput').focus();
            	}
            },false);
            //当输入的用户名已经存在时
            that.socket.on("nickExisted",function(){
            	alert("您输入的用户名已经存在了，请重新输入！");
            	//重新使文本框获取焦点
            	document.getElementById('nicknameInput').focus();
            });
            //登录成功的时候
            that.socket.on("loginSuccess",function(nickname,users){
            	document.getElementById('loginWrapper').style.display = 'none';
            	//聊天框获得焦点
            	document.getElementById("messageInput").focus();
                
                
            	//console.log(typeof users);
            });
            //监听系统消息
            that.socket.on("system",function(nickname,len,status,users){
            	if(status=="login"){
            		that._displaymsg("system",nickname+"进入聊天室","red");
                    $(".users").html("");
                    for (var i = users.length - 1; i >= 0; i--) {
                        $(".users").append("<li><a>"+users[i]+"</a></li>");
                    };
            	}else{
            		that._displaymsg("system",nickname+"离开聊天室","red");
                    $(".users").html("");
                    for (var i = users.length - 1; i >= 0; i--) {
                        $(".users").append("<li><a>"+users[i]+"</a></li>");
                    };
            	}
            });
            $("#sendBtn").click(function(){           	
            	var msg=$("#messageInput").val(),
            		color=$("#colorStyle").val();
            	if(msg!=""){
            		that._displaymsg("我",msg,color);
            		that.socket.emit("sendmsg",msg,color);
            		$("#messageInput").val("");
            		$("#messageInput").focus();
            	}
            });
            that.socket.on("sendmsg",function(nickname,msg,color){
            	that._displaymsg(nickname,msg,color);
            });
            //响应enter事件
            $("#messageInput").keydown(function(event){
            	var keycode=event.keyCode;
            	var msg=$("#messageInput").val(),
            		color=$("#colorStyle").val();
            	if(keycode=="13"){
            		if(msg!=""){
            			event.preventDefault();
            			that._displaymsg("我",msg,color);
            			that.socket.emit("sendmsg",msg,color);
            			$("#messageInput").val("");
            			$("#messageInput").focus();
            		}
            	}
            	
            });
            $("#sendImage").change(function(e){
            	//检查是否有文件被选中
     			if (this.files.length != 0) {
        			//获取文件并用FileReader进行读取
        			 var file = this.files[0],
             			 reader = new FileReader();
         				 if (!reader) {
             				that._displaymsg('system', '!你的浏览器不支持fileReader，不能传图片呦', 'red');
             				this.value = '';
             				return;
         					};
        			 reader.onload = function(e) {
            		//读取成功，显示到页面并发送到服务器
             		this.value = '';
             		that.socket.emit('img', e.target.result);
             		console.log(e.target.result);
             		that._displayImage('我', e.target.result);
         			};
         		reader.readAsDataURL(file);
     			}
            });
            that.socket.on("newimg",function(nickname,result){
            	that._displayImage(nickname,result);
            });
            document.getElementById("emoji").addEventListener("click",function(){
            	that._addgif();
            	$("#emojiWrapper").css("display","block");
            },false);
            
            $("#emojiWrapper").click(function(e){
            	//获取被点击的表情
    		var target = e.target;
    		if (target.nodeName.toLowerCase() == 'img') {
        	var messageInput = document.getElementById('messageInput');
       			messageInput.focus();
        		messageInput.value = messageInput.value + '[emoji:' + target.title + ']';
    			$("#emojiWrapper").css("display","none");
    			
    			};
    			
            });
            $("#clearBtn").click(function(){
            	$("#historyMsg").html("");
            });
            
    },
    _displaymsg:function(nickname,msg,color){
    	msg = this._showEmoji(msg);
    	//console.log(msg);
    	$("#historyMsg").append("<p style='color:"+color+"'>"+nickname+"："+msg+"</p>");
        document.getElementById('historyMsg').scrollTop = document.getElementById('historyMsg').scrollHeight
    },
    _displayImage:function(nickname,result){
    	$("#historyMsg").append(nickname+":<img src='"+result+"'>");
        //$("#historyMsg").css(scrollTop = $("#historyMsg").scrollHeight;
        document.getElementById('historyMsg').scrollTop = document.getElementById('historyMsg').scrollHeight
    },
    _addgif:function(){
    	$("#emojiWrapper").html("");
    	for(var i=1;i<39;i++){
    		$("#emojiWrapper").append("<img src='gif/"+i+".gif' title='"+i+"'>");
    		if(i%10==0){
    			$("#emojiWrapper").append("<br>");
    		}
    	}
    },
    _showEmoji: function(msg) {
    var match, result = msg,
        reg = /\[emoji:\d+\]/g,
        emojiIndex,
        totalEmojiNum = document.getElementById('emojiWrapper').children.length;
    while (match = reg.exec(msg)) {
        emojiIndex = match[0].slice(7, -1);
        if (emojiIndex > totalEmojiNum) {
            result = result.replace(match[0], '[X]');
        } else {
            result = result.replace(match[0], '<img class="emoji" src="../gif/' + emojiIndex + '.gif" />');
        };
    };
    return result;
}
    
};
