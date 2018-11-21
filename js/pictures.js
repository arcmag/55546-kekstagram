'use strict';

var urlPhotoNameList = [];
for (var i = 1; i <= 25; i++) {
  urlPhotoNameList.push(i);
}

function getRandomPhotoUrl() {
  if (urlPhotoNameList.length >= 1) {
    return 'photos/' + (urlPhotoNameList.splice(Math.round(Math.random() * (urlPhotoNameList.length - 1)), 1)[0]) + '.jpg';
  }

  return false;
}

function getRandomLikesNumber() {
  var likesNumberMax = 200;
  var likesNumberMin = 15;

  return Math.floor((Math.random()) * (likesNumberMax - likesNumberMin + 1) + likesNumberMin);
}

function getRandomComments() {
  var commentsStringList = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
  ];
  var commentList = [];
  var commentListCountMax = 10;
  var commentListCountMin = 3;
  var commentListCount = Math.floor(Math.random() * (commentListCountMax - commentListCountMin + 1) + commentListCountMin);

  for (var j = 0; j < commentListCount; j++) {
    var commentsStringListCopy = commentsStringList.slice();
    var sentence1 = commentsStringListCopy.splice(Math.round(Math.random() * (commentsStringListCopy.length - 1)), 1)[0];
    var sentence2 = commentsStringListCopy.splice(Math.round(Math.random() * (commentsStringListCopy.length - 1)), 1)[0];

    commentList.push(Math.round(Math.random()) ? sentence1 : sentence1 + ' ' + sentence2);
  }

  return commentList;
}

function getPhotoDescription() {
  var descriptionsList = [
    'Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Вот это тачка!',
  ];

  return descriptionsList[Math.round(Math.random() * (descriptionsList.length - 1))];
}

var photoContainer = document.createDocumentFragment();
var photoTmp = document.querySelector('#picture').content;

var photosList = [];
for (var k = 0; k < 25; k++) {
  photosList.push({
    url: getRandomPhotoUrl(),
    likes: getRandomLikesNumber(),
    comments: getRandomComments(),
    description: getPhotoDescription()
  });

  var photoNewTmp = photoTmp.cloneNode(true);

  photoNewTmp.querySelector('.picture__img').src = photosList[i].url;
  photoNewTmp.querySelector('.picture__likes').textContent = photosList[i].likes;
  photoNewTmp.querySelector('.picture__comments').textContent = photosList[i].comments.length;
  photoContainer.appendChild(photoNewTmp);
}

document.querySelector('.pictures').appendChild(photoContainer);

var bigPicture = document.querySelector('.big-picture');
var commentsContainer = document.querySelector('.social__comments');
var commentsTmpContainer = document.createDocumentFragment();

bigPicture.classList.remove('hidden');

bigPicture.querySelector('.big-picture__img img').src = photosList[0].url;
bigPicture.querySelector('.likes-count').textContent = photosList[0].likes;
bigPicture.querySelector('.comments-count').textContent = photosList[0].comments.length;
bigPicture.querySelector('.social__caption').textContent = photosList[0].description;

bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
bigPicture.querySelector('.comments-loader').classList.add('visually-hidden');

for (var t = 0; t < photosList[0].comments.length; t++) {
  if (i >= 5) {
    break;
  }

  var commentTmp = bigPicture.querySelector('.social__comment').cloneNode(true);

  commentTmp.querySelector('.social__picture').src = 'img/avatar-' + (Math.floor((Math.random()) * (6 - 1 + 1) + 1)) + '.svg';
  commentTmp.querySelector('.social__text').textContent = photosList[0].comments[i];

  commentsTmpContainer.appendChild(commentTmp);
}

commentsContainer.innerHTML = '';
commentsContainer.appendChild(commentsTmpContainer);
