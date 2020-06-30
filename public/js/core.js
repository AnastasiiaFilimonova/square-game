if (screen.width >= 1200 && TYPE === "mobile") {
  location.href = "index.html";
}
if (screen.width < 1200 && TYPE !== "mobile") {
  location.href = "mobile.html";
}

// настройка игры
var snowflakeCount = 1; // счетчик снежинок
var fireCount = 1; //счетчик огоньков
var timeLimit = 30;
var popupEl = document.querySelector('.popup');
var counterEl = document.querySelector('.counter');
var livesEl = document.querySelector('.lives');
var timerWripperEl = document.querySelector('#timer');
var nameEl = document.querySelector("#settings .name");
var stageEl = document.querySelector("#stage"); // получили DOM элеммент

if (TYPE == "mobile") {
  var padding = 5;
  var bottomReserve = 100;

  var gameWidthCells = 7;

  var delta = Math.floor((screen.width-padding * 2)/(gameWidthCells*10))*10; // 50 ширина клетки
  var popupWidth = delta*gameWidthCells+padding * 2;  // ширина сцены - попапа
  var gameHightCells = Math.floor((screen.height - padding*2 - bottomReserve)/delta); // 10 количество клеток по высоте
  var popupHeight = delta*gameHightCells+padding*2; // высота сцены - попапа

  popupEl.style.width=popupWidth+'px';
  popupEl.style.height=popupHeight+'px';

  // TODO: изменить
  var snowflakePlaceX = delta / 2; // snowflakePlaceX
  var snowflakePlaceY = popupHeight + delta / 2; // 12 // snowflakePlaceY

  counterEl.style.left = snowflakePlaceX + 45 + 'px';
  counterEl.style.top = snowflakePlaceY + 'px';

  var firePlaceX = delta * 2;
  var firePlaceY = popupHeight + delta / 2;

  livesEl.style.left = firePlaceX + 45 + 'px';
  livesEl.style.top = firePlaceY + 'px';

  timerWripperEl.style.left = delta*gameWidthCells - delta + 'px';
  timerWripperEl.style.top = delta/2 + 'px';

  nameEl.style.top = popupHeight + delta/2 + 'px';
  nameEl.style.right = delta/2 + 'px';

  var heroSelector = ".snowman";
} else {
  var heartEl = document.querySelector('.heart');

  var padding = 15;
  var rightReserve = 250;
  var topReserve = 128;

  var gameWidthCells = 10;
  var delta =  Math.floor((window.innerWidth - padding*2 - rightReserve)/(gameWidthCells*10))*10; // размер клетки по гориз. и вертикали
  var popupWidth = delta*gameWidthCells+padding * 2;  // ширина сцены - попапа
  var gameHightCells = Math.floor((window.innerHeight - padding*2-topReserve)/delta); // 10 количество клеток по высоте
  var popupHeight = delta*gameHightCells+padding*2; // высота сцены - попапа

  popupEl.style.width=popupWidth+'px';
  popupEl.style.height=popupHeight+'px';
  stageEl.style.backgroundSize=delta+'px';

  var snowflakePlaceX = popupWidth+delta / 2; // snowflakePlaceX
  var snowflakePlaceY = delta / 2; // 12 // snowflakePlaceY

  counterEl.style.left = snowflakePlaceX + 100 + 'px';
  counterEl.style.top = snowflakePlaceY - 30 + 'px';

  var firePlaceX = snowflakePlaceX;
  var firePlaceY = snowflakePlaceY + delta;

  livesEl.style.left = firePlaceX + 100 + 'px';
  livesEl.style.top = firePlaceY - 30 + 'px';

  heartEl.style.left = firePlaceX + 'px';
  heartEl.style.top = firePlaceY + 'px';

  var heroSelector = "#square";
}

var game = {
  // размер поля, кол-во клеток
  width: gameWidthCells * delta, //МОБ. версия и десктоп
  height: gameHightCells * delta, //МОБ. версия и десктоп
  active: true,
};

