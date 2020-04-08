var button = document.querySelector('.submit');
var results = getFromStorage();
var index = 0;                                                    //@todo
var table=document.querySelector('.item');  
var lastTime=results[results.length-1].time;
results.sort( function( firstValue, secondValue ){
    return secondValue.count-firstValue.count
} );
if (table){
    for (var i = 0; i < results.length; i++) {
        createResult(results[i], i+1);
    }
}                                  

function updateStore() {                                     //обновление хранилища данных
    console.log(results);
    localStorage.setItem('results', JSON.stringify(results))       //сохранение в localStorage
}
function getFromStorage() {
    var data = localStorage.getItem('results');                //получение из localStorage
    if (!data) {
        return [];                                         //вернуть пустой массив
    }
    return JSON.parse(data)                                 //вернуть распакованный массив
}
function getPad(num) {
    num = "" + num
    if (num.length < 2) {
        num = "0" + num
    }
    return num;
}
function formatDate(date) {

    var day = getPad(date.getDate());

    var monthIndex = getPad(date.getMonth() + 1);

    var year = date.getFullYear();

    var hour = getPad(date.getHours());

    var minute = getPad(date.getMinutes());

    var second = getPad(date.getSeconds());
    return `${day}.${monthIndex}.${year} ${hour}:${minute}:${second}`;
}

function createResult(task, index) {              //создание нового элемента

    // Создаем новый элемент и сохраняем его в переменной.
    var newEl = document.createElement('tr');
    if (task.time==lastTime){
        newEl.classList.add('active');
    }
    var newTd=document.createElement('td');

    newTd.innerText = index;  // Создаем текстовый узел и сохраняем его в переменной.

    newEl.appendChild(newTd);

    newTd=document.createElement('td');

    newTd.innerText = task.name;  // Создаем текстовый узел и сохраняем его в переменной.

    newEl.appendChild(newTd);

    newTd=document.createElement('td');

    newTd.innerText = task.count;  // Создаем текстовый узел и сохраняем его в переменной.

    newEl.appendChild(newTd);

    newTd=document.createElement('td');

    newTd.innerText = task.time;  // Создаем текстовый узел и сохраняем его в переменной.

    newEl.appendChild(newTd);
    // Прикрепляем новый текстовый узел к новому элементу.
    table.appendChild(newEl);              

};

