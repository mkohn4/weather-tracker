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
var lat;
var lng;




var getCurrentWeather = function(city) {
    //clear input


    var recentSearch = document.createElement('button');
    recentSearch.textContent = city;
    cityCol.append(recentSearch);
    

    var mapquestAPI = 'http://www.mapquestapi.com/geocoding/v1/address?key=p3kcpZvR6puTovHsK3MATQbQcfRAszGA&location='+city;

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
                                //if response works for the city, log data
                                console.log(data);
                                console.log(data.current);
                                console.log('temp = '+data.current.temp);
                                console.log('humidity = '+data.current.humidity);
                                console.log('wind speed = '+data.current.wind_speed);
                                console.log('uvi = '+data.current.uvi);
                                
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

var getCityInput = function(event) {
    //stop page from refreshing
    event.preventDefault();
    //get city input value
    var city = cityInput.value;
    //run getCurrentWeather function for city
    getCurrentWeather(city);

}


//on click of Get Weather button, run get city input function
searchWeather.addEventListener("click", getCityInput)
