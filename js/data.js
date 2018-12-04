'use strict';

(function () {
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

  function createPhotoList() {
    for (var i = 1; i <= 25; i++) {
      window.main.urlPhotoNameList.push('photos/' + i + '.jpg');
    }
  }
  createPhotoList();

  function getRandomArrayElement(array) {
    return array[window.main.getRandomInt(array.length - 1, 0)];
  }

  function getRandomPhotoUrl() {
    return window.main.urlPhotoNameList.sort(window.main.compare).pop();
  }

  function getRandomComments() {
    var commentList = [];

    for (var j = 0; j < window.main.getRandomInt(10, 3); j++) {
      var copyList = COMMENTS_STRING_LIST.slice().sort(window.main.compare);

      commentList.push(window.main.getRandomInt(1, 0) ? copyList[0] : copyList[0] + ' ' + copyList[1]);
    }

    return commentList;
  }

  function createPhotoObjectList() {
    for (var k = 0; k < 25; k++) {
      window.main.photosList.push({
        url: getRandomPhotoUrl(),
        likes: window.main.getRandomInt(200, 15),
        comments: getRandomComments(),
        description: getRandomArrayElement(DESCRIPTION_LIST)
      });
    }
  }
  createPhotoObjectList();
}());
