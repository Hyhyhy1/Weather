let widgetsCounter = 0;
let latitude = 0
let longitude = 0;

document.forms.publish.onsubmit = function() {
    widgetsCounter += 1;
    latitude = this.latitude.value;
    longitude = this.longitude.value;
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + String(latitude) +
            '&longitude=' + String(longitude) + '&hourly=temperature_2m,weathercode,windspeed_10m'
    sendRequest(url).then(data => formWidget(data));
    return false
};

function sendRequest(url){
    return fetch(url).then(responce => {
        return responce.json()
    })
}
//функция получилось большой, но есть ли смысл её дробить на более мелкие? Она создает html разметку виджетов-элементов списка
//можно было отделить создание внутренних элементов от оберток, но есть ли в этом смысл?
function formWidget(responce){
    let widgetsContainer = document.getElementById("widgets_container");
    console.log(responce);

    let listElement = document.createElement('li');
    listElement.className += "widgets_list_item";

    let listElementWrapper = document.createElement('div');
    listElementWrapper.className += "widgets_wrapper";

    let widgetHeader = document.createElement('div');
    widgetHeader.className += "widgets_header"

    let headerTemperature = document.createElement('div');
    headerTemperature.className += "widgets_header_temperature";
    
    let temperature = document.createElement('p');
    temperature.className += "widgets_temperature";

    let temperatureIcon = document.createElement('img');
    temperatureIcon.className += "widgets_icon";

    let weathercode = document.createElement('p');
    weathercode.className += "widgets_weathercode";

    let windSpeed = document.createElement('p');
    windSpeed.className += "widgets_windSpeed";
    
    let map = document.createElement('div');
    map.className += "widgets_map";
    map.id = String(widgetsCounter);
    ymaps.ready(initMap);

    headerTemperature.appendChild(temperature);
    headerTemperature.appendChild(temperatureIcon);
    widgetHeader.appendChild(headerTemperature);
    widgetHeader.appendChild(weathercode);
    widgetHeader.appendChild(windSpeed);
    listElementWrapper.appendChild(widgetHeader);
    listElementWrapper.appendChild(map);
    listElement.appendChild(listElementWrapper);
    widgetsContainer.appendChild(listElement);

    fillWeatherData(temperature, temperatureIcon, weathercode, windSpeed, responce)
}

function initMap(){
    let map = new ymaps.Map(String(widgetsCounter),{
        center: [latitude, longitude],
        zoom: 7
    })
}

function getCurrentDateIndex(responce){
    //получение текущей даты в соответствующем запросу форматте
    date = new Date();
    date = new Date(date.setMilliseconds(1 * 60 * 60 * 1000));
    date = date.toISOString().slice(0,14) + '00';

    //получение индекса, которому соответствует текущая дата в массиве дат ответа api 
    let index = 0;
    while (responce.hourly.time[index] != date){
        index+=1;
    }
    return index;
}

function fillWeatherData(temperature, temperatureIcon, weathercode, windSpeed, responce){ 
    let index = getCurrentDateIndex(responce);
    let code = responce.hourly.weathercode[index];
    temperature.textContent = responce.hourly.temperature_2m[index] + ' ' + responce.hourly_units.temperature_2m;
    windSpeed.textContent = 'Скорость ветра ' + responce.hourly.windspeed_10m[index] + ' км/ч';

    if (code == 0){
        weathercode.textContent = 'Ясно';
        temperatureIcon.src = "images/day.svg";

    } else if(code > 0 && code <=3){
        weathercode.textContent = 'Частично облачно';
        temperatureIcon.src = "images/cloudy.svg";

    } else if(code > 44 && code <=48){
        weathercode.textContent = 'Туман';
        temperatureIcon.src = "images/cloudy.svg";

    } else if((code > 60 && code <=67) || (code > 79 && code <=85) || (code > 50 && code <=57)){
        weathercode.textContent = 'Дождь';
        temperatureIcon.src = "images/rainy.svg";

    } else if(code > 70 && code <=77){
        weathercode.textContent = 'Снегопад';
        temperatureIcon.src = "images/snowy.svg";

    }else if(code >94 && code <=99){
        weathercode.textContent = 'Гроза';
        temperatureIcon.src = "images/thunder.svg";

    }else{
        weathercode.textContent = 'Неизвестный код погоды';
        temperatureIcon.src = "images/not-applicable.png";
    }
}