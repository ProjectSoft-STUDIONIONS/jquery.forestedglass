;(function($){
	var ForestedGlass = function(element, options){
			var data = $(element).data('forested.glass'),
				svg = filterSvg.clone();
			this.element = element;
			this.index = ForestedGlass.prototype.index;
			this.options = $.extend({}, ForestedGlass.DEFAULTS, options);
			this.target = $(element).closest(this.options.target);
			$('body').append(svg);
			svg.attr({
				id: "jquery_blurfilter_"+ForestedGlass.prototype.index
			});
			$(".blurUno", svg).attr({
				id: "blurUno_"+ForestedGlass.prototype.index
			});
			this.svg = svg;
			this.checkOptions();
			++ForestedGlass.prototype.index;
		},
		filterSvg = $('<svg style="display: none !important;" viewBox="0 0 500 500" width="500" height="500" id="jquery_blurfilter">'+
					'<filter class="blurUno" id="blurUno">'+
					'<feGaussianBlur class="blurUno_value" stdDeviation="5.00"></feGaussianBlur>'+
					'</filter>'+
					'</svg>');
	
	ForestedGlass.VERSION = '1.0.0';
	
	ForestedGlass.DEFAULTS = {
		target: "body",
		blur: 5.00
	};
	
	ForestedGlass.prototype.index = 0;
	
	ForestedGlass.prototype.checkOptions = function(){
		var blur = this.options.blur,
			element = this.element,
			index = this.index,
			svg = this.svg,
			blurino = $(".blurUno_value", this.svg);
		blurino[0].setAttribute('stdDeviation', parseInt(blur)+".00");
		if(this.target.length){
			if(!this.glass){
				this.glass = $("<div></div>", {
					class: 'forestedglass'
				}).css({
					//'clip': 'rect(0px 0px 0px 0px)',
					'filter': "url('#blurUno_"+index+"')",
					'position': 'absolute',
					'background': 'inherit',
					'overflow': 'hidden',
					'z-index': '0',
					'top': '0px',
					'bottom': '0px',
					'left': '0px',
					'right': '0px',
					'width': '100%',
					'height': '100%'
				});
			}else{
				this.glass.css({
					'filter': 'unset'
				}).css({
					'filter': "url('#blurUno_"+index+"')"
				});
			}
			$(this.target[0]).prepend(this.glass);
			var plg = this,
				winInit = $(element).data("forested.glass.wininit");
			if(!winInit){
				$(window).on('load.forestedglass scroll.forestedglass resize.forestedglass', function(e){
					plg.checkPosition.call(plg);
				});
				$(document).bind("touchmove MSPointerMove pointermove", function(e){
					plg.checkPosition.call(plg);
				});
				$(element).data("forested.glass.wininit", true);
			}
		}
		$(element).data("forested.glass", this);
	};
	
	ForestedGlass.prototype.checkPosition = function(){
		var $element = $(this.element),
			$glass = $(this.glass),
			elOffset = $element.offset(),
			glOffset = $glass.offset(),
			elBoxSize = {
				left: elOffset.left,
				top: elOffset.top,
				width: $element.outerWidth(),
				height: $element.outerHeight()
			},
			glBoxSize = {
				left: glOffset.left,
				top: glOffset.top,
				width: $glass.outerWidth(),
				height: $glass.outerHeight()
			},
			clip = {
				X1: (elBoxSize.left - glBoxSize.left) + "px",
				X2: (elBoxSize.left - glBoxSize.left + elBoxSize.width) + "px",
				Y1: (elBoxSize.top - glBoxSize.top) + "px",
				Y2: (elBoxSize.top - glBoxSize.top + elBoxSize.height) + "px"
			},
			rect = 'rect('+clip.Y1+", "+clip.X2+", "+clip.Y2+", "+clip.X1+')';
			$glass.css({
				'clip': rect
			});
	};
	
	
	function Plugin(option) {
		
		return $(this).each(function(){
			var $this = $(this),
				data = $this.data('forested.glass'),
				options = $.extend({}, ForestedGlass.DEFAULTS, $this.data(), typeof option == 'object' && option);
			
			if(!data){
				$this.data('forested.glass', (data = new ForestedGlass(this, options)));
				$this.trigger('forested.glass.init');
			}else{
				data.options = options;
				ForestedGlass.prototype.checkOptions.call(data);
			}
		});
	}
	
	var old = $.fn.forestedGlass,
		oldf = $.fn.forestedglass;
	$.fn.forestedGlass = Plugin;
	$.fn.forestedGlass.Constructor = ForestedGlass;
	$.fn.forestedGlass.noConflict = function(){
		$.fn.forestedGlass = old;
		return this;
	};
	$.fn.forestedglass = Plugin;
	$.fn.forestedglass.Constructor = ForestedGlass;
	$.fn.forestedglass.noConflict = function(){
		$.fn.forestedglass = oldf;
		return this;
	};
	
	$('[data-plugin="forestedglass"]').each(function(){
		var $this = $(this);
		Plugin.call(this, $this.data());
	});
})(jQuery);