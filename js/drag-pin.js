'use strict';

(function () {
  var imgUploadPreview = window.main.imgUploadPreview;

  var pin = document.querySelector('.effect-level__pin');
  var sliderPin = document.querySelector('.img-upload__effect-level');
  var effectLevelDepth = document.querySelector('.effect-level__depth');
  var wrapperPin = document.querySelector('.effect-level__line');
  var dataSizeWrapperPin = {};

  var effects = document.querySelector('.effects');
  var wrapperImg = window.main.imgUploadPreview;

  var setPinPosition = function (e, value) {
    dataSizeWrapperPin = wrapperPin.getBoundingClientRect();
    var pinPos = typeof value === 'number' ? value : e.clientX - dataSizeWrapperPin.left;

    if (pinPos <= 0) {
      pinPos = 0;
    } else if (pinPos >= dataSizeWrapperPin.width) {
      pinPos = dataSizeWrapperPin.width;
    }

    var ratePos = Math.round(pinPos / (dataSizeWrapperPin.width / 100));

    pin.style.left = pinPos + 'px';
    effectLevelDepth.style.width = ratePos + '%';

    setFilterQuality(ratePos);
  }

  var mouseUp = function () {
    document.removeEventListener('mousemove', setPinPosition);
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
        filterString = 'blur(' + ((value * 3) / 100) + 'px)';
        break;
      case 'heat':
        filterString = 'brightness(' + (1 + ((value * 2) / 100)) + ')';
        break;
      default:
        filterString = '';
        break;
    }

    imgUploadPreview.style.filter = filterString;
  };

  pin.addEventListener('mousedown', function () {
    document.addEventListener('mousemove', setPinPosition);
    document.addEventListener('mouseup', mouseUp);
  });

  wrapperPin.addEventListener('mouseup', setPinPosition);

  effects.addEventListener('change', function (e) {
    var currentFilter = e.target.value;

    wrapperImg.setAttribute('data-filter-effect', currentFilter);
    wrapperImg.className = 'img-upload__preview effects__preview--' + currentFilter;
    setPinPosition(false, 0);

    if (currentFilter === 'none') {
      sliderPin.classList.add('hidden');
    } else {
      sliderPin.classList.remove('hidden');
    }
  });
}());
