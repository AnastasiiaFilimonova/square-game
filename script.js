// настройка игры
var snowflakeCount = 1;  	// счетчик снежинок
var fireCount = 1;        //счетчик огоньков

var delta = 128;     		// размер клетки по гориз. и вертикиле
var game = {				// размер поля, кол-во клеток
	width: 8 * delta,
	height: 6 * delta,
	active: true,
}
var stageEl = document.querySelector('#stage'); 	// получили DOM элеммент
stageEl.style.height = game.height + 'px';			// задание высоты DOM элеммента в px
stageEl.style.width = game.width + 'px';       		// задание ширины DOM элеммента в px


// библиотека
function intersect(object1, object2) {           // проверка пересечения двух объектов (имеют ли они одинаковые координаты)
	if (object1.x == object2.x && object1.y == object2.y) {
		return true
	}
	return false
}

function createSquare(selector, x, y, size, color, radius) {	// функция создания героя (колпачок - квадрат)

	var s = {	// математическая модель
		x: x,
		y: y,
		size: size,
		color: color,
		radius: radius,
		el: document.querySelector(selector)
	}

	s.draw = function () {	// отрисовка математической модели в DOM-элемент (синхронизация с интерфейсом)
		s.el.style.left = s.x + 'px';
		s.el.style.top = s.y + 'px';
		s.el.style.width = s.size + 'px';
		s.el.style.height = s.size + 'px';
		s.el.style.background = s.color;
		s.el.style.borderRadius = s.radius + '%';
	}

	s.randomColor = function () {	// смена цвета на случайный
		var o = Math.round, r = Math.random, d = 255;
		s.color = 'rgba(' + o(r() * d) + ',' + o(r() * d) + ',' + o(r() * d) + ',' + r().toFixed(1) + ')';
	}

	s.moveY = function (deltaY) { 			// движение по y
		if (s.y + deltaY > game.height) {	// предел по высоте (чтобы квадрат не выходил за сцену)
			return false;
		}
		if (s.y + deltaY < 0) {
			return false;
		}
		s.y += deltaY;
	}

	s.moveX = function (deltaX) {			// движение по x
		if (s.x + deltaX > game.width) {		// предел по ширине (чтобы квадрат не выходил за сцену)
			return false;
		}
		if (s.x + deltaX < 0) {
			return false;
		}
		s.x += deltaX;
	}
	return s;
}

function getRandomXY(check) {
	if (check > (8 * 6) / 2) {
	return [10, 2];
	}
	var intX = Math.floor(Math.random() * 8) + 1;
	var intY = Math.floor(Math.random() * 6) + 1;
	x = intX;
	y = intY;
	var x = intX * delta - 64;
	var y = intY * delta - 64;
	for (var i = 0; i < fires; i++) {
	if (fires[i].x === x && fires[i].y === y) {
	return getRandomXY(++check);
	}
	}
	for (var i = 0; i < snowflakes; i++) {
	if (snowflakes[i].x === x && snowflakes[i].y === y) {
	return getRandomXY(++check);
	}
	}
	if (square.x === x && square.y === y) {
	return getRandomXY(++check);
	}
	return { x: x, y: y };
	}
/*function getRandomXY(count) {
	if (!count) {
		count = 1
	}
	if (count > (8 * 6) / 2) {
		console.log('full stack');
		return [10 * delta - 64, 2 * delta - 64];
	}
	var x = Math.floor(Math.random() * 8) + 1;
	x = x * delta - 64;
	var y = Math.floor(Math.random() * 6) + 1;
	y = y * delta - 64;
	for (var i = 0; i < fires; i++) {
		if ((fires[i].x === x) && (fires[i].y === y)) {
			return getRandomXY(++count);
		}
	}
	for (var i = 0; i < snowflakes; i++) {
		if ((snowflakes[i].x === x) && (snowflakes[i].y === y)) {
			return getRandomXY(++count);
		}
	}
	if ((square.x === x) && (square.y === y)) {
		return getRandomXY(++count);
	}
	console.log([x, y]);
	return [x, y];
}*/

