'use strict';

var COMMENTS_STRING_LIST = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];

var DESCRIPTION_LIST = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!',
];

var ESC_KEYCODE = 27;

var photosList = [];

var urlPhotoNameList = [];

var bigPicture = document.querySelector('.big-picture');
var bigPictureCancel = bigPicture.querySelector('.big-picture__cancel');

var uploadFile = document.querySelector('#upload-file');
var imgUploadOverlay = document.querySelector('.img-upload__overlay');
var imgUploadCancel = document.querySelector('.img-upload__cancel');

var uploadSubmit = document.querySelector('#upload-submit');
var textHashtags = document.querySelector('.text__hashtags');

uploadSubmit.addEventListener('click', function (e) {
  var hashList = textHashtags.value.split(' ');
  var hashListCopy = hashList.slice().map(function (elem) {
    return elem.toLowerCase();
  });

  if (hashList.length > 5) {
    textHashtags.setCustomValidity('Максимум 5 hashtag');
    e.preventDefault();
    return;
  }

  for (var i = 0; i < hashList.length; i++) {
    var hash = hashList[i];
    var textError = '';

    if (hash[0] !== '#') {
      textError = 'hashtag должны начинаться с символа #';
    } else if (hash.length === 1) {
      textError = 'hashtag должны быть символы кроме #';
    } else if (hash.length > 20) {
      textError = 'Максимальная длинная hashtag 20 символов';
    } else if (hashListCopy.indexOf(hash.toLowerCase(), i + 1) !== -1) {
      textError = 'Одинаковые hashtag недопустимы';
    }

    textHashtags.setCustomValidity(textError);
    if (textError) {
      e.preventDefault();
      return;
    }
  }

});

function showBigPicture() {
  bigPicture.classList.remove('hidden');
  document.addEventListener('keyup', keydownHiddenBigPictureEsc);
}

function hiddenBigPicture() {
  bigPicture.classList.add('hidden');
  document.removeEventListener('keyup', keydownHiddenBigPictureEsc);
}

function keydownHiddenBigPictureEsc(e) {
  if (e.keyCode === ESC_KEYCODE) {
    hiddenBigPicture();
  }
}

function showEditPictureBlock() {
  imgUploadOverlay.classList.remove('hidden');
  document.addEventListener('keyup', keydownHiddenEditPictureBlock);
}

function hiddenEditPictureBlock() {
  imgUploadOverlay.classList.add('hidden');
  uploadFile.value = '';

  document.removeEventListener('keyup', keydownHiddenEditPictureBlock);
}

function keydownHiddenEditPictureBlock(e) {
  if (document.activeElement !== textHashtags && e.keyCode === ESC_KEYCODE) {
    hiddenEditPictureBlock();
  }
}

uploadFile.addEventListener('change', showEditPictureBlock);
imgUploadCancel.addEventListener('click', hiddenEditPictureBlock);

bigPictureCancel.addEventListener('click', hiddenBigPicture);

var effects = document.querySelector('.effects');
var wrapperImg = document.querySelector('.img-upload__preview');
effects.addEventListener('change', function (e) {
  wrapperImg.className = 'img-upload__preview effects__preview--' + e.target.value;
});

function createPhotoList() {
  for (var i = 1; i <= 25; i++) {
    urlPhotoNameList.push('photos/' + i + '.jpg');
  }
}
createPhotoList();

function getRandomInt(max, min) {
  return Math.floor((Math.random()) * (max - min + 1) + min);
}

function compare() {
  return Math.random() - 0.5;
}

function getRandomArrayElement(array) {
  return array[getRandomInt(array.length - 1, 0)];
}

function getRandomPhotoUrl() {
  return urlPhotoNameList.sort(compare).pop();
}

function getRandomComments() {
  var commentList = [];

  for (var j = 0; j < getRandomInt(10, 3); j++) {
    var copyList = COMMENTS_STRING_LIST.slice().sort(compare);

    commentList.push(getRandomInt(1, 0) ? copyList[0] : copyList[0] + ' ' + copyList[1]);
  }

  return commentList;
}

function createPhotoObjectList() {
  for (var k = 0; k < 25; k++) {
    photosList.push({
      url: getRandomPhotoUrl(),
      likes: getRandomInt(200, 15),
      comments: getRandomComments(),
      description: getRandomArrayElement(DESCRIPTION_LIST)
    });
  }
}
createPhotoObjectList();

function outputPhotoList() {
  var photoContainer = document.createDocumentFragment();
  var photoTmp = document.querySelector('#picture').content;

  for (var p = 0; p < photosList.length; p++) {
    var photoNewTmp = photoTmp.querySelector('.picture').cloneNode(true);

    photoNewTmp.setAttribute('data-photo-index', p);

    photoNewTmp.querySelector('.picture__img').src = photosList[p].url;
    photoNewTmp.querySelector('.picture__likes').textContent = photosList[p].likes;
    photoNewTmp.querySelector('.picture__comments').textContent = photosList[p].comments.length;

    photoNewTmp.addEventListener('click', function (e) {
      outputPhotoInfo(e.currentTarget.dataset['photoIndex']);
      showBigPicture();
    });

    photoContainer.appendChild(photoNewTmp);
  }

  document.querySelector('.pictures').appendChild(photoContainer);
}
outputPhotoList();

function outputPhotoInfo(photoIndex) {
  var commentsContainer = document.querySelector('.social__comments');
  var commentsTmpContainer = document.createDocumentFragment();
  var photo = photosList[photoIndex];

  bigPicture.querySelector('.big-picture__img img').src = photo.url;
  bigPicture.querySelector('.likes-count').textContent = photo.likes;
  bigPicture.querySelector('.comments-count').textContent = photo.comments.length;
  bigPicture.querySelector('.social__caption').textContent = photo.description;

  bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
  bigPicture.querySelector('.comments-loader').classList.add('visually-hidden');

  for (var t = 0; t < Math.min(photo.comments.length, 5); t++) {
    var commentTmp = bigPicture.querySelector('.social__comment').cloneNode(true);

    commentTmp.querySelector('.social__picture').src = 'img/avatar-' + getRandomInt(6, 1) + '.svg';
    commentTmp.querySelector('.social__text').textContent = photo.comments[t];

    commentsTmpContainer.appendChild(commentTmp);
  }

  commentsContainer.innerHTML = '';
  commentsContainer.appendChild(commentsTmpContainer);
}
