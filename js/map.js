'use strict';

let d = document;
let template = d.querySelector('template').content;// переменная шаблона
let mapCardTemplate = d.querySelector('template').content.querySelector('.map__card'); // переменная шаблона карточки
let mapPinsList = d.querySelector('.map__pins'); // список всех пинов
let mapPinTemplate = d.querySelector('template').content.querySelector('.map__pin'); // шаблон пина
let map = d.querySelector('.map');
let form = d.querySelector(".notice__form");

// *****вспомогательные функции

// вернуть рандомное число
function random(min, max) {
  return Math.round((min - 0.5) + Math.random() * ((max + 0.5) - min));
}

// перемешать элементы массива
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

//******

//***** исполнительные функции

// вернуть рандомный элемент из массива и удалить этот элемент
function getArrayRandomItem(arr) {
  let arrLength = arr.length - 1;
  let get = arr.splice(random(0, arrLength), 1);
  return get[0];
}

// вернуть заданный массив рандомной длинны
function getArrayRandomLength(arr) {
  let newArrLength = random(0, arr.length);
  return arr.slice(0, newArrLength);
}

// вернуть заданный массив, перемешав в нем элементы
function getShuffledArray(arr) {
  shuffleArray(arr);
  let arrLength = arr.length;
  return arr.slice(0, arrLength);
}

//*****

// массивы с данными об объявлениях
let avatars = ['01', '02', '03', '04', '05', '06', '07', '08'];

let titles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

let types = ['palace', 'flat', 'house', 'bungalow'];

let timesCheckin = ['12:00', '13:00', '14:00'];

let timesCheckout = ['12:00', '13:00', '14:00'];

let featuresList = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];

let photosList = ["http://o0.github.io/assets/images/tokyo/hotel1.jpg", "http://o0.github.io/assets/images/tokyo/hotel2.jpg", "http://o0.github.io/assets/images/tokyo/hotel3.jpg"];

// функция-конструктор, которая генерирует объявление
function Ad() {
  this.author = {
    avatar: `img/avatars/user${getArrayRandomItem(avatars)}.png`,
  };
  this.location = {
    x: random(40, (d.querySelector('.map').clientWidth) - 20),
    y: random(160, 630),
  };
  this.offer = {
    title: `${getArrayRandomItem(titles)}`,
    adress: `${this.location.x}, ${this.location.y}`,
    type: `${getArrayRandomItem(types)}`,
    rooms: random(1, 5),
    guests: random(1, 10),
    price: random(1000, 50000),
    checkin: `${getArrayRandomItem(timesCheckin)}`,
    checkout: `${getArrayRandomItem(timesCheckout)}`,
    features: getArrayRandomLength(featuresList),
    description: 'Подходит как туристам, так и бизнесменам. Квартира полностью укомплектована и недавно отремонтирована.',
    photos: getShuffledArray(photosList),
  };
}

// массив с похожими объявлениями
let ads = [];


//**********рендер массива с похожими обявлениями

// функция рендера массива с похожими объектами
function renderArrayWithSimilarObjects(length, array, constructor) {
  for (let i = 0; i < length; i++) {
    array[i] = new constructor;
  }
}

renderArrayWithSimilarObjects(8, ads, Ad);

// *****************************************


// *******************рендер значков объявлений на основе массива с объявлениями
// функция рендера пина объявления на основе массива с объявлениями
function renderPin(ad) {
  
  let newPin = mapPinTemplate.cloneNode(true);
  
  newPin.style.left = `${ad.location.x - (newPin.children[0].width / 2)}px`;
  newPin.style.top = `${ad.location.y - newPin.children[0].height}px`;
  newPin.children[0].src = `${ad.author.avatar}`;
  newPin.children[0].alt = `${ad.offer.title}`;
  newPin.children[0].title = `${ad.offer.title}`;
  
  return newPin;
}

// функция рендера пина объявления на основе массива с объялениями
function renderPinsList() {
  for (let i = 0; i < ads.length; i++) {
    mapPinsList.append(renderPin(ads[i]));
  }
}


// ***********


