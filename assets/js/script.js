/*
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly

GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
*/
var searchWeather = document.getElementById('searchBtn');
var cityCol = document.getElementById('city-col');
var cityInput = document.getElementById('city');
var currentWeather = document.getElementById('today-temp');
var fiveDayForecast = document.getElementById('five-day-forecast');
var cityHistory = JSON.parse(localStorage.getItem('cityHistory')) || [];
var btnContainer = document.getElementById('button-container');
var darkMode = document.getElementById('dark-mode');
var darkModeEnabled;
var lat;
var lng;

var darkModeOn = function() {
    document.body.style.backgroundColor = '#36454F';
    document.body.style.color = '#FFF';
    document.getElementsByClassName("card")[0].style.backgroundColor = '#36454F';
    document.getElementsByClassName("card")[0].style.borderColor = '#FFF';
    if (document.getElementsByClassName("card").length > 3) {
        for (var i=1; i < document.getElementsByClassName("card").length; i++) {
            document.getElementsByClassName("card")[i].style.backgroundColor = '#36454F';
            document.getElementsByClassName("card")[i].style.borderColor = '#FFF';
        }
    }
darkModeEnabled = 1;
}

var saveHistory = function(city){
    //check to see if city exists in array currently, if not, add to array
    if (cityHistory.indexOf(city) === -1) {
        //add city to city history
        cityHistory.push(city);
        //save array to locaL storage
        localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
    }

}




