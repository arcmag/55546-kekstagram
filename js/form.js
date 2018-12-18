'use strict';

(function () {
  // контроль над окном редактирования фотографии
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var MIN_SCALE_IMG = 25;
  var OFFSET_SCALE_IMAGE_STEP = 25;
  var MAX_SCALE_IMG = 100;

  var MAX_COMMENT_LENGTH = 140;
  var MAX_HASH_LIST_LENGTH = 5;
  var MAX_HASHTAG_LENGTH = 20;

  var imgUploadPreview = document.querySelector('.img-upload__preview');
  var editImg = imgUploadPreview.querySelector('img');

  var uploadFile = document.querySelector('#upload-file');
  var imgUploadOverlay = document.querySelector('.img-upload__overlay');
  var imgUploadCancel = document.querySelector('#upload-cancel');

  var textHashtags = document.querySelector('.text__hashtags');
  var commentField = document.querySelector('.text__description');

  var scaleControlValue = document.querySelector('.scale__control--value');
  var btnScaleInc = document.querySelector('.scale__control--bigger');
  var btnScaleDec = document.querySelector('.scale__control--smaller');
  var scaleImage = MAX_SCALE_IMG;

  btnScaleInc.addEventListener('click', onButtonSetScale);
  btnScaleDec.addEventListener('click', onButtonSetScale);

  function onButtonSetScale(e) {
    var elem = e ? e.currentTarget : -1;

    if (elem !== -1) {
      if (elem.classList.contains('scale__control--smaller')) {
        scaleImage -= OFFSET_SCALE_IMAGE_STEP;
      } else if (elem.classList.contains('scale__control--bigger')) {
        scaleImage += OFFSET_SCALE_IMAGE_STEP;
      }
    }

    if (scaleImage > MAX_SCALE_IMG) {
      scaleImage = MAX_SCALE_IMG;
    } else if (scaleImage < MIN_SCALE_IMG) {
      scaleImage = MIN_SCALE_IMG;
    }

    scaleControlValue.value = scaleImage + '%';
    imgUploadPreview.style.transform = 'scale(' + (scaleImage < 100 ? '0.' + scaleImage : 1) + ')';
  }

  function onFileInputPictureShow() {
    var file = uploadFile.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        editImg.src = reader.result;
      });

      reader.readAsDataURL(file);
    }

    scaleImage = MAX_SCALE_IMG;
    onButtonSetScale();

    imgUploadOverlay.classList.remove('hidden');
    document.addEventListener('keyup', onEscPictureHidden);
  }

  function onFileInputPictureHidden() {
    imgUploadOverlay.classList.add('hidden');

    uploadFile.value = '';
    textHashtags.value = '';
    commentField.value = '';

    document.removeEventListener('keyup', onEscPictureHidden);
  }

  function onEscPictureHidden(evt) {
    if (document.activeElement !== textHashtags && document.activeElement !== commentField && evt.keyCode === window.main.ESC_KEYCODE) {
      onFileInputPictureHidden();
    }
  }

  uploadFile.addEventListener('change', onFileInputPictureShow);
  imgUploadCancel.addEventListener('click', onFileInputPictureHidden);

  function onLoad() {
    window.main.createMessage('Данные успешно загружены на сервер.', 'success');
  }

  function onError() {
    window.main.createMessage('Ошибка: не удалось записать данные на сервер.', 'error');
  }
  // Получаем JSON данные фотографий с свервера

  // Валидация данных хештега
  function checkValidHashtags(text) {
    textHashtags.setCustomValidity('');

    if (text.trim() === '') {
      return '';
    }

    var textError = '';
    var hashList = text.trim().split(' ');
    var hashListCopy = hashList.slice().map(function (elem) {
      return elem.toLowerCase();
    });

    if (hashList.length > MAX_HASH_LIST_LENGTH) {
      return 'Максимум 5 hashtag';
    }

    for (var i = 0; i < hashList.length; i++) {
      var hash = hashList[i];

      if (hash[0] !== '#') {
        textError = 'hashtag должны начинаться с символа #';
      } else if (hash.length === 1) {
        textError = 'hashtag должны быть символы кроме #';
      } else if (hash.length > MAX_HASHTAG_LENGTH) {
        textError = 'Максимальная длинная hashtag 20 символов';
      } else if (hashListCopy.indexOf(hash.toLowerCase(), i + 1) !== -1) {
        textError = 'Одинаковые hashtag недопустимы';
      }

      if (textError) {
        break;
      }
    }

    return textError;
  }

  function checkValidComment(text) {
    commentField.setCustomValidity('');

    text = text.trim();

    var textError = '';
    if (text.length > MAX_COMMENT_LENGTH) {
      textError = 'Длина комментария не может составлять больше 140 символов';
    }

    return textError;
  }

  function clearErrorAllFields() {
    textHashtags.style.borderColor = '';
    commentField.style.borderColor = '';
  }

  function declareErrorField(field, textError) {
    field.setCustomValidity(textError);
    field.style.border = 'solid 2px red';
  }

  var uploadSelectImage = document.querySelector('#upload-select-image');
  var uploadSubmit = document.querySelector('#upload-submit');
  uploadSubmit.addEventListener('click', function () {
    clearErrorAllFields();

    var textErrorHashtag = checkValidHashtags(textHashtags.value);
    var textErrorComment = checkValidComment(commentField.value);

    if (textErrorHashtag) {
      declareErrorField(textHashtags, textErrorHashtag);
    } else if (textErrorComment) {
      declareErrorField(commentField, textErrorComment);
    } else {
      window.backend.save(new FormData(uploadSelectImage), onLoad, onError);
      onFileInputPictureHidden();
    }
  });

}());
