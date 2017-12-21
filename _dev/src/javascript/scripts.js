$(document).ready(function () {
  // makes the parallax elements
  function parallaxIt() {
    // create variables
    var $fwindow = $(window);
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    var $backgrounds = [];

    // for each of background parallax element
    $('[data-type="background"]').each(function () {
      var $backgroundObj = $(this);

      $backgroundObj.__speed = ($backgroundObj.data('speed') || 1);
      $backgroundObj.__fgOffset = $backgroundObj.offset().top;
      $backgrounds.push($backgroundObj);
    });

    // update positions
    $fwindow.on('scroll resize', function () {
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      $backgrounds.forEach(function ($backgroundObj) {
        var windowWidth = $(window).width();
        var yPos = -((scrollTop - $backgroundObj.__fgOffset) / $backgroundObj.__speed + 100);

        // return if window width less than 768px
        if( windowWidth < 767 ) {
          $backgroundObj.css({
            bottom: ''
          });
          return;
        }

        $backgroundObj.css({
          bottom: yPos + 'px'
        });
      });
    });

    // triggers winodw scroll for refresh
    $fwindow.trigger('scroll');
  };

  parallaxIt();
});