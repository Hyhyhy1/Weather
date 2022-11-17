document.forms.publish.onsubmit = function() {
    let latitude = this.latitude.value;
    let longitude = this.longitude.value;
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + String(latitude) +
            '&longitude=' + String(longitude) + '&hourly=temperature_2m,weathercode'
   sendRequest(url)
        .then(data => printResponce(data))
    return false
};

function sendRequest(url){
    return fetch(url).then(responce => {
        return responce.json()
    })
}

function printResponce(responce){
    date = getCurrentDate();
    console.log(responce);

    let index = 0;
    while (responce.hourly.time[index] != date){
        index+=1;
    }

    document.getElementById("temperature").innerHTML = responce.hourly.temperature_2m[index] + ' ' + responce.hourly_units.temperature_2m;
    document.getElementById("weathercode").innerHTML = getWeather(responce.hourly.weathercode[index])
    //document.getElementById("image").src = 
}

function getCurrentDate(){
    date = new Date();
    date = new Date(date.setMilliseconds(1 * 60 * 60 * 1000));
    date = date.toISOString().slice(0,14) + '00';
    return date;
}

function getWeather(weathercode){ //переписать на if
    if (weathercode = 0){
        return 'Ясно';
        
    } else if(weathercode > 0 && weathercode <=3){
        return 'Частично облачно';

    } else if(weathercode > 44 && weathercode <=48){
        return 'Туман';

    } else if(weathercode > 60 && weathercode <=65){
        return 'Дождь';

    } else if(weathercode > 70 && weathercode <=75){
        return 'Снегопад';

    } else if(weathercode >94 && weathercode <=99){
        return 'Гроза';

    } else{
        return 'Неизвестный код погоды';
    }
}