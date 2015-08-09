/**
 * 
 * @authors zhangxu (zhangxu_wo@163.com)
 * @date    2015-07-27 15:02:56
 * @version $Id$
 */

function Zdialog(options){
	this.options = options;
	/**
	 @author zhangxu9@leju.com
	 @name zdialog.js
	 @description  弹窗插件
	 @param {String} title 标题内容
	 @param {String} content 消息内容
	 @param {String} okVal 确定按钮的文字
	 @param {String} cancelVal 取消按钮的文字
	 @param {Function} okFun 点击确定按钮后执行的回调函数
	 @param {Function} cancelFun 点击取消按钮后执行的回调函数
	 @param {String|Number} width 弹层的宽度
	 @param {String|Number} height 弹层的高度
	 @param {Boolean} fixed 开启静止定位，针对浏览器窗口定位
	 @param {String|Number} left 弹层的相对可视区域X轴的坐标
	 @param {String|Number} top 弹层的相对可视区域Y轴的坐标
	 @param {Boolean} showShadow 是否显示弹窗下面的遮罩层
	 @param {String} background 遮罩层的背景颜色
	 @param {String} opacity 遮罩层的透明度
	 @param {Number} time 设置对矿显示的时间
	 @param {Boolean} drag 是否允许用户拖动位置
	 @param {Boolean} esc 遮罩层的背景颜色
	 @param {Number} zIndex 设置弹窗的z-index属性
	 @param {Function} init 弹窗弹出后执行的函数
	 @param {Function} closeFun 点叉关闭弹窗前执行的函数
	 */
	this.defaults = {
		title: '提示',
		content: '要关闭这个窗口吗？',
		okVal: '确定',
		cancelVal: '取消',
		okFun: null,
		cancelFun: null,
		width: 430,
		height: 270,
		fixed: true,
		left: 'auto',
		top: 'auto',
		showShadow: false,
		background: '#000',
		opacity: 0.7,
		time: 3,
		drag: true,
		esc: true,
		zIndex: 9999,
		init: null,
		closeFun: null
	};
	this.util = {
		remove: function(){
			$('.zdialog-main').parent().remove();
			$('#zshadow').length != 0 ? $('#zshadow').remove() : null;
		},
		hide: function(){
			$('.zdialog-main').parent().hide();
			$('#zshadow').length != 0 ? $('#zshadow').hide() : null;
		},
		chaTitle: function(msg){
			$('.zdialog-title').text(msg);
		}
	};
	this.templates = '<div class="zdialog-main"><div class="zdialog-header"><span class="zdialog-title">提示</span><i class="zdialog-close"></i></div><div class="zdialog-content"><div class="zdialog-con">确定要关闭按钮吗？</div></div><div class="zdialog-btns"><button type="button"class="zdialog-ok">确认</button><button type="button"class="zdialog-cancel">取消</button></div></div>';
	$.extend(this.defaults, this.options, this.util);
	console.log(this)
	this.initPlugin();
}
var zProto = Zdialog.prototype;
/**
 * description  初始化插件
 * @return {[type]} [description]
 */
zProto.initPlugin = function(){
	var DOM = this.DOM = this.getDOM();
	DOM.header.css('cursor', this.defaults.drag ? 'move' : 'auto');
	this.defaults.okVal == false && this.defaults.cancelVal == false ? DOM.btns.remove() : this.setBtns();
	this.setPosition(this.defaults.left, this.defaults.top);
	this.setContent(this.defaults.content);
	this.setSize(this.defaults.width, this.defaults.height)
	this.setTitle(this.defaults.title)
	this.showShadow();
	this.autoPositionType();
	this.setZindex();
	this.setBtns();
	this.defaults.init && this.defaults.init();
	this.eventList();
	this.defaults.drag && this.allowDrag();
};
/**
 * description 设置内容
 * @param  {String} msg 内容
 * @return {[type]}     [description]
 */
zProto.setContent = function(msg){
	var that = this,
		DOM = this.DOM,
		wrap = DOM.wrap,
		main = DOM.main;

	if(msg === undefined){
		return;
	}
	if(typeof msg === 'string' && $(msg).length == 0){
		// console.log(1)
		DOM.con.text(msg);
	}else if(msg && $(msg).length){
		// console.log(2)
		main.remove();
		wrap.append(msg);
	}
};
/**
 * description  设置标题
 * @param	{String, Boolean}	标题内容. 为false则隐藏标题栏
 * @return	{this, HTMLElement}	如果无参数则返回内容器DOM对象
 */
