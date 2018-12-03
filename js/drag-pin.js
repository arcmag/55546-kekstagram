'use strict';

(function () {
  var imgUploadPreview = window.main.imgUploadPreview;

  var pin = document.querySelector('.effect-level__pin');
  var effectLevelDepth = document.querySelector('.effect-level__depth');
  var wrapperPin = pin.parentElement;
  var dataSizeWrapperPin = {};

  pin.addEventListener('mousedown', function () {
    dataSizeWrapperPin = wrapperPin.getBoundingClientRect();

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', mouseUp);
  });

  var mouseMove = function (e) {
    var pinPos = e.clientX - dataSizeWrapperPin.left;

    if (pinPos <= 0) {
      pinPos = 0;
    } else if (pinPos >= dataSizeWrapperPin.width) {
      pinPos = dataSizeWrapperPin.width;
    }

    var ratePos = Math.round(pinPos / (dataSizeWrapperPin.width / 100));

    pin.style.left = pinPos + 'px';
    effectLevelDepth.style.width = ratePos + '%';

    setFilterQuality(ratePos);
  };

  var mouseUp = function () {
    document.removeEventListener('mousemove', mouseMove);
    document.removeEventListener('mouseup', mouseUp);
  };

  var setFilterQuality = function (value) {
    var filterValue1 = '';
    if (value < 10) {
      filterValue1 = '0.0' + value;
    } else if (value < 100) {
      filterValue1 = '0.' + value;
    } else {
      filterValue1 = 1;
    }

    var filterString = '';
    switch (imgUploadPreview.dataset['filterEffect']) {
      case 'chrome':
        filterString = 'grayscale(' + filterValue1 + ')';
        break;
      case 'sepia':
        filterString = 'sepia(' + filterValue1 + ')';
        break;
      case 'marvin':
        filterString = 'invert(' + value + '%)';
        break;
      case 'phobos':
        filterString = 'blur(' + Math.round((value * 3) / 100) + 'px)';
        break;
      case 'heat':
        filterString = 'brightness(' + (1 + Math.round((value * 2) / 100)) + ')';
        break;
      default:
        filterString = '';
        break;
    }

    imgUploadPreview.style.filter = filterString;
  };
}());
