'use strict';

var uploadFile = document.querySelector('#upload-file');
var imgUploadOverlay = document.querySelector('.img-upload__overlay');
var imgUploadCancel = document.querySelector('.img-upload__cancel');

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
  if (document.activeElement !== window.main.textHashtags && e.keyCode === window.main.ESC_KEYCODE) {
    hiddenEditPictureBlock();
  }
}

uploadFile.addEventListener('change', showEditPictureBlock);
imgUploadCancel.addEventListener('click', hiddenEditPictureBlock);