function createRandomSnowflake() {     	// добавление снежинки в случайном месте
	// var x = Math.floor(Math.random() * 8) + 1;
	// var y = Math.floor(Math.random() * 6) + 1;
	var coords = getRandomXY();
	return createSnowflake(snowflakeCount++, coords.x, coords.y)
}

function createSnowflake(numberSf, x, y) {	// добавление снежинки в конкретном месте

	var id = 'snowflake-' + numberSf;
	var el = document.createElement('div');
	el.setAttribute('class', 'snowflake');
	el.setAttribute('id', id);
	stageEl.append(el);

	var s = { 	// математическая модель
		x: x,
		y: y,
		el: el
	}

	s.draw = function () {	// функция отрисовки
		s.el.style.left = s.x + 'px';
		s.el.style.top = s.y + 'px';
	}

	s.melt = function () {	// функция перемещения снежинки
		s.x = delta * 10;
		s.y = delta * 3;
		s.draw()
	}

	s.draw();
	return s;
}

function updateCounter() {	// счетчик
	count++;
	if(count%3==0){
		updateLives(1);
	}
	countEl.innerText = count;
}

function updateLives(number){
	lives+=number;
	livesEl.innerText = lives;
}

function createRandomFire() {    								//добавление огонька в случайном месте
	// var x = Math.floor(Math.random() * 8) + 1;
	// var y = Math.floor(Math.random() * 6) + 1;
	var coords = getRandomXY();
	return createFire(fireCount++, coords.x, coords.y)
}

function createFire(numberF, x, y) {	// добавление огонька в конкретном месте

	var id = 'fire-' + numberF;      //порядковый номер id огонька
	var el = document.createElement('div');  //создание Dom узла (Document Element)
	//<div></div>
	el.setAttribute('class', 'fire');    //добавляем класс
	// <div class="fire"></div>
	el.setAttribute('id', id);
	// <div class="fire" id="fire-123"></div>
	stageEl.append(el);   //добавление на сцену

	var s = { 	// математическая модель
		x: x,
		y: y,
		el: el
	}

	s.draw = function () {	// функция отрисовки
		s.el.style.left = s.x + 'px';
		s.el.style.top = s.y + 'px';
	}

	s.goOut = function () {	// функция перемещения огонька
		s.x = delta * 10;
		s.y = delta * 4;
		s.draw()
	}

	s.draw();
	return s;
}

//использование библиотеки
var count = 0;													//счетчик=0
var countEl = document.querySelector('.counter');					//получение счетчика по классу .counter
var lives=1;
var livesEl = document.querySelector('.lives');
var square = createSquare('#square', 64, 64, 50, 'red', 50);     	//запись в переменную функции добавления колпачка
square.draw();													//отрисовка колпачка
var snowflakes = [];                                          	//запись массива из снежинок в переменную
snowflakes.push(createRandomSnowflake());                       //добавление снежинок
var fires = [];                                          			//запись массива из огоньков в переменную
fires.push(createRandomFire());                       			//добавление огонька



