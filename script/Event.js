
function EventUtil(){
	this.addHandler=function(element,type,handler){
		if(element.addEventListener){
			element.addEventListener(type,handler,false);
		}else if(element.attachEvent){
			element.attachEvent("on"+type,handler);
		}else{
			element["on"+type]=handler;
		}
	}
	this.removeHandler=function(element,type,handler){
		if(element.removeEventListener){
			element.removeEventListener(type,handler,false);
		}else if(element.detachEvent){
			element.detachEvent("on"+type,handler);
		}else{
			element["on"+type]=handler;
		}
	}
	this.getEvent=function(event){
		return event?event:window.event;
	}
	this.getTarget=function(event){
		return event.target||event.srcElement;
	}
	this.preventDefault=function(event){
		if(event.preventDefault){
			event.preventDefault();
		}else{
			event.returnValue=false;
		}
	}
	this.stopPropagation=function(event){
		if(event.stopPropagation){
			event.stopPropagation();
		}else{
			event.cancelBubble=true;
		}
	}
}
exports.createEvent=function(){
	return new EventUtil();
}	