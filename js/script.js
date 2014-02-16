// @codekit-prepend "modules/tabs.js"
// @codekit-prepend "modules/menu.js"
// @codekit-prepend "vendor/jquery-2.0.3.min.js"



(function ($) {
    $(document).ready(function() {
        $('#content').TouchMenu();
        $('.tab-controls').Tabs();
    });
})(jQuery);