// *******************рендер карточки объявлений на основе массива с объявлениями
// функция рендера карточки объявления на основе массива с объявлениями
function renderCard(ad) {
  
  let newCard = mapCardTemplate.cloneNode(true); // клонирование шаблона карточки
  
  newCard.querySelector('.popup__title').textContent = ad.offer.title;// запись описания из соответствующего объекта
  newCard.querySelector('.popup__text--adress').textContent = ad.offer.adress;// запись адреса из соответствующего объекта
  newCard.querySelector('.popup__price').textContent = `${ad.offer.price}₽/ночь`;// запись цены из соответствующего объекта
  
  // ***** запись типа дома из соответствующего объекта
  let type;// Запись в переменную значения соответствующую значению в объекте
  switch (ad.offer.type) {
    case 'flat':
      type = 'Квартира';
      break;
    case 'bungalow':
      type = 'Бунгало';
      break;
    case 'house':
      type = 'Дом';
      break;
    case 'palace':
      type = 'Дворец';
      break;
  }
  
  newCard.querySelector('.popup__type').textContent = type;
  //******
  
  //  запись количества комнат и гостей из соответствующего объекта
  newCard.querySelector('.popup__text--capacity').textContent = `${ad.offer.rooms} комнаты для ${ad.offer.guests} гостей`;
  
  // запись времени заезда и выезда из соответствующего объекта
  newCard.querySelector('.popup__text--time').textContent = `Заезд после ${ad.offer.checkin}, выезд до ${ad.offer.checkout}`;
  
  // ***** запись списка дополнительных преимуществ из соответствующего объекта
  let featuresContainer = newCard.querySelector('.popup__features'); // переменная списка преимуществ
  
  featuresContainer.innerHTML = '';// удаление содержимого в списке преимуществ
  
  //перебор значений в массиве значений, и заполнение на на его основе списка преимуществ
  for (let feature of ad.offer.features) {
    let featureTemplate = template.querySelector(`.feature--${feature}`).cloneNode(true);
    featuresContainer.append(featureTemplate);
  }
  // *****
  
  
  newCard.querySelector('.popup__description').textContent = `${ad.offer.description}`;// описания из объекта
  
  // ***** запись списка фотографий из соответствующего объекта
  let photosContainer = newCard.querySelector('.popup__pictures'); // переменная списка фотографий
  
  photosContainer.innerHTML = '';// удаление содержимого в списке фото
  
  //перебор значений в массиве значений, и заполнение на на его основе списка фотографий
  for (let photo of ad.offer.photos) {
    let photoTemplate = template.querySelector('.popup__pictures li').cloneNode(true);
    photoTemplate.children[0].src = photo;
    photosContainer.append(photoTemplate);
  }
  
  // *****
  
  newCard.querySelector('.popup__avatar').src = `${ad.author.avatar}`;// описания из объекта
  
  return newCard;
}

// рендер карты объявления на основе массива с объялениями и вставка ее после блока с пинами
// mapPinsList.after(renderCard(ads[0])); временно остановлен
// ***********************************


// перевод в активное состояние при перемещении пина
let mainPin = d.querySelector('.map__pin--main');
mainPin.addEventListener("mouseup", onPinMove);

function onPinMove() {
  let fieldsets = d.querySelectorAll('fieldset');
  let adressPin = mainPin.getBoundingClientRect();
  address.value = `${adressPin.bottom + 20} : ${adressPin.left + mainPin.offsetWidth / 2}`;
  fieldsets.forEach((item) => item.disabled = false);
  d.querySelector('.map').classList.remove('map--faded');
  d.querySelector('.notice__form').classList.remove('notice__form--disabled');
  renderPinsList();
}

// открытие карточки объявления по нажатию на пин

map.addEventListener("click", onPinClick);

