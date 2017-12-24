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
      $backgroundObj.__offset= ($backgroundObj.data('offset') || 0);
      $backgroundObj.__fgOffset = $backgroundObj.offset().top;
      $backgrounds.push($backgroundObj);
    });

    // update positions
    $fwindow.on('scroll resize', function () {
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      $backgrounds.forEach(function ($backgroundObj) {
        var windowWidth = $(window).width();
        var yPos = ((scrollTop - $backgroundObj.__fgOffset) / $backgroundObj.__speed + $backgroundObj.__offset);

        // return if window width less than 768px
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

    // triggers window scroll for refresh
    $fwindow.trigger('scroll');
  };

  // only after fully load the image then can apply the parallax effect
  var img = new Image();
  img.onload = function() {
    imgPlaceholder = document.getElementById('zx-top-image');
    imgPlaceholder.appendChild(img);

    parallaxIt();
  };
  img.src = 'assets/images/zx-spectrum/zx-spectrum-48k-header.jpg';
  img.alt = 'ZX Spectrum 48k';
  img.width = 1140;
  img.height = 304;
  img.className = 'img-fluid';
});