'use strict';

(function () {
  // Генерация и вывод списка всех фоторафий

  var photosList = [];
  var selectedPhotosList = [];
  var filteredPhotoList = [];

  var photosListHTML = [];

  var showComments = 5;
  var currentPhoto = null;

  var pictures = document.querySelector('.pictures');

  var imgFilters = document.querySelector('.img-filters');
  var imgFiltersForm = imgFilters.querySelector('.img-filters__form');

  var filterPopularBtn = imgFilters.querySelector('#filter-popular');
  var filterNewBtn = imgFilters.querySelector('#filter-new');
  var filterDiscussedBtn = imgFilters.querySelector('#filter-discussed');

  filterPopularBtn.addEventListener('click', setCurrentCategoryPhoto);
  filterNewBtn.addEventListener('click', setCurrentCategoryPhoto);
  filterDiscussedBtn.addEventListener('click', setCurrentCategoryPhoto);

  function outputPhotoList(photos) {
    var photoContainer = document.createDocumentFragment();
    var photoTmp = document.querySelector('#picture').content;

    for (var p = 0; p < photos.length; p++) {
      var photoNewTmp = photoTmp.querySelector('.picture').cloneNode(true);
      var photoData = photos[p];

      photoNewTmp.setAttribute('data-photo-index', p);

      photoNewTmp.querySelector('.picture__img').src = photoData.url;
      photoNewTmp.querySelector('.picture__likes').textContent = photoData.likes;
      photoNewTmp.querySelector('.picture__comments').textContent = photoData.comments.length;

      photoNewTmp.addEventListener('click', function (e) {
        outputPhotoInfo(e.currentTarget.dataset['photoIndex']);
        showBigPicture();
      });

      photosListHTML.push(photoNewTmp);

      photoContainer.appendChild(photoNewTmp);
    }

    pictures.appendChild(photoContainer);
  }

  function removePhotoList() {
    photosListHTML.forEach(function (photo) {
      photo.parentElement.removeChild(photo);
    });

    photosListHTML = [];
  }

  var timer = null;
  var DEBOUNCE_INTERVAL = 500; // ms
  function setCurrentCategoryPhoto(e) {
    var elem = e.currentTarget;
    var selectedFilter = elem.id;

    imgFiltersForm.querySelector('.img-filters__button--active').classList.remove('img-filters__button--active');
    elem.classList.add('img-filters__button--active');

    if (selectedFilter === 'filter-popular') {
      filteredPhotoList = photosList.slice();
    } else if (selectedFilter === 'filter-new') {
      filteredPhotoList = photosList.slice().sort(window.main.compare).slice(0, 10);
    } else if (selectedFilter === 'filter-discussed') {
      filteredPhotoList = photosList.slice().sort(function (a, b) {
        return b.comments.length - a.comments.length;
      });
    }

    if (timer) {
      window.clearTimeout(timer);
    }
    timer = window.setTimeout(function () {
      removePhotoList();
      outputPhotoList(selectedPhotosList = filteredPhotoList);
    }, DEBOUNCE_INTERVAL);
  }

  // Вывод подробной информации о конкретной фотографии
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureCancel = bigPicture.querySelector('.big-picture__cancel');
  var commentsLoader = bigPicture.querySelector('.comments-loader');
  var commentCount = bigPicture.querySelector('.social__comment-count');
  var commentsContainer = document.querySelector('.social__comments');

  commentsLoader.addEventListener('click', function () {
    showComments += 5;
    if (showComments > currentPhoto.comments.length) {
      showComments = currentPhoto.comments.length;
      commentsLoader.classList.add('hidden');
    }

    commentCount.childNodes[0].textContent = showComments + ' из ';

    var comments = outputPhotoComments(currentPhoto, showComments);

    commentsContainer.innerHTML = '';
    commentsContainer.appendChild(comments);
  });

  function outputPhotoInfo(photoIndex) {
    var photo = currentPhoto = selectedPhotosList[photoIndex];

    commentCount.childNodes[0].textContent = showComments + ' из ';

    bigPicture.querySelector('.big-picture__img img').src = photo.url;
    bigPicture.querySelector('.likes-count').textContent = photo.likes;
    bigPicture.querySelector('.comments-count').textContent = photo.comments.length;
    bigPicture.querySelector('.social__caption').textContent = photo.description;

    var comment = outputPhotoComments(photo, showComments);

    commentsContainer.innerHTML = '';
    commentsContainer.appendChild(comment);
  }

  function outputPhotoComments(photo, max) {
    if (photo.comments.length < max) {
      max = photo.comments.length;
    }

    var commentsList = document.createDocumentFragment();
    for (var i = 0; i < max; i++) {
      var commentTmp = bigPicture.querySelector('.social__comment').cloneNode(true);
      var comment = photo.comments[i];

      commentTmp.querySelector('.social__picture').src = comment.avatar;
      commentTmp.querySelector('.social__text').textContent = comment.message;

      commentsList.appendChild(commentTmp);
    }

    return commentsList;
  }

  function showBigPicture() {
    bigPicture.classList.remove('hidden');
    document.addEventListener('keyup', keydownHiddenBigPictureEsc);
  }

  function hiddenBigPicture() {
    bigPicture.classList.add('hidden');
    document.removeEventListener('keyup', keydownHiddenBigPictureEsc);

    currentPhoto = null;
    showComments = 5;
  }

  function keydownHiddenBigPictureEsc(e) {
    if (e.keyCode === window.main.ESC_KEYCODE) {
      hiddenBigPicture();
    }
  }

  bigPictureCancel.addEventListener('click', hiddenBigPicture);

  function onLoad(data) {
    outputPhotoList(photosList = selectedPhotosList = data);
    imgFilters.classList.remove('img-filters--inactive');
  }

  function onError() {
    window.main.createMessage('Ошибка: не удалось получить данные с сервера.', 'error');
  }
  // Получаем JSON данные фотографий с свервера
  window.backend.load(onLoad, onError);

}());