zProto.setTitle = function(text){
	var DOM = this.DOM,
		wrap = DOM.wrap,
		title = DOM.title,
		className = 'zdialog-notitle',
		titHeight = title.parent().css('height');
	if(text === undefined) return;
	if(text === false){
		title.hide().text("");
	}else{
		// title.parent().css('line-height', titHeight);
		title.show().text(text || "");
	}
};
/**
 * description  设置位置(相对于可视区域)
 * @param	{Number, String}
 * @param	{Number, String}
 */
zProto.setPosition = function(left, top){
	var that = this,
		wrap = that.DOM.wrap;
	if(left == 'auto' && top == 'auto'){
		wrap.css({
			'left': '50%',
			'top': '50%',
			'margin-left': -that.defaults.width/2,
			'margin-top': -that.defaults.height/2
		});
	}else{
		wrap.css({
			'left': left,
			'top': top
		});
	}
};
/**
 * description  设置尺寸
 * @param {String | Number} width  弹框的宽度
 * @param {String | Number} height  弹框的高度
 */
zProto.setSize = function(width, height){
	var that = this,
		main = that.DOM.main;
	main.css({
		'width': width,
		'height': height
	});
};
/**
 * description  是否显示遮罩层
 * @return {undefined}
 */
zProto.showShadow = function(){
	var that = this,
		DOM = that.DOM,
		wrap = DOM.wrap;
	if(this.defaults.showShadow){
		$('body').append('<div id="zshadow"></div>');
		DOM.shadow = $('#zshadow');
		$('#zshadow').css({
			'left': 0,
			'top': 0,
			'position': 'fixed',
			'width': '100%',
			'height': '100%',
			'background': this.defaults.background,
			'z-index': 9998
		});
		this.changeOpc(1);
		$('#zshadow').bind('click', function(){
			that.setClose();
		});
	}
};
/**
 * description  遮罩层透明度渐变效果
 * @param  {Number} n 正数：打开弹窗时的遮罩层渐变， 负数：关闭弹窗时的遮罩层渐变
 * @return {undefined} 
 */
zProto.changeOpc = function(n){
	var that = this;
	var opacity = 0;
	var timer = setInterval(function(){
		opacity ++;
		n > 0 ? $('#zshadow').css('opacity', opacity/100) : $('#zshadow').css('opacity', that.defaults.opacity - opacity/100);
		if(opacity == that.defaults.opacity * 100){
			clearInterval(timer);
		}
	},5);
};

/**
 * description  自动切换定位类型
 * @return {undefined}
 */
zProto.autoPositionType = function(){
	this[this.defaults.fixed ? 'setFixed' : 'setAbsolute']();
};
/**
 * description  设置弹窗的zIndex值
 */
zProto.setZindex = function(){
	var that = this,
		DOM = that.DOM,
		wrap = DOM.wrap,
		zindex = that.defaults.zIndex;
	wrap.css('zIndex', zindex);

	return that;
};

/**
 * description  设置 fixed 静止定位
 */
zProto.setFixed = function(){
	var that = this,
		DOM = that.DOM,
		wrap = DOM.wrap[0];
	if(isIE6()){
		var bg = 'backgroundAttachment';
		if($('html').css(bg) != 'fixed' && $('body').css(bg) != 'fixed'){
			$('html').css({
				zoom: 1,
				backgroundImage: 'url(about:blank)',
				backgroundAttachment: 'fixed'
			});
		}
		var left = parseInt(wrap.css('left')),
			top = parseInt(wrap.css('top'));
		this.setAbsolute();
		wrap.style.left = 'expression(eval(document.documentElement.scrollLeft'+' left '+'))';
		wrap.style.top = 'expression(eval(document.documentElement.scrollTop'+' top '+'))';
	}else{
		wrap.style.position = 'fixed';
	}
};

/**
 * description  设置按钮的value值
 */
