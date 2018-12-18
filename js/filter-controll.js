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

  function setPinPosition(evt, value) {
    dataSizeWrapperPin = wrapperPin.getBoundingClientRect();
    var pinPos = typeof value === 'number' ? value : evt.clientX - dataSizeWrapperPin.left;

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

  function onPinPositionChange() {
    setPinPosition(false, wrapperPin.getBoundingClientRect().width);
  }

  function onPinPositionMouseMove(e) {
    setPinPosition(e);
  }

  function onPinMouseUp() {
    document.removeEventListener('mousemove', onPinPositionMouseMove);
    document.removeEventListener('mouseup', onPinMouseUp);
  }

  function setFilterQuality(value) {
    var filterGrayscaleSepiaValue = '';
    if (value < 10) {
      filterGrayscaleSepiaValue = '0.0' + value;
    } else if (value < 100) {
      filterGrayscaleSepiaValue = '0.' + value;
    } else {
      filterGrayscaleSepiaValue = 1;
    }

    imgUploadPreview.style.filter = ({
      chrome: 'grayscale(' + filterGrayscaleSepiaValue + ')',
      sepia: 'sepia(' + filterGrayscaleSepiaValue + ')',
      marvin: 'invert(' + value + '%)',
      phobos: 'blur(' + ((value * 3) / 100) + 'px)',
      heat: 'brightness(' + (1 + ((value * 2) / 100)) + ')'
    })[imgUploadPreview.dataset['filterEffect']] || '';
  }

  pin.addEventListener('mousedown', function () {
    document.addEventListener('mousemove', onPinPositionMouseMove);
    document.addEventListener('mouseup', onPinMouseUp);
  });

  function setVisibilitySliderPin(filter) {
    sliderPin.classList[filter === 'none' || !filter ? 'add' : 'remove']('hidden');
  }

  wrapperPin.addEventListener('mouseup', onPinPositionMouseMove);

  effects.addEventListener('change', function (e) {
    var currentFilter = e.target.value;

    wrapperImg.dataset.filterEffect = currentFilter;
    wrapperImg.className = 'img-upload__preview effects__preview--' + currentFilter;

    setVisibilitySliderPin(currentFilter);

    onPinPositionChange();
  });

  setVisibilitySliderPin();
}());
