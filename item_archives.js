(function(jQuery) {
	'use strict';

	jQuery('#header')
	.css('position', 'relative')
	;
	jQuery('#footer')
	.css('position', 'relative')
	;

	jQuery('body').append(
		'<div id="screennavi">'
		+'<div><input id="screen" type="checkbox" onchange="jQuery(\'#item_archives\').screenToggle();return false;"> <a href="" onclick="document.getElementById(\'screen\').checked=(document.getElementById(\'screen\').checked==true)?false:true;jQuery(\'#item_archives\').screenToggle();return false;">全画面表示</a></div>'
		+'</div>'
	);
	jQuery('#screennavi')
	.css('position', 'fixed')
	.css('background', '#cccccc')
	.css('padding', '5px')
	.css('bottom', '0px')
	.css('right', '0px')
	.css('z-index', '2000')
	.css('opacity', '0.9')
	.css('filter', 'alpha(opacity=90)')
	;

	var itemView = 0;
	var itemLimit = 50;
	var itemData = [];
	jQuery('#item_archives').after('<br style="clear:both;" /><div id="info" style="text-align:center;padding:5px;z-index:2000;"></div>');
	var thisElemGlobal = jQuery('#item_archives');
	jQuery('#info').empty().append('<img src="indi.gif" alt="読み込み中..." width="10" height="10" /> 読み込み中...');
	jQuery.ajax({
		url: '<$mt:BlogURL$>archives_jsonp.php'
		,dataType: 'jsonp'
		,callback: 'callback'
		,timeout: 5000
	})
	.done(function(data, textStatus, jqXHR) {
		itemData = data;
		thisElemGlobal.loadItem();
	})
	.fail(function(jqXHR, textStatus, errorThrown) {jQuery('#info').empty();})
	.always(function(data, textStatus, jqXHR) {})
	;

	jQuery.fn.loadItem = function() {
		var items = itemData["items"];
		var itemsLen = items.length;
		if(!items) return false;
		var thisElem = jQuery(this);
		thisElem.append('<div class="view" style="opacity:0.0;" />');
		var thisView = thisElem.children('.view:last');
		for(var i=itemView; i<itemsLen; i++) {
			if(i>=itemView+itemLimit) break;
			var item = items[i];
			var datetime = item["datetime"].split(' ')[0].replace(/-0/g, '-');
			thisView
			.append(
				"<a href=\""+item["link"]+"\" target=\"_blank\"><img src=\""+item["thumbnail"]+"\" width=\"45\" height=\"45\" class=\"widget-img-thumb\" alt=\""+datetime+" "+item["title"]+"\" title=\""+datetime+" "+item["title"]+"\" /></a>"
			)
			;
			if(itemsLen>i+itemLimit) {
				var preloadItem = items[i+itemLimit];
				jQuery('<img />').attr('src', preloadItem["thumbnail"]);
			}
		}
		itemView += itemLimit;
		jQuery('.widget-img-thumb:last').load(function() {
			thisView.fadeTo('normal', '1.0');
			jQuery('#info').empty();
			if(itemView<itemsLen) jQuery('#info').append('<a href="" onmouseover="jQuery(\'#item_archives\').loadItem();return false;">さらに読み込む</a>');
		});
	};

	jQuery.fn.screenToggle = function() {
		if(jQuery('#screen').is(':checked')==true) {
			thisElemGlobal.css('position', 'fixed');
			thisElemGlobal.css('top', '0px');
			thisElemGlobal.css('left', '0px');
			thisElemGlobal.css('width', '100%');
			thisElemGlobal.css('height', '100%');
			thisElemGlobal.css('padding', '10px');
			thisElemGlobal.css('background-color', '#ffffff');
			thisElemGlobal.css('overflow', 'auto');
			jQuery('#info').css('position', 'fixed');
			jQuery('#info').css('bottom', '0px');
			jQuery('#info').css('left', '0px');
			jQuery('#info').css('width', '100%');
			jQuery('#info').css('background-color', '#ffffff');
			jQuery('#info').css('overflow', 'auto');
		} else {
			thisElemGlobal.css('position', 'static');
			thisElemGlobal.css('background-color', '');
			thisElemGlobal.css('overflow', 'inherit');
			jQuery('#info').css('position', 'static');
			jQuery('#info').css('background-color', '');
			jQuery('#info').css('overflow', 'inherit');
		}
	};

	var bottom_flag = false;
	$(window).scroll(function () {
		var document_y = document.documentElement.scrollHeight || document.body.scrollHeight;
		var scroll_y = document.documentElement.scrollTop || document.body.scrollTop;
		var window_y = 0;
		var isSafari = (navigator.appVersion.toLowerCase().indexOf('safari')+1?1:0);
		var isOpera = (navigator.userAgent.toLowerCase().indexOf('opera')+1?1:0);
		if (isOpera) isIE = false;
		if (!isSafari && !isOpera) {
			window_y = document.documentElement.clientHeight || document.body.clientHeight || document.body.scrollHeight;
		} else {
			window_y = window.innerHeight;
		}
		if(bottom_flag && (document_y > scroll_y + window_y)){
			bottom_flag = false;
		}
		if(bottom_flag){
			return;
		}
		if(document_y < scroll_y + window_y + 1){
			thisElemGlobal.loadItem();
			bottom_flag = true;
		}
	});
})(jQuery);