zProto.setBtns = function(){
	var that = this,
		DOM = that.DOM,
		btnOk = DOM.ok,
		btnCancel = DOM.cancel;
	if(typeof this.defaults.okVal === 'string'){
		btnOk.text(this.defaults.okVal)
	}else if(typeof this.defaults.okVal === 'boolean' && this.defaults.okVal == true){
		btnOk.text('确定');
	}else{
		btnOk.remove();
		btnCancel.css('margin-left', 0);
	}
	if(typeof this.defaults.cancelVal === 'string'){
		btnCancel.text(this.defaults.cancelVal)
	}else if(typeof this.defaults.cancelVal === 'boolean' && this.defaults.cancelVal == true){
		btnCancel.text('取消');
	}else{
		btnCancel.remove();
	}
};

/**
 * description  设置绝对定位
 */
zProto.setAbsolute = function(){
	var wrap = this.DOM.wrap[0];
	if(isIE6()){
		wrap.style.removeExpression('left');
		wrap.style.removeExpression('top');
	}
	wrap.style.position = 'absolute';
};
/* 判断浏览器是否为ie6 */
function isIE6(){
	return window.navigator.userAgent.toLowerCase().indexOf('msie 6.0') != -1 ? true : false;
};

/**
 * description  获取元素
 * @return {[type]} [description]
 */
zProto.getDOM = function(){
	var wrap = document.createElement('div'),
		body = document.body;
	wrap.innerHTML = this.templates;
	wrap.style.position = 'absolute';
	body.insertBefore(wrap, body.firstChild);

	var name,
		DOM = {
			wrap: $(wrap)
		},
		eles = wrap.getElementsByTagName('*'),
		elesLen = eles.length;
	for(var i = 0; i < elesLen; i++){
		name = eles[i].className.split('zdialog-')[1];
		if(name) DOM[name] = $(eles[i]);
	}

	return DOM;
};

zProto.eventList = function(){
	// console.log(this)
	var that = this,
		DOM = that.DOM,
		wrap = DOM.wrap,
		btnOk = DOM.ok,
		btnCancel = DOM.cancel,
		btnClose = DOM.close;
	btnOk.bind('click', function(){
		that.defaults.okFun && this.defaults.okFun(); 
	});
	btnCancel.bind('click', function(){
		that.defaults.cancelFun === null ? that.setClose() : that.defaults.cancelFun();
	});
	btnClose.bind('click', function(){
		that.defaults.closeFun === null ? that.defaults.time === null ? that.setClose() : that.setTimeClose() : that.defaults.closeFun();
	});
	$(document).bind('keydown', function(event){
		that.defaults.esc == true ? event.keyCode == 27 ? that.setClose() : null : null;
	});
};
/**
 * description  关闭
 */
zProto.setClose = function(){
	var that = this,
		DOM = that.DOM,
		wrap = DOM.wrap;
	wrap.remove();
	DOM.shadow && DOM.shadow.length != 0 && DOM.shadow.remove();
};
/**
 * description  设置定时关闭
 */
zProto.setTimeClose = function(){
	var that = this,
		DOM = that.DOM,
		wrap = DOM.wrap,
		btnOk = DOM.ok,
		btnCancel = DOM.cancel,
		btnClose = DOM.close;
	var ztime = that.defaults.time;
	var timer = setInterval(function(){
		// console.log(time)
		ztime -- ;
		if(ztime == 0){
			clearInterval(timer);
			wrap.remove();
			DOM.shadow.length != 0 ? DOM.shadow.remove() : null;
		}
	},1000);
};
/**
 * description  允许拖拽
 * @return {undefined}
 */
zProto.allowDrag = function(){
	var that = this,
		DOM = that.DOM,
		wrap = DOM.wrap,
		header = DOM.header;
	header.bind('mousedown', function(ev){
		var disX = ev.pageX - wrap.offset().left;
		var disY = ev.pageY - wrap.offset().top;
		$(document).bind('mousemove', function(ev){
			wrap[0].style.left = that.defaults.left === 'auto' ? ev.pageX - disX + that.defaults.width/2 + 'px' : ev.pageX - disX + 'px';
			wrap[0].style.top = that.defaults.top === 'auto' ? ev.pageY - disY + that.defaults.height/2 + 'px' :  ev.pageY - disY + 'px';
		});
		$(document).bind('mouseup', function(ev){
			$(document).unbind('mousemove');
			$(document).unbind('mouseup');
			wrap[0].releaseCapture && wrap[0].releaseCapture();
		});
		wrap[0].setCapture && wrap[0].setCapture();
		return false;
	});
};

window.zConfig = function(opts){
	return new Zdialog(opts);
};
