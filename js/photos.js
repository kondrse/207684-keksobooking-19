'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var avatarChooserElement = document.querySelector('.ad-form-header__upload').querySelector('input[type=file]');
  var avatarPreviewElement = document.querySelector('.ad-form-header__preview img');

  var photoApartmentsChooserElement = document.querySelector('.ad-form__upload').querySelector('input[type=file]');
  var photoApartmentsPreviewElement = document.querySelector('.ad-form__photo');
  var PhotoPreviewSize = {
    WIDTH: 40,
    HEIGHT: 40
  };

  var defaultAvatar = 'img/muffin-grey.svg';

  function generatePhoto() {
    // проверка на наличие фото
    if (document.querySelector('.ad-form__photo').querySelector('img')) {
      document.querySelector('.ad-form__photo').querySelector('img').remove();
    }
    var photo = document.createElement('img');

    photo.width = PhotoPreviewSize.WIDTH;
    photo.height = PhotoPreviewSize.HEIGHT;
    photo.alt = 'Фото жилья';
    photoApartmentsPreviewElement.appendChild(photo);

    return photo;
  }

  function deleteAllPhotoPreview() {
    if (document.querySelector('.ad-form__photo').querySelector('img')) {
      document.querySelector('.ad-form__photo').querySelector('img').remove();
    }

    document.querySelector('.ad-form-header__preview').querySelector('img').setAttribute('src', defaultAvatar);
  }

  function addPhoto(photoChooser, photo) {
    var file = photoChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        photo.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  }

  function onChangeAvatar() {
    addPhoto(avatarChooserElement, avatarPreviewElement);
  }

  function onChangePhoto() {
    addPhoto(photoApartmentsChooserElement, generatePhoto());
  }

  avatarChooserElement.addEventListener('change', onChangeAvatar);
  photoApartmentsChooserElement.addEventListener('change', onChangePhoto);

  // Экспорт функций модуля
  window.photos = {
    delete: deleteAllPhotoPreview
  };
})();
