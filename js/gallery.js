'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500;

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

  filterPopularBtn.addEventListener('click', onSetCurrentCategoryPhoto);
  filterNewBtn.addEventListener('click', onSetCurrentCategoryPhoto);
  filterDiscussedBtn.addEventListener('click', onSetCurrentCategoryPhoto);

  function outputPhotoList(photos) {
    var photoContainer = document.createDocumentFragment();
    var photoTmp = document.querySelector('#picture').content;

    photos.forEach(function (photo, i) {
      var photoNewTmp = photoTmp.querySelector('.picture').cloneNode(true);

      photoNewTmp.dataset.photoIndex = i;

      photoNewTmp.querySelector('.picture__img').src = photo.url;
      photoNewTmp.querySelector('.picture__likes').textContent = photo.likes;
      photoNewTmp.querySelector('.picture__comments').textContent = photo.comments.length;

      photoNewTmp.addEventListener('click', function (e) {
        outputPhotoInfo(e.currentTarget.dataset['photoIndex']);
        showBigPicture();
      });

      photosListHTML.push(photoNewTmp);

      photoContainer.appendChild(photoNewTmp);
    });

    pictures.appendChild(photoContainer);
  }

  function removePhotoList() {
    photosListHTML.forEach(function (photo) {
      photo.parentElement.removeChild(photo);
    });

    photosListHTML = [];
  }

  var timer = null;
  function onSetCurrentCategoryPhoto(evt) {
    var elem = evt.currentTarget;
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
      selectedPhotosList = filteredPhotoList;
      removePhotoList();
      outputPhotoList(selectedPhotosList);
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
    var commentsLength = showComments;

    bigPicture.querySelector('.big-picture__img img').src = photo.url;
    bigPicture.querySelector('.likes-count').textContent = photo.likes;
    bigPicture.querySelector('.comments-count').textContent = photo.comments.length;
    bigPicture.querySelector('.social__caption').textContent = photo.description;

    if (photo.comments.length < commentsLength) {
      commentsLength = photo.comments.length;
      commentsLoader.classList.add('hidden');
    }

    commentCount.childNodes[0].textContent = commentsLength + ' из ';

    var comment = outputPhotoComments(photo, commentsLength);

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
    document.body.classList.add('modal-open');

    document.addEventListener('keyup', onBigPictureHiddenEsc);
  }

  function onBigPictureHidden() {
    bigPicture.classList.add('hidden');
    commentsLoader.classList.remove('hidden');
    document.body.classList.remove('modal-open');

    document.removeEventListener('keyup', onBigPictureHiddenEsc);

    currentPhoto = null;
    showComments = 5;
  }

  function onBigPictureHiddenEsc(evt) {
    if (evt.keyCode === window.main.ESC_KEYCODE) {
      onBigPictureHidden();
    }
  }

  bigPictureCancel.addEventListener('click', onBigPictureHidden);

  function onLoad(data) {
    photosList = selectedPhotosList = data;
    outputPhotoList(photosList);
    imgFilters.classList.remove('img-filters--inactive');
  }

  function onError() {
    window.main.createMessage('Ошибка: не удалось получить данные с сервера.', 'error');
  }

  // Получаем JSON данные фотографий с свервера
  window.backend.load(onLoad, onError);
}());
