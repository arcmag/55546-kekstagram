'use strict';

(function () {
  // контроль над окном редактирования фотографии
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var MAX_SCALE_IMG = 100;
  var MIN_SCALE_IMG = 25;
  var MAX_COMMENT_LENGTH = 140;
  var OFFSET_SCALE_IMAGE_STEP = 25;

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

  btnScaleInc.addEventListener('click', onPhotoSetScale);
  btnScaleDec.addEventListener('click', onPhotoSetScale);

  function onPhotoSetScale(e) {
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

  // on + (элемент - блок редактирования фотографии) EditPictureBloc + (действие - показать) Show
  function onEditPictureBlockShow() {
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
    onPhotoSetScale();

    imgUploadOverlay.classList.remove('hidden');
    document.addEventListener('keyup', onEditPictureBlockHiddenEsc);
  }

  function onEditPictureBlockHidden() {
    imgUploadOverlay.classList.add('hidden');

    uploadFile.value = '';
    textHashtags.value = '';
    commentField.value = '';

    document.removeEventListener('keyup', onEditPictureBlockHiddenEsc);
  }

  function onEditPictureBlockHiddenEsc(evt) {
    if (document.activeElement !== textHashtags && document.activeElement !== commentField && evt.keyCode === window.main.ESC_KEYCODE) {
      onEditPictureBlockHidden();
    }
  }

  uploadFile.addEventListener('change', onEditPictureBlockShow);
  imgUploadCancel.addEventListener('click', onEditPictureBlockHidden);

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

    var textError = '';
    var hashList = text.trim().split(' ');
    var hashListCopy = hashList.slice().map(function (elem) {
      return elem.toLowerCase();
    });

    if (!hashList[0] && hashList.length === 1) {
      return '';
    }

    if (hashList.length > 5) {
      return 'Максимум 5 hashtag';
    }

    hashList.forEach(function (hash, i) {
      if (hash[0] !== '#') {
        textError = 'hashtag должны начинаться с символа #';
      } else if (hash.length === 1) {
        textError = 'hashtag должны быть символы кроме #';
      } else if (hash.length > 20) {
        textError = 'Максимальная длинная hashtag 20 символов';
      } else if (hashListCopy.indexOf(hash.toLowerCase(), i + 1) !== -1) {
        textError = 'Одинаковые hashtag недопустимы';
      }
    });

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
      onEditPictureBlockHidden();
    }
  });

}());
