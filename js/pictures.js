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
var ENTER_KEYCODE = 13;

var photosList = [];

var urlPhotoNameList = [];

var bigPicture = document.querySelector('.big-picture');
var bigPictureCancel = document.querySelector('.big-picture__cancel');
var uploadFile = document.querySelector('#upload-file');

uploadFile.addEventListener('change', function () {
  document.querySelector('.img-upload__overlay').classList.remove('hidden');
});

bigPictureCancel.addEventListener('click', function () {
  bigPicture.classList.add('hidden');
});

document.addEventListener('keyup', function (e) {
  var elem = document.activeElement;
  if (elem.classList.contains('picture') && e.keyCode === ENTER_KEYCODE) {
    bigPicture.classList.remove('hidden');
    outputPhotoInfo(elem.querySelector('img').dataset['photoIndex']);
  }

  if (!bigPicture.classList.contains('hidden') && e.keyCode === ESC_KEYCODE) {
    bigPicture.classList.add('hidden');
  }

  if (elem === bigPictureCancel && e.keyCode === ENTER_KEYCODE) {
    bigPicture.classList.add('hidden');
  }
});

document.querySelector('.pictures.container').addEventListener('click', function (e) {
  var obj = e.target;

  if (!obj.classList.contains('picture__img')) {
    return;
  }

  bigPicture.classList.remove('hidden');
  outputPhotoInfo(obj.dataset['photoIndex']);
});

document.querySelector('.effects__list').addEventListener('click', function (e) {
  var obj = e.target;

  if (obj.classList.contains('effects__label')) {
    obj = obj.querySelector('.effects__preview');
  }

  if (obj.classList.contains('effects__preview')) {
    var wrapperImg = document.querySelector('.img-upload__preview');

    wrapperImg.className = 'img-upload__preview';

    wrapperImg.classList.add(obj.classList[1]);
  }
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
    var photoNewTmp = photoTmp.cloneNode(true);

    photoNewTmp.querySelector('.picture img').setAttribute('data-photo-index', p);

    photoNewTmp.querySelector('.picture__img').src = photosList[p].url;
    photoNewTmp.querySelector('.picture__likes').textContent = photosList[p].likes;
    photoNewTmp.querySelector('.picture__comments').textContent = photosList[p].comments.length;

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
