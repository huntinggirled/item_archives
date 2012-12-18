/**
 *
 */

'use strict';

(function(jQuery) {

	jQuery('#header')
	.css('position', 'relative')
	;
	jQuery('#footer')
	.css('position', 'relative')
	;

	jQuery('body').append(
		'<div id="screennavi">'
		+'<div><input id="screen" type="checkbox" onchange="jQuery(\'#item_archives\').screenToggle();return false;"> <a href="" onclick="document.getElementById(\'screen\').checked=(document.getElementById(\'screen\').checked==true)?false:true;jQuery(\'#item_archives\').screenToggle();return false;">ëSâÊñ ï\é¶</a></div>'
		+'</div>'
	);
	jQuery('#screennavi')
	.css('position', 'fixed')
	.css('background', '#cccccc')
	.css('line-height', '25px')
	.css('padding', '10px')
	.css('bottom', '0px')
	.css('right', '0px')
	.css('z-index', '2000')
	.css('opacity', '0.9')
	.css('filter', 'alpha(opacity=90)')
	;

	var itemView = 0;
	var itemLimit = 50;
	var itemData = [];
	jQuery('#item_archives').after('<br style="clear:both;" /><div id="info" style="text-align:center;"></div>');
	var thisElemGlobal = jQuery('#item_archives');
	jQuery('#info').empty().append('<img src="indi.gif" alt="ì«Ç›çûÇ›íÜ..." width="10px" height="10px" /> ì«Ç›çûÇ›íÜ...');
	jQuery.ajax({
		url: '<$mt:BlogURL$>archives_jsonp.php',
		dataType: 'jsonp',
		callback: 'callback',
		timeout: 5000,
		success: function(data, status){
			itemData = data;
			thisElemGlobal.loadItem();
		},
		error: function(xhr, status, errorThrown) {jQuery('#info').empty();}
	});

	jQuery.fn.loadItem = function() {
		var items = itemData["items"];
		var itemsLen = items.length;
		if(items==undefined) return false;
		var thisElem = jQuery(this);
		thisElem.append('<div class="view" style="opacity:0.0;" />');
		var thisView = thisElem.children('.view:last');
		thisView.hide();
		for(var i=itemView; i<itemsLen; i++) {
			if(i>=itemView+itemLimit) break;
			var item = items[i];
			thisView
			.append(
				"<li class=\"item\"><a class=\"asset-image\" href=\""+item["link"]+"\" target=\"_blank\"><img src=\""+item["thumbnail"]+"\" width=\"45\" height=\"45\" class=\"asset-img-thumb\" alt=\""+item["date"]+" "+item["title"]+"\" title=\""+item["date"]+" "+item["title"]+"\" /></a></li>"
			);
			if(itemsLen>i+itemLimit) {
				var preloadItem = items[i+itemLimit];
				jQuery('<img />').attr('src', preloadItem["thumbnail"]);
			}
		}
		itemView += itemLimit;
		jQuery('.asset-img-thumb:last').load(function(iView, iLen) {
			thisView.fadeTo('normal', '1.0');
			jQuery('#info').empty();
			if(iView<iLen) jQuery('#info').append('<a href="" onmouseover="jQuery(\'#item_archives\').loadItem();return false;">Ç≥ÇÁÇ…ì«Ç›çûÇﬁ</a>');
		}(itemView, itemsLen));
	};

	jQuery.fn.screenToggle = function() {
		if(jQuery('#screen').is(':checked')==true) {
			thisElemGlobal.css('position', 'fixed');
			thisElemGlobal.css('top', '0px');
			thisElemGlobal.css('left', '0px');
			thisElemGlobal.css('width', '100%');
			thisElemGlobal.css('height', '100%');
			thisElemGlobal.css('padding-top', '10px');
			thisElemGlobal.css('background-color', '#ffffff');
			thisElemGlobal.css('overflow', 'auto');
		} else {
			thisElemGlobal.css('position', 'static');
			thisElemGlobal.css('background-color', '');
			thisElemGlobal.css('overflow', 'inherit');
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
