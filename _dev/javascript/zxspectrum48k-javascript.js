$(document).ready(function () {
  // Makes the parallax elements
  function parallaxIt() {
    // Create variables
    var $fwindow = $(window);
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    var $backgrounds = [];

    // For each of background parallax element
    $('[data-type="background"]').each(function () {
      var $backgroundObj = $(this);

      $backgroundObj.__speed = ($backgroundObj.data('speed') || 1);
      $backgroundObj.__offset= ($backgroundObj.data('offset') || 0);
      $backgroundObj.__fgOffset = $backgroundObj.offset().top;
      $backgrounds.push($backgroundObj);
    });

    // Update positions
    $fwindow.on('scroll resize', function () {
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      $backgrounds.forEach(function ($backgroundObj) {
        var windowWidth = $(window).width();
        var yPos = ((scrollTop - $backgroundObj.__fgOffset) / $backgroundObj.__speed + $backgroundObj.__offset);

        // Return if window width less than 768px
        if( windowWidth < 767 ) {
          $backgroundObj.css({
            bottom: ''
          });
          return;
        }

        $backgroundObj.css({
          transform: 'translateY(' + yPos + 'px)'
        });
      });
    });

    // Triggers window scroll for refresh
    $fwindow.trigger('scroll');
  };

  parallaxIt();

  // ==================
  // Load Defered Fonts
  // ==================
  $("<link />", {
    'rel': 'stylesheet',
    'href': 'assets/css/zxspectrum48k-styles-fonts.min.css'
  }).appendTo('head');
});