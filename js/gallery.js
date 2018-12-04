'use strict';

(function () {
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureCancel = bigPicture.querySelector('.big-picture__cancel');

  function outputPhotoList() {
    var photoContainer = document.createDocumentFragment();
    var photoTmp = document.querySelector('#picture').content;

    for (var p = 0; p < window.main.photosList.length; p++) {
      var photoNewTmp = photoTmp.querySelector('.picture').cloneNode(true);
      var photoData = window.main.photosList[p];

      photoNewTmp.setAttribute('data-photo-index', p);

      photoNewTmp.querySelector('.picture__img').src = photoData.url;
      photoNewTmp.querySelector('.picture__likes').textContent = photoData.likes;
      photoNewTmp.querySelector('.picture__comments').textContent = photoData.comments.length;

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
    var photo = window.main.photosList[photoIndex];

    bigPicture.querySelector('.big-picture__img img').src = photo.url;
    bigPicture.querySelector('.likes-count').textContent = photo.likes;
    bigPicture.querySelector('.comments-count').textContent = photo.comments.length;
    bigPicture.querySelector('.social__caption').textContent = photo.description;

    bigPicture.querySelector('.social__comment-count').classList.add('visually-hidden');
    bigPicture.querySelector('.comments-loader').classList.add('visually-hidden');

    for (var t = 0; t < Math.min(photo.comments.length, 5); t++) {
      var commentTmp = bigPicture.querySelector('.social__comment').cloneNode(true);

      commentTmp.querySelector('.social__picture').src = 'img/avatar-' + window.main.getRandomInt(6, 1) + '.svg';
      commentTmp.querySelector('.social__text').textContent = photo.comments[t];

      commentsTmpContainer.appendChild(commentTmp);
    }

    commentsContainer.innerHTML = '';
    commentsContainer.appendChild(commentsTmpContainer);
  }

  function showBigPicture() {
    bigPicture.classList.remove('hidden');
    document.addEventListener('keyup', keydownHiddenBigPictureEsc);
  }

  function hiddenBigPicture() {
    bigPicture.classList.add('hidden');
    document.removeEventListener('keyup', keydownHiddenBigPictureEsc);
  }

  function keydownHiddenBigPictureEsc(e) {
    if (e.keyCode === window.main.ESC_KEYCODE) {
      hiddenBigPicture();
    }
  }

  bigPictureCancel.addEventListener('click', hiddenBigPicture);
}());
