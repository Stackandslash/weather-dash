
$(document).on("click", "a", function(event){

    console.log(event);
    updateWeather(event.target.text)
})

function updateWeather(cityname){

var APIKey = "c0708fd314d4abadfb6401261f72c41f";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial&appid=" + APIKey;

//target.text (for if the click was on one of the saved searches)
$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(response) {

    console.log(queryURL);
  console.log(response);
  $("#currenttemp").text("Temperature: " + response.main.temp.toFixed(1) + "°F");
  $("#headline").text(response.name + " TIME AND ICON");
  $("#currenthumidity").text("Humidity: " + response.main.humidity + "%");
  $("#currentwindspeed").text("Wind speed: " + response.wind.speed + " MPH");
}); 
}