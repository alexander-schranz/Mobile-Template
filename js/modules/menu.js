/**
 * jQuery.TouchMenu
 * Version 1.0
 */

(function($) {
    $.fn.extend({
        TouchMenu: function(options) {
            options = $.extend( {}, $.TouchMenu.defaults, options );

            this.each(function() {
                new $.TouchMenu(this,options);
            });
            return this;
        }
    });

    $.TouchMenu = function( element, options ) {
        var touchStartPositionX = 0;
        var elementStartPositionX = 0;
        var touchStartPositionY = 0;
        if ($(element).css('left') == 'auto') {
            $(element).css('left', 0);
        }
        if ($(element).css('top') == 'auto') {
            $(element).css('top', 0);
        }
        var newContentPositionX = $(element).css('left');
        var preventMenu = true;
        var isFirstMove = true;
        
        function getX(e) {
            if (!!e.touches && !!e.touches[0]) {
                var touch = e.touches[0];
                return touch.pageX;
            } else {
                return e.pageX;
            }
        }
        
        function getY(e) {
            if (!!e.touches && !!e.touches) {
                var touch = e.touches[0];
                return touch.pageY;
            } else {
                return e.pageY;
            }
        }
        
        function moveStart(e) {
            touchStartPositionX = getX(e);
            touchStartPositionY = getY(e);
            elementStartPositionX = parseInt($(this).css('left'));
            preventMenu = true;
            isFirstMove = true;
        }
        
        function move (e) {
            if (isFirstMove) {
                var moveX = touchStartPositionX - getX(e);
                var moveY = touchStartPositionY - getY(e);
                if (moveX < 0) {
                    moveX = 0 - moveX;
                }
                if (moveY < 0) {
                    moveY = 0 - moveY;
                }
                if ((moveX * 0.75) > moveY) {
                    preventMenu = false;
                }
                if (moveX != 0 && moveY != 0) {
                    isFirstMove = false;
                }
            }
            if (!preventMenu) {
                e.preventDefault();
                newContentPositionX = (getX(e) - touchStartPositionX + elementStartPositionX);
                var maxSlide = options.maxSlide;
                if (options.maxSlide.indexOf('%') != -1) {
                    maxSlide = parseInt(parseInt($(this).width()) / 100 * parseInt(options.maxSlide));
                }
                if (maxSlide > options.maxSlidePx) {
                    maxSlide = options.maxSlidePx;
                }
                if (newContentPositionX > maxSlide) {
                    newContentPositionX = maxSlide;
                } else if (newContentPositionX < -maxSlide) {
                    newContentPositionX = -maxSlide;
                }
                if (newContentPositionX < 0) {
                    $(options.mainMenu).hide();
                    $(options.secMenu).show();
                } else {
                    $(options.secMenu).hide();
                    $(options.mainMenu).show();
                }
                $(this).css({
                    left:  newContentPositionX + 'px'
                });
            }
        }
        
        function moveEnd (e) {
            if (!preventMenu) {
                e.preventDefault();
                var minSlide = options.minSlide;
                var maxSlide = options.maxSlide;
                if (options.minSlide.indexOf('%') != -1) {
                    minSlide = parseInt(parseInt($(this).width()) / 100 * parseInt(options.minSlide));
                }
                if (minSlide > options.minSlidePx) {
                    minSlide = options.minSlidePx;
                }
                if (options.maxSlide.indexOf('%') != -1) {
                    maxSlide = parseInt(parseInt($(this).width()) / 100 * parseInt(options.maxSlide));
                }
                if (maxSlide > options.maxSlidePx) {
                    maxSlide = options.maxSlidePx;
                }
                if (newContentPositionX > minSlide && options.mainIsOpen == false) {
                    options.mainIsOpen = true;
                    options.secIsOpen = false;
                    newContentPositionX = maxSlide;
                } else if (newContentPositionX < -minSlide && options.secIsOpen == false) {
                    options.mainIsOpen = false;
                    options.secIsOpen = true;
                    newContentPositionX = -maxSlide;
                } else {
                    if (options.mainIsOpen) {
                        if (elementStartPositionX - newContentPositionX > minSlide) {
                            options.mainIsOpen = false;
                            options.secIsOpen = false;
                            newContentPositionX = 0;
                        } else {
                            options.mainIsOpen = true;
                            options.secIsOpen = false;
                            newContentPositionX = maxSlide;
                        }
                    } else if (options.secIsOpen) {
                        if (elementStartPositionX - newContentPositionX < -minSlide) {
                            options.mainIsOpen = false;
                            options.secIsOpen = false;
                            newContentPositionX = 0;
                        } else {
                            options.mainIsOpen = false;
                            options.secIsOpen = true;
                            newContentPositionX = -maxSlide;
                        }
                    } else {
                        newContentPositionX = 0;
                    }
                }
                $(this).animate({
                    left: newContentPositionX + 'px'
                }, options.slideTime);
                preventMenu = true;
            }
        }
        
        function buttonClick (e) {
            e.preventDefault();
            var maxSlide = options.maxSlide;
            if (options.maxSlide.indexOf('%') != -1) {
                maxSlide = parseInt(parseInt($(element).width()) / 100 * parseInt(options.maxSlide));
            }
            if (maxSlide > options.maxSlidePx) {
                maxSlide = options.maxSlidePx;
            }
            if (options.mainIsOpen) {
                options.mainIsOpen = false;
                options.secIsOpen = false;
                $(element).animate({
                    left: 0 + 'px'
                }, options.slideTime);
            } else {
                options.mainIsOpen = true;
                options.secIsOpen = false;
                $(options.mainMenu).show();
                $(options.secMenu).hide();
                $(element).animate({
                    left: maxSlide + 'px'
                }, options.slideTime);
            }
            return false;
        }

        function contentClick(e) {
            options.mainIsOpen = false;
            options.secIsOpen = false;
            $(this).animate({
                left: 0 + 'px'
            }, options.slideTime);
        }

        // Bind Functions to Events
        element.addEventListener('touchstart', moveStart);
        element.addEventListener('touchmove', move);
        element.addEventListener('touchend', moveEnd);
        $(options.mainMenuButton).click(buttonClick);
        $(element).click(contentClick);

        options.callback();
    };

    /* Default Options */
    $.TouchMenu.defaults = {
        mainMenu: '#main-menu',
        secMenu: '#sec-menu',
        mainMenuButton: '#menu-button',
        minSlide: '15%',
        minSlidePx: 75,
        maxSlide: '80%',
        maxSlidePx: 300,
        slideTime: 300,
        mainIsOpen: false,
        secIsOpen: false,
        callback: function () {}
    };

})(jQuery);