stageEl.onclick = function (e) {                           			//при клике на сцену колпачок меняет цвет и местоположение
	console.log(square);
	square.x = e.offsetX;											//перемещение по оси Х
	square.y = e.offsetY;											//перемещение по оси Y
	square.randomColor();										//цвет
	square.draw();												//отрисовка
}
/*
var btnUpEl = document.querySelector('.button-up');                //при нажатии на кнопку - движение вверх
btnUpEl.onclick = function (e) {
	square.moveY(-delta);
	square.draw();
}
var btnDownEl = document.querySelector('.button-down');			//при нажатии на кнопку - движение кнопка вниз
btnDownEl.onclick = function (e) {
	square.moveY(delta);
	square.draw();
}
var btnLeftEl = document.querySelector('.button-left');			//при нажатии на кнопку - движение кнопка влево
btnLeftEl.onclick = function (e) {
	square.moveX(-delta);
	square.draw();
}
var btnRightEl = document.querySelector('.button-right');			//при нажатии на кнопку - движение кнопка вправо
btnRightEl.onclick = function (e) {
	square.moveX(delta);
	square.draw();
}
*/
document.onkeydown = function (e) {                        			//обработчик нажатия на клавишу
	console.log(e);
	if (!game.active) {
		return false
	}
	switch (e.code) {
		case 'ArrowUp':
			square.moveY(-delta); 								//движение при нажатии клавиши по оси Y вниз
			square.draw();
			break;
		case 'ArrowDown':
			square.moveY(delta);  								//движение при нажатии клавиши по оси Y вверх
			square.draw();
			break;
		case 'ArrowLeft':
			square.moveX(-delta); 								//движение при нажатии клавиши по оси X влево
			square.draw();
			break;
		case 'ArrowRight':
			square.moveX(delta); 								//движение при нажатии клавиши по оси X вправо
			square.draw();
			break;
	}
	for (var i = 0; i < snowflakes.length; i++) {					//цикл снежинок
		if (intersect(square, snowflakes[i])) {                  	//если пересечение снеговика со снежинкой
			snowflakes[i].melt();								//снежинка исчезает с поля
			snowflakes.push(createRandomSnowflake());			//снежинка добавляется у счетчика
			fires.push(createRandomFire());
			updateCounter();									//счетчик прибавляет 1							
		}
	}

	for (var i = 0; i < fires.length; i++) {							//цикл огоньков
		if (intersect(square, fires[i])) {               //если пересечение снеговика с огоньком и время прошло более 10 секунд               	
			fires[i].goOut();									//огонек исчезает с поля
			//fires.push(createRandomFire());						//огонек добавляется у счетчика
			updateLives(-1);                                       //обновление счетчика жизней
			if (lives>0){
				fires.push(createRandomFire());
			} else {
			
			stopGame();                                    		//остановка игры
			stopsetInterval();           					//остановка секундомера
			showWin();
			}
		}
	}
}

var num = 0;                                               		 //секундомер
var timerEl = document.querySelector("#timer span");

var intervalId = setInterval(function () {
	if (num >= 30) {
		stopsetInterval();
		stopGame();
		showWin();
		return;
	}
	timerEl.innerText = ++num;
}, 1000)

function stopsetInterval() {									//функция остановки секундомера
	clearInterval(intervalId);
}
function stopGame() {                      						//функция остановки игры
	game.active = false;
}


function showWin() {                      //появление окна при конце игры
	results.push(
		{
			name: `${name}`,
			count: `${count}`,
			time: formatDate(new Date()),
		}
	);
	updateStore();
	var darkLayer = document.createElement('div'); // слой затемнения
	darkLayer.id = 'shadow'; // id чтобы подхватить стиль
	document.body.appendChild(darkLayer); // включаем затемнение

	var windowEnd = document.getElementById('popupWin'); // находим наше "окно"
	windowEnd.style.display = 'block'; // "включаем" его

	var btnsContinue = document.querySelectorAll('.button-end');
	for (var i = 0; i < btnsContinue.length; i++) {
		btnsContinue[i].onclick = function () {  // при клике на кнопку
			darkLayer.parentNode.removeChild(darkLayer); // удаляем затемнение
			windowEnd.style.display = 'none'; // делаем окно невидимым
		}
	}
}

var name = getName();
showName(name);
function showName(name) {
	document.querySelector('#settings span').innerText = name;
}
document.querySelector('#settings').onclick = function () {
	name = prompt("Введите ваше имя");
	storeName(name);
	showName(name);
}
function storeName(name) {
	localStorage.setItem('name', name);
}
function getName() {
	var name = localStorage.getItem('name');
	if (name) {
		return name;
	} else {
		return 'Гость'
	}
}
/*localStorage.setItem('', 'updateCounter'); //в localStorage


var localValue = localStorage.getItem('');
*/