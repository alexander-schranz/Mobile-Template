/**
 * jQuery.Tabs
 * Version 1.0
 */

(function($) {
    $.fn.extend({
        Tabs: function(options) {
            options = $.extend( {}, $.Tabs.defaults, options );

            this.each(function() {
                new $.Tabs(this,options);
            });
            return this;
        }
    });

    $.Tabs = function( element, options ) {

        var setActive = function(link) {
            $($(link).attr('href')).addClass(options.activeClass).siblings().removeClass(options.activeClass);
            $(element).find('a').removeClass(options.activeClass);
            $(link).addClass(options.activeClass);
        };

        var changeTab = function() {
            $(element).find('a').each(function() {
                if ($(this).attr('href') == window.location.hash) {
                    setActive(this);
                }
            });
        };

        $(window).on('hashchange', function() {
            changeTab();
        });

        if (window.location.hash != '') {
            changeTab();
        }

        /*
         $(element).find('a').click(function() {
            setActive(this);
         });
         */

        options.callback();
    };

    /* Default Options */
    $.Tabs.defaults = {
        activeClass: 'active',
        callback: function () {}
    };

})(jQuery);