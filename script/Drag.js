var EventUtil=require("./Event");
var DragDrop=function(){
	var dragging=null;
	function handleEvent(event){
		//获取目标事件
		event=EventUtil.getEvent(event);
		var target=EventUtil.getTarget(event);
		//确定事件类型
		switch(event.type){
			case "mousedown":
				if(target.className.indexOf("draggable")>-1){
					draggable=target;
				}
				break;
			case "mousemove":
				if(draggable!==null){
					//指定位置
					dragging.style.left=event.clientX+"px";
					dragging.style.top=event.clientY+"px";
				}
				break;
			case "mouseup":
				dragging=null;
				break;
		}
	};
	//公共接口
	return{
		enable:function(){
			EventUtil.addHandler(document,"mousedown",handleEvent);
			EventUtil.addHandler(document,"mousemove",handleEvent);
			EventUtil.addHandler(document,"mouseup",handleEvent);
		},
		disable:function(){
			EventUtil.removeHandler(document,"mousedown",handleEvent);
			EventUtil.removeHandler(document,"mousemove",handleEvent);
			EventUtil.removeHandler(document,"mouseup",handleEvent);
		}
	}
}