function onPinClick(evt) {
  // проверка для делегирования
  let pinBtn = evt.target.closest("button");
  if (!pinBtn && !map.contains(pinBtn)) {
    return;
  }
  if (pinBtn.classList.contains('map__pin--main')) {
    return;
  }
  
  // удаление старой карточки если она есть
  if (d.querySelector('.map__card')) {
    
    d.querySelector('.map__card').remove()
  }
  
  // поиск объекта этого пина
  let pinBtnTop = parseFloat(pinBtn.style.top) + 40;
  let pinBtnLeft = parseFloat(pinBtn.style.left) + 20;
  let num = 0;
  for (let ad of ads) {
    if (ad.location.x === pinBtnLeft || ad.location.y === pinBtnTop) {
      break;
    }
    
    num++
    
  }
  
  mapPinsList.after(renderCard(ads[num]));
  let popupClose = d.querySelector('.popup__close');
  popupClose.addEventListener("click", cardRemove);
}

// 

function cardRemove() {
  d.querySelector('.map__card').remove()
}
let inputs = d.querySelectorAll('input');



function CustomValidation() { }

CustomValidation.prototype = {
  // Установим пустой массив сообщений об ошибках
   invalidities: [],

  // Метод, проверяющий валидность
  checkValidity: function(input) {

    let validity = input.validity;

    if (validity.patternMismatch) {
      this.addInvalidity('This is the wrong pattern for this field');
    }

    if (validity.rangeOverflow) {
      let max = input.getAttribute('max');
      this.addInvalidity('The maximum value should be ' + max);
    }

    if (validity.rangeUnderflow) {
      let min = input.getAttribute('min');
      this.addInvalidity('The minimum value should be ' + min);
    }

    if (validity.stepMismatch) {
      let step = input.getAttribute('step');
      this.addInvalidity('This number needs to be a multiple of ' + step);
    }

    if (validity.tooLong) {
      let maxlength = input.getAttribute('maxlength');
      this.addInvalidity('This field needs to be shorter then ' + maxlength);
    }

    if (validity.tooShort) {
      let minlength = input.getAttribute('minlength');
      this.addInvalidity('This field needs to be longer then ' + minlength);
    }

    if (validity.typeMismatch) {
      this.addInvalidity('This is the wrong type for this field ');
    }

    if (validity.valueMissing) {
      this.addInvalidity('This field is required');
    }

  },

  // Добавляем сообщение об ошибке в массив ошибок


  addInvalidity: function(message) {
    this.invalidities.push(message);
  },


  // Получаем общий текст сообщений об ошибках
  getInvalidities: function() {
    return this.invalidities.join('. \n');
  },

  getInvaliditiesForHTML:  function() {
    return this.invalidities.join('. <br>');
  }
};

function onInputClick(e) {
  let input = e.target.closest('input');
  let select = e.target.closest('select');
  if (!input &&  !select && !form.contains(input) &&  !form.contains(select)){
    return;
  }
  removeToltips();
}

let removeToltips = function(){
  let toltips = d.querySelectorAll('.error-message');
  toltips.forEach(item => item.remove());
};

let renderToltips = function(e){

  for (let input of inputs) {
    // Проверим валидность поля, используя встроенную в JavaScript функцию checkValidity()
    if (input.checkValidity() === false) {

      let inputCustomValidation = new CustomValidation(); // Создадим объект CustomValidation
      inputCustomValidation.invalidities.length = 0;// Предотвратим накапливание сообщений
      inputCustomValidation.checkValidity(input); // Выявим ошибки
      let customValidityMessage = inputCustomValidation.getInvalidities(); // Получим все сообщения об ошибках
      input.setCustomValidity(customValidityMessage); // Установим специальное сообщение об ошибке

      // Добавим ошибки в документ
      let customValidityMessageForHTML = inputCustomValidation.getInvaliditiesForHTML();
      input.insertAdjacentHTML('afterend', '<div class="error-message">' + customValidityMessageForHTML + '</div>');
      e.preventDefault();

      setTimeout(removeToltips, 11000)
    } // закончился if
  } // закончился цик
};

// Добавляем обработчик клика на кнопку отправки формы
d.querySelector(".form__submit").addEventListener('click', renderToltips);

form.addEventListener('click', onInputClick);
form.addEventListener('keydown', function (e) {
  if ( e.code === 'Enter'){
      onInputClick();
  }
});


