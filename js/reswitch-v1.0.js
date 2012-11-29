;(function($) {

	"use strict";

	$(document).ready(function () {

		// Check for cssTransitions support and get vendor prefix
		var supportsTransitions = function() {
			var b = document.body || document.documentElement;
			var s = b.style;
			var p = 'transition';
			if(typeof s[p] == 'string') {return 'transition'; }

		    // Tests for vendor specific prop
		    var v = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'],
		    p = p.charAt(0).toUpperCase() + p.substr(1);
		    for(var i=0; i<v.length; i++) {
		    	if(typeof s[v[i] + p] == 'string') { return '-' + v[i].toLowerCase() + '-transition'; }
		    }
		    return false;
		};

		// Verify if the touch event is available
		function is_touch_device() {  
			try {
				document.createEvent("TouchEvent");  
				return true;  
			} catch (e) {  
				return false;  
			}  
		}

		$.fn.reswitch = function(options) {

			var settings = $.extend({}, $.fn.reswitch.defaults, options);

			if (settings.cssTransitions == true) {
				settings.cssTransitions = supportsTransitions();
			}
		
			return this.each(function(i,o) {

				var toggleChange = function(e) {
					e.preventDefault();
					var input = $(this).find('input'),
						name = input.attr('name'),
						group = $('[name="'+name+'"]');

					if (input.is(':checked')) {
						if (!input.is('[type="radio"]')) {
							input.removeAttr('checked');
							input.trigger('change');
						}
					} else {
						input.attr('checked', 'checked');
						input.trigger('change');
					}

					group.filter(':checked').parent().each(function(){
						console.log(this, 'on');
						turnOn($(this), settings);
					});
					group.not(':checked').parent().each(function(){
						console.log(this, 'off');
						turnOff($(this), settings);
					});
				}

				// switch On
				var turnOn = function($self, settings) {

					var s = ($self.find('.reswitch-toggle').length) ? $self.width() - $self.find('.reswitch-toggle').width() : $self.width(),
						toggleClass = function(self) {
							self.removeClass('is-off');
							self.addClass('is-on');
						};

					if (settings.cssTransitions) {
						$self.find('.wrap').css("margin-left", "0px");
						$self.find('.reswitch-toggle').css("left", s);
						toggleClass($self);
					} else {
						$self.find('.reswitch-toggle').animate({left: s}, settings.duration, 'swing');
						$self.find('.wrap').animate({marginLeft: 0}, settings.duration, 'swing', toggleClass($self));
					}
				};

				// switch Off
				var turnOff = function($self, settings) {
					var s = ($self.find('.reswitch-toggle').length) ? $self.find('.reswitch-toggle').width() - $self.width() : -1 * $self.width(),
						toggleClass = function(self) {
							self.removeClass('is-on');
							self.addClass('is-off');
						};

					if (settings.cssTransitions) {
						$self.find('.wrap').css("margin-left", s);
						$self.find('.reswitch-toggle').css("left", "0px");
						toggleClass($self);
					} else {
						$self.find('.reswitch-toggle').animate({left: 0}, settings.duration, 'swing');
						$self.find('.wrap').animate({marginLeft: s}, settings.duration, 'swing', toggleClass($self));
					}
				};

				var $self = $(o),
					transitionLeft = (settings.cssTransitions) ? "style='" + settings.cssTransitions + "-transform: translate3d(0, 0, 0); " + settings.cssTransitions + "-backface-visibility: hidden; " + settings.cssTransitions + "-perspective: 1000; " + settings.cssTransitions + ": left ."+settings.duration/100+"s' " : "",
					transitionMarginLeft = (settings.cssTransitions) ? "style='" + settings.cssTransitions + "-transform: translate3d(0, 0, 0); " + settings.cssTransitions + "-backface-visibility: hidden; " + settings.cssTransitions + "-perspective: 1000; " + settings.cssTransitions + ": margin-left ."+settings.duration/100+"s' " : "",
					markup = [
						(settings.hasToggle) ? "<div class='reswitch-toggle' "+ transitionLeft + "><div class='handle'></div></div>" : "",
						"<div class='reswitch-inner'>",
							"<div class='wrap' ", transitionMarginLeft, ">",
								"<div class='on'>" + settings.textOn + "</div>",
								(settings.hasToggle) ? "<div class='toggle-placeholder'></div>" : "",
								"<div class='off'>" + settings.textOff + "</div>",
							"</div>",
						"</div>"
					].join("");

				var $switch = $self.wrap('<div class="reswitch is-off">').parent();
					$switch.addClass(settings.theme).prepend(markup);

				var $inner = $switch.children('.reswitch-inner'),
					$wrap = $switch.find('.wrap'),
					$togglePlaceholder = $switch.find('.toggle-placeholder'),
					$toggle = $switch.find('.reswitch-toggle');


				// Add hasToggle Class
				if (settings.hasToggle) {
					$switch.addClass('js-toggle');
				}

				if ($self.is(':checked')) {
					$switch.removeClass('is-off').addClass('is-on');
				}

				// Make toggle as small as the bigger option
				var on = $inner.find('.on'),
					onClone = on.clone().insertAfter(on).css('width','auto').css('float','left'),
					onWidth = onClone.width() + parseInt(onClone.css('padding-left')) + parseInt(onClone.css('padding-right'));
					onClone.remove();
				var off = $inner.find('.off'),
					offClone = off.clone().insertAfter(off).css('width','auto').css('float','left'),
					offWidth = offClone.width() + parseInt(offClone.css('padding-left')) + parseInt(offClone.css('padding-right'));
					offClone.remove();
				var toggle = $toggle.width(),
					t, w, a, b;


				if (onWidth > offWidth) {
					t = toggle/(onWidth + toggle) * 100;
					w = 200 - t,
					a = t/w * 100,
					b = 50 - a/2;
					$switch.width(onWidth * 100/(100 - t));
				} else {
					t = toggle/(offWidth + toggle) * 100;
					w = 200 - t,
					a = t/w * 100,
					b = 50 - a/2;
					$switch.width(offWidth * 100/(100 - t));
				}

				on.css("width", b + "%");
				off.css("width", b + "%");

				if (settings.hasToggle) {
					$togglePlaceholder.width(a + "%");
					$toggle.css({
						"width": a*w/100 + "%", 
						"left": $switch.width() * (w/100 - 1)
					});
				}

				$wrap.width(w + "%");

				if (settings.toggleSize == 'auto') {
					settings.toggleSize = t;
				}

				// Setup
				if ($switch.is('.is-on')) {
					$wrap.css("margin-left", "0px");
					$toggle.css("left", $switch.width() * (1 - settings.toggleSize/100));
				} else {
					$wrap.css("margin-left", $switch.width() * (settings.toggleSize/100 - 1));
					$toggle.css("left", 0);
				}

				// Bind switch to click event
				if (is_touch_device()) {

					var xStart, yStart,
						xEnd, yEnd,
						xDiff, yDiff,
						timeStart, timeEnd, time,
						distance, tan,
						angle = 10,
						thereshold = Math.tan(angle*Math.PI/180),
						swiping = false,
						initMarginLeft, initLeft;

					$switch.on('touchstart mousedown', function(e) {
						// Handle the start
						var event = e.originalEvent,
							touch = event.targetTouches ? event.targetTouches[0] : e;
							// e.preventDefault();

							on = $(this).find('.on');
							onWidth = on.width() + parseInt(on.css('padding-left')) + parseInt(on.css('padding-right'));

						swiping = true;
						timeStart = (new Date()).getTime();

						initMarginLeft = $wrap.css('margin-left');
						initLeft = $toggle.css('left');

						xStart = touch.pageX;
						yStart = touch.pageY;
					});

					$('body').on("touchmove mousemove", function(e) {
						var event = e.originalEvent,
							touch = event.changedTouches ? event.changedTouches[0] : e;

						if (swiping) {
							e.preventDefault();

							xDiff = touch.pageX - xStart;
							yDiff = yStart - touch.pageY;

							if (($switch.hasClass('is-on') && xDiff < 0 && xDiff > -1 * onWidth) || ($switch.hasClass('is-off') && xDiff > 0 && xDiff < onWidth)) {
								$wrap.css('margin-left', parseFloat(initMarginLeft) + xDiff);
								$toggle.css('left', parseFloat(initLeft) + xDiff);
							}

							distance = Math.sqrt(Math.pow(xDiff,2) + Math.pow(yDiff,2));
							tan = yDiff/xDiff;
							angle = (Math.atan(tan)*180/Math.PI);

							if (xDiff < 0) {
								angle = angle + 180;
							} else if (yDiff < 0) {
								angle = angle + 360;
							}
						}
					});

					$('body').on('touchend mouseup', function(e) {
						// Handle the start
						var event = e.originalEvent,
							touch = event.changedTouches ? event.changedTouches[0] : e;

						if (swiping) {
							swiping = false;
							timeEnd = (new Date()).getTime();
							time = (timeEnd - timeStart)/1000;

							var speed = Math.round(distance/time);
							if (speed > 100) {
								if ((angle > 90) && (angle < 270)) {
									swipeLeft();
								} else {
									swipeRight();
								}
							} else {
								if ($switch.hasClass('is-on')) {
									$wrap.css('margin-left', 0);
									$toggle.css('left', onWidth);
								} else {
									$wrap.css('margin-left', -1 * onWidth);
									$toggle.css('left', 0);
								}
							}
						}
					});

					var swipeLeft = function() {
						console.log('swipeleft');
						if ($switch.hasClass('is-on')) $switch.trigger('click');
					}

					var swipeRight = function() {
						console.log('swiperight');
						if ($switch.hasClass('is-off')) $switch.trigger('click');
					}

				}

				$switch.on('click', toggleChange);
			});
		};

		// defaults
		$.fn.reswitch.defaults = {
			textOn: 'On',							// Label for the "checked" state
			textOff: 'Off',							// Label for the "unchecked" state
			duration: 300,							// Transition or animation duration
			theme: 'default',						// Class added to <div class="reswitch"></div> for styling purposes
			cssTransitions: supportsTransitions(),	// Wether to use or not css transitions (default veryfies browser capabilities)
			hasToggle: false,						// Option to display or not the handle between the Yes/No values
			toggleSize: 'auto'						// The size of the handle (better leave it default as it's calculated dinamycally)
		};

	});

}(jQuery));