stageEl.style.height = game.height + "px"; // задание высоты DOM элеммента в px
stageEl.style.width = game.width + "px"; // задание ширины DOM элеммента в px

var snowflakes = []; //запись массива из снежинок в переменную
var fires = []; //запись массива из огоньков в переменную

// библиотека
function intersect(object1, object2) {
  // проверка пересечения двух объектов (имеют ли они одинаковые координаты)
  if (object1.x == object2.x && object1.y == object2.y) {
    return true;
  }
  return false;
}
function createSquare(selector, x, y) {
  // функция создания героя (колпачок - квадрат)

  var s = {
    // математическая модель
    x: x,
    y: y,
    el: document.querySelector(selector),
  };

  s.draw = function () {
    // отрисовка математической модели в DOM-элемент (синхронизация с интерфейсом)
    s.el.style.left = s.x + "px";
    s.el.style.top = s.y + "px";
  };

  s.moveY = function (deltaY) {
    // движение по y
    if (s.y + deltaY > game.height) {
      // предел по высоте (чтобы квадрат не выходил за сцену)
      return false;
    }
    if (s.y + deltaY < 0) {
      return false;
    }
    s.y += deltaY;
  };

  s.moveX = function (deltaX) {
    // движение по x
    if (s.x + deltaX > game.width) {
      // предел по ширине (чтобы квадрат не выходил за сцену)
      return false;
    }
    if (s.x + deltaX < 0) {
      return false;
    }
    s.x += deltaX;
  };
  return s;
}

//МОБ. версия и десктоп
function getRandomXY(check) {
  if (check > (gameWidthCells * gameHightCells) / 2) {
    return [10, 2];
  }
  var intX = Math.floor(Math.random() * gameWidthCells) + 1;
  var intY = Math.floor(Math.random() * gameHightCells) + 1;
  x = intX;
  y = intY;
  var x = intX * delta - delta / 2;
  var y = intY * delta - delta / 2;
  for (var i = 0; i < fires.length; i++) {
    if (fires[i].x === x && fires[i].y === y) {
      return getRandomXY(++check);
    }
  }
  for (var i = 0; i < snowflakes.length; i++) {
    if (snowflakes[i].x === x && snowflakes[i].y === y) {
      return getRandomXY(++check);
    }
  }
  if (square.x === x && square.y === y) {
    return getRandomXY(++check);
  }
  return { x: x, y: y };
}

function createRandomSnowflake() {
  // добавление снежинки в случайном месте
  // var x = Math.floor(Math.random() * 8) + 1;
  // var y = Math.floor(Math.random() * 6) + 1;
  var coords = getRandomXY();
  return createSnowflake(snowflakeCount++, coords.x, coords.y);
}

function createSnowflake(numberSf, x, y) {
  // добавление снежинки в конкретном месте

  var id = "snowflake-" + numberSf;
  var el = document.createElement("div");
  el.setAttribute("class", "snowflake");
  el.setAttribute("id", id);
  stageEl.append(el);

  var s = {
    // математическая модель
    x: x,
    y: y,
    el: el,
  };

  s.draw = function () {
    // функция отрисовки
    s.el.style.left = s.x + "px";
    s.el.style.top = s.y + "px";
  };

  //МОБ. версия и десктоп
  s.melt = function () {
    // функция перемещения снежинки
    s.x = snowflakePlaceX; // snowflakePlaceX
    s.y = snowflakePlaceY; // snowflakePlaceY
    s.draw();
  };

  s.draw();
  return s;
}

function updateCounter() {
  // счетчик
  count++;
  if (count % 3 == 0) {
    updateLives(1);
  }
  countEl.innerText = count;
}

function updateLives(number) {
  lives += number;
  livesEl.innerText = lives;
}

