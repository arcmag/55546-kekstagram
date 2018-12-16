'use strict';

(function () {
  // контроль над окном редактирования фотографии
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

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
  var scaleImage = 100;

  btnScaleInc.addEventListener('click', setScalePhoto);
  btnScaleDec.addEventListener('click', setScalePhoto);

  function setScalePhoto(e) {
    var elem = e ? e.currentTarget : -1;
    var offsetSteep = 25;

    if (elem !== -1) {
      if (elem.classList.contains('scale__control--smaller')) {
        scaleImage -= offsetSteep;
      } else if (elem.classList.contains('scale__control--bigger')) {
        scaleImage += offsetSteep;
      }
    }

    if (scaleImage > 100) {
      scaleImage = 100;
    } else if (scaleImage < 25) {
      scaleImage = 25;
    }

    scaleControlValue.value = scaleImage + '%';
    imgUploadPreview.style.transform = 'scale(' + (scaleImage < 100 ? '0.' + scaleImage : 1) + ')';
  }

  function showEditPictureBlock() {
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

    scaleImage = 100;
    setScalePhoto();

    imgUploadOverlay.classList.remove('hidden');
    document.addEventListener('keyup', keydownHiddenEditPictureBlock);
  }

  function hiddenEditPictureBlock() {
    imgUploadOverlay.classList.add('hidden');

    uploadFile.value = '';
    textHashtags.value = '';
    commentField.value = '';

    document.removeEventListener('keyup', keydownHiddenEditPictureBlock);
  }

  function keydownHiddenEditPictureBlock(evt) {
    if (document.activeElement !== textHashtags && document.activeElement !== commentField && evt.keyCode === window.main.ESC_KEYCODE) {
      hiddenEditPictureBlock();
    }
  }

  uploadFile.addEventListener('change', showEditPictureBlock);
  imgUploadCancel.addEventListener('click', hiddenEditPictureBlock);

  function onLoad() {
    window.main.createMessage('Данные успешно загружены на сервер.', 'success');
  }

  function onError() {
    window.main.createMessage('Ошибка: не удалось записать данные на сервер.', 'error');
  }
  // Получаем JSON данные фотографий с свервера

  // Валидация данных хештега

  function checkValidHashtags(text) {
    var textError = '';
    var hashList = text.split(' ');
    var hashListCopy = hashList.slice().map(function (elem) {
      return elem.toLowerCase();
    });

    if (hashList.length > 5) {
      return 'Максимум 5 hashtag';
    }

    for (var i = 0; i < hashList.length; i++) {
      var hash = hashList[i];

      if (!hash && hashList.length === 1) {
        break;
      }

      if (hash[0] !== '#') {
        textError = 'hashtag должны начинаться с символа #';
      } else if (hash.length === 1) {
        textError = 'hashtag должны быть символы кроме #';
      } else if (hash.length > 20) {
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
    var textError = '';
    if (text.length > 140) {
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
      hiddenEditPictureBlock();
    }
  });

}());