var getCurrentWeather = function(city) {
    
         //clear input
        cityInput.value= '';
        //get current date
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
        
    
    //get mapquest api call for city name
    var mapquestAPI = 'https://www.mapquestapi.com/geocoding/v1/address?key=p3kcpZvR6puTovHsK3MATQbQcfRAszGA&location='+city;

    //fetch latitude and longitude from geocoding mapquest api
    fetch(mapquestAPI).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                //if response works
                /*console.log(data);
                console.log(data.results[0].locations[0].displayLatLng.lat);
                console.log('latitude = '+ data.results[0].locations[0].displayLatLng.lat);
                console.log('longitude = '+ data.results[0].locations[0].displayLatLng.lng);

                */
               //save latitude of city location
                lat = data.results[0].locations[0].displayLatLng.lat;
                //save longtiude of city location
                lng = data.results[0].locations[0].displayLatLng.lng;

                //pass latitude and longitude of parameter into function to get current weather for searched city
                var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+lng+'&exclude=hourly&appid=c7acc02d526544168b9378ebff168887&units=imperial';
                    //pass lon/lat values to onecall api for openweathermap.org
                    fetch(apiUrl).then(function(response) {
                        if (response.ok) {
                            response.json().then(function(data) {
                                //clear any results from being in current
                                currentWeather.innerHTML = '';

                                //if response works for the city, log data
                                console.log(data);
                                console.log(data.current);
                                console.log('temp = '+data.current.temp);
                                console.log('humidity = '+data.current.humidity);
                                console.log('wind speed = '+data.current.wind_speed);
                                console.log('uvi = '+data.current.uvi);
                                //create card container
                                var currentWeatherCard = document.createElement('div');
                                //add card container class
                                currentWeatherCard.classList.add('card');
                                //create card img
                                var currentWeatherCardImg = document.createElement('img');
                                //set current weather card img to icon
                                currentWeatherCardImg.setAttribute("src", "http://openweathermap.org/img/wn/"+data.current.weather[0].icon+".png")
                                //create card body
                                var currentWeatherCardBody = document.createElement('div');
                                //add card body class
                                currentWeatherCardBody.classList.add('card-body');
                                //create title
                                var currentWeatherCardTitle = document.createElement('h5')
                                //add title class
                                currentWeatherCardTitle.classList.add('card-title');
                                //set title = city name
                                currentWeatherCardTitle.textContent = city + ' : ' + today;
                                //create text card
                                var currentWeatherCardText = document.createElement('div');
                                //add card text class
                                currentWeatherCardText.classList.add('card-text');
                                //create ordered list for data
                                var currentWeatherCardOL = document.createElement('ul');
                                //create temp li
                                var currentWeatherCardTemp = document.createElement('li');
                                //assign temp li text
                                currentWeatherCardTemp.textContent = 'Current Temperature (f) = '+data.current.temp;
                                //create humidity element
                                var currentWeatherHumidity = document.createElement('li');
                                //add content to humidity
                                currentWeatherHumidity.textContent = 'Current Humidity = '+data.current.humidity;
                                //create list item for current weather wind
                                var currentWeatherCardWind = document.createElement('li');
                                currentWeatherCardWind.textContent = 'Current Wind Speed (mph) = '+data.current.wind_speed;
                                //create list item for uvi
                                var currentWeatherCardUVI = document.createElement('li');
                                currentWeatherCardUVI.textContent = 'Current UVI = '+data.current.uvi;

                                //add class based on UVI
                                if (data.current.uvi < 3) {
                                    currentWeatherCardUVI.classList.add('text-success');
                                } else if (data.current.uvi < 6) {
                                    currentWeatherCardUVI.classList.add('text-warning');
                                } else {
                                    currentWeatherCardUVI.classList.add('text-danger');
                                };

                                //add image to card
                                currentWeatherCardBody.append(currentWeatherCardImg);
                                //add card body to card
                                currentWeatherCard.append(currentWeatherCardBody);
                                //add card title to card body
                                currentWeatherCardBody.append(currentWeatherCardTitle);
                                //add card text to body
                                currentWeatherCardBody.append(currentWeatherCardText);
                                //add ol to text container
                                currentWeatherCardText.append(currentWeatherCardOL);
                                //add list items to ol
                                currentWeatherCardOL.append(currentWeatherCardTemp);
                                currentWeatherCardOL.append(currentWeatherHumidity);
                                currentWeatherCardOL.append(currentWeatherCardWind);
                                currentWeatherCardOL.append(currentWeatherCardUVI);
                                //add card to current weather container
                                currentWeather.append(currentWeatherCard);

                                //clear 5 day forecast
                                fiveDayForecast.innerHTML = '';
                            //create 5 elements for daily forecase
                            for (var i=0; i<5; i++) {
                                //increment dd to get date of 5 day forecast
                                parseInt(dd);
                                dd++;
                                //reset today value
                                today = mm + '/' + dd + '/' + yyyy;
                                //create card container
                                var dailyWeatherCard = document.createElement('div');
                                //add card container class
                                dailyWeatherCard.classList.add('card', 'col-md', 'col-sm-12');
                                 //create card img
                                 var dailyWeatherCardImg = document.createElement('img');
                                 //add card img class
                                 dailyWeatherCardImg.classList.add('card-image-top');
                                 //set current weather card img to icon
                                 dailyWeatherCardImg.setAttribute("src", "http://openweathermap.org/img/wn/"+data.daily[i].weather[0].icon+".png")
                                //create card body
                                var dailyWeatherCardBody = document.createElement('div');
                                //add card body class
                                dailyWeatherCardBody.classList.add('card-body');
                                //create title
                                var dailyWeatherCardTitle = document.createElement('h5')
                                //add title class
                                dailyWeatherCardTitle.classList.add('card-title');
                                //set title = city name
                                dailyWeatherCardTitle.textContent = city + ' : ' + today;
                                //create text card
                                var dailyWeatherCardText = document.createElement('div');
                                //add card text class
                                dailyWeatherCardText.classList.add('card-text');
                                //create ordered list for data
                                var dailyWeatherCardOL = document.createElement('ul');
                                //create temp li
                                var dailyWeatherCardTemp = document.createElement('li');
                                //assign temp li text
                                dailyWeatherCardTemp.textContent = 'Anticipated Temperature (f) = '+data.daily[i].temp.day;
                                //create humidity element
                                var dailyWeatherHumidity = document.createElement('li');
                                //add content to humidity
                                dailyWeatherHumidity.textContent = 'Anticipated Humidity = '+data.daily[i].humidity;
                                //create list item for current weather wind
                                var dailyWeatherCardWind = document.createElement('li');
                                dailyWeatherCardWind.textContent = 'Anticipated Wind Speed (mph) = '+data.daily[i].wind_speed;
                                //create list item for uvi
                                var dailyWeatherCardUVI = document.createElement('li');
                                dailyWeatherCardUVI.textContent = 'Anticipated UVI = '+data.daily[i].uvi;

                                //add class based on UVI
                                if (data.daily[i].uvi < 3) {
                                    dailyWeatherCardUVI.classList.add('text-success');
                                } else if (data.current.uvi < 6) {
                                    dailyWeatherCardUVI.classList.add('text-warning');
                                } else {
                                    dailyWeatherCardUVI.classList.add('text-danger');
                                };

                                //add card body to card
                                dailyWeatherCardBody.append(dailyWeatherCardImg);
                                dailyWeatherCard.append(dailyWeatherCardBody);
                                //add card title to card body
                                dailyWeatherCardBody.append(dailyWeatherCardTitle);
                                //add card text to body
                                dailyWeatherCardBody.append(dailyWeatherCardText);
                                //add ol to text container
                                dailyWeatherCardText.append(dailyWeatherCardOL);
                                //add list items to ol
                                dailyWeatherCardOL.append(dailyWeatherCardTemp);
                                dailyWeatherCardOL.append(dailyWeatherHumidity);
                                dailyWeatherCardOL.append(dailyWeatherCardWind);
                                dailyWeatherCardOL.append(dailyWeatherCardUVI);
                                //append daily card to daily card container
                                fiveDayForecast.append(dailyWeatherCard);
                            }
                           
                            if (darkModeEnabled === 1) {
                                for (var i=1; i < document.getElementsByClassName("card").length; i++) {
                                    document.getElementsByClassName("card")[i].style.backgroundColor = '#36454F';
                                    document.getElementsByClassName("card")[i].style.borderColor = '#FFF';
                                }
                            }

                                
                            })
                        } else {
                            console.log('Invalid Response');
                        }
                    });
            })
        } else {
            console.log('invalid response from mapquest api');
        }
    });

    
};

var inputBtnValue = function(event) {
    //get button weather value and run search
    getCurrentWeather(event.target.textContent);

}

var historyBtn = function() {
    btnContainer.innerHTML = '';
    
    for (var i=0; i<cityHistory.length; i++) {
    //create button
     var recentSearch = document.createElement('button');
    recentSearch.classList.add('btn-secondary');
     //set button text to name of input value
     recentSearch.textContent = cityHistory[i];
     recentSearch.addEventListener('click', inputBtnValue);
     //add button underneath searchbox container
     btnContainer.append(recentSearch);
    }
     
}

var getCityInput = function(event) {
    //stop page from refreshing
    event.preventDefault();

    if (cityInput && cityInput.value) {
        //get city input value
        var city = cityInput.value;
        //run getCurrentWeather function for city
        getCurrentWeather(city);
        saveHistory(city);
        //call historyBtn
        historyBtn();
    } else {
        alert('Please Enter a City Name');
    }
    
}




//on click of Get Weather button, run get city input function
searchWeather.addEventListener("click", getCityInput)
//call historyBtn
historyBtn();

darkMode.addEventListener("click", darkModeOn);