function createRandomFire() {
  //добавление огонька в случайном месте
  // var x = Math.floor(Math.random() * 8) + 1;
  // var y = Math.floor(Math.random() * 6) + 1;
  var coords = getRandomXY();
  return createFire(fireCount++, coords.x, coords.y);
}

function createFire(numberF, x, y) {
  // добавление огонька в конкретном месте

  var id = "fire-" + numberF; //порядковый номер id огонька
  var el = document.createElement("div"); //создание Dom узла (Document Element)
  //<div></div>
  el.setAttribute("class", "fire"); //добавляем класс
  // <div class="fire"></div>
  el.setAttribute("id", id);
  // <div class="fire" id="fire-123"></div>
  stageEl.append(el); //добавление на сцену

  var s = {
    // математическая модель
    x: x,
    y: y,
    el: el,
  };

  s.draw = function () {
    // функция отрисовки
    s.el.style.left = s.x + "px";
    s.el.style.top = s.y + "px";
  };

  //МОБ. версия и десктоп
  s.goOut = function () {
    // функция перемещения огонька
    el.classList.add('completed');
    s.x = firePlaceX;
    s.y = firePlaceY;
    s.draw();
  };

  s.draw();
  return s;
}

// проверить все пересечения со снежинками и огоньками
function allIntersections() {
  for (var i = 0; i < snowflakes.length; i++) {
    //цикл снежинок
    if (intersect(square, snowflakes[i])) {
      //если пересечение снеговика со снежинкой
      snowflakes[i].melt(); //снежинка исчезает с поля
      snowflakes.push(createRandomSnowflake()); //снежинка добавляется у счетчика
      fires.push(createRandomFire());
      updateCounter(); //счетчик прибавляет 1
    }
  }

  for (var i = 0; i < fires.length; i++) {
    //цикл огоньков
    if (intersect(square, fires[i])) {
      //если пересечение снеговика с огоньком и время прошло более 10 секунд
      fires[i].goOut(); //огонек исчезает с поля
      //fires.push(createRandomFire());						//огонек добавляется у счетчика
      updateLives(-1); //обновление счетчика жизней
      if (lives > 0) {
        fires.push(createRandomFire());
      } else {
        stopGame(); //остановка игры
        stopsetInterval(); //остановка секундомера
        showWin();
      }
    }
  }
}
//использование библиотеки
var count = 0; //счетчик=0
var countEl = document.querySelector(".counter"); //получение счетчика по классу .counter
var lives = 1;
var livesEl = document.querySelector(".lives");

//МОБ. версия и десктоп
var square = createSquare(heroSelector, delta / 2, delta / 2); //запись в переменную функции добавления колпачка
square.draw(); //отрисовка колпачка

snowflakes.push(createRandomSnowflake()); //добавление снежинок

fires.push(createRandomFire()); //добавление огонька

// ДЕСКТОП
// TODO: мобильная версия
document.onkeydown = function (e) {
  //обработчик нажатия на клавишу
  // console.log(e);
  if (!game.active) {
    return false;
  }
  switch (e.code) {
    case "ArrowUp":
      square.moveY(-delta); //движение при нажатии клавиши по оси Y вниз
      square.draw();
      break;
    case "ArrowDown":
      square.moveY(delta); //движение при нажатии клавиши по оси Y вверх
      square.draw();
      break;
    case "ArrowLeft":
      square.moveX(-delta); //движение при нажатии клавиши по оси X влево
      square.draw();
      break;
    case "ArrowRight":
      square.moveX(delta); //движение при нажатии клавиши по оси X вправо
      square.draw();
      break;
  }
  allIntersections();
};
var num = 0; //секундомер
var timerEl = document.querySelector("#timer span");

var intervalId = setInterval(function () {
  if (num >= timeLimit) {
    stopsetInterval();
    stopGame();
    showWin();
    return;
  }
  timerEl.innerText = ++num;
}, 1000);

function stopsetInterval() {
  //функция остановки секундомера
  clearInterval(intervalId);
}
function stopGame() {
  //функция остановки игры
  game.active = false;
}

function showWin() {
  //появление окна при конце игры
  results.push({
    name: `${name}`,
    count: `${count}`,
    time: formatDate(new Date()),
  });
  //МОБ. версия и десктоп
  updateStore();

  var layer = document.querySelector('.background-layer');
  layer.style.display='block';

  var windowEnd = document.getElementById("popupWin"); // находим наше "окно"
  windowEnd.style.left = '50%'; // "включаем" его

  // var darkLayer = document.createElement("div"); // слой затемнения
  // darkLayer.id = "shadow"; // id чтобы подхватить стиль
  // document.body.appendChild(darkLayer); // включаем затемнение

  // Часть кода, чтобы убрать задний фон
  // var btnsContinue = document.querySelectorAll(".button-end");
  // for (var i = 0; i < btnsContinue.length; i++) {
  //   btnsContinue[i].onclick = function () {
  //     // при клике на кнопку
  //     darkLayer.parentNode.removeChild(darkLayer); // удаляем затемнение
  //     windowEnd.style.display = "none"; // делаем окно невидимым
  //   };
  // }
}

var name = getName();
showName(name);
function showName(name) {
  document.querySelector("#settings span").innerText = name;
}
document.querySelector("#settings").onclick = function () {
  name = prompt("Введите ваше имя");
  storeName(name);
  showName(name);
};
function storeName(name) {
  localStorage.setItem("name", name);
}
function getName() {
  var name = localStorage.getItem("name");
  if (name) {
    return name;
  } else {
    return "Гость";
  }
}

function getClosestNum(num) { // 71
  var count = Math.round((num - delta / 2) / delta); // нам нужно идти на 1 вправо
  return count * delta + delta / 2;
}

function isFireIntersected(square, target, fire) {
  if (Math.min(square.x, target.x) > fire.x) {
    return false;
  }
  if (Math.max(square.x, target.x) < fire.x) {
    return false;
  }
  if (Math.min(square.y, target.y) > fire.y) {
    return false;
  }
  if (Math.max(square.y, target.y) < fire.y) {
    return false;
  }
  const distance =
    Math.abs(
      (target.y - square.y) * fire.x -
        (target.x - square.x) * fire.y +
        target.x * square.y -
        square.x * target.y
    ) /
    Math.sqrt(
      Math.pow(target.y - square.y, 2) + Math.pow(target.x - square.x, 2)
    );
  if (distance < delta / 2) {
    return true;
  }
  return false;
}

function firePathIntersections(square, target, fires) {
  for (var i = 0; i < fires.length; i++) {
    if (isFireIntersected(square, target, fires[i])) {
      fires[i].goOut(); //огонек исчезает с поля
      //fires.push(createRandomFire());						//огонек добавляется у счетчика
      updateLives(-1); //обновление счетчика жизней
      if (lives > 0) {
        fires.push(createRandomFire());
      } else {
        stopGame(); //остановка игры
        stopsetInterval(); //остановка секундомера
        showWin();
      }
      console.log("fire");
    }
  }
  console.log("--------");
}

stageEl.onclick = function (event) {
  if (!game.active) {
    return false;
  } 
  // при клике на сцену колпачок меняет местоположение
  // delta 50 | 128
  // console.log(event);
  var stageX = stageEl.getBoundingClientRect().x;
  var stageY = stageEl.getBoundingClientRect().y;
  firePathIntersections(
    square,
    {
      x: getClosestNum(event.clientX - stageX),
      y: getClosestNum(event.clientY - stageY),
    },
    fires
  );

  square.x = getClosestNum(event.clientX - stageX); //перемещение по оси Х
  square.y = getClosestNum(event.clientY - stageY); //перемещение по оси Y
  square.draw(); //отрисовка
  allIntersections();
};
