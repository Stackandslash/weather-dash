

var APIKey = "c0708fd314d4abadfb6401261f72c41f";
var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=Bujumbura,Burundi&appid=" + APIKey;

$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(response) {

  console.log(queryURL);
  console.log(response);
  console.log(response.list[0].main.temp);
  var tempK = response.list[0].main.temp;
  var tempF = (tempK - 273.15) * 1.8 + 32; //Remove this once we swap to imperial measurements in the call.
  $("#currenttemp").text("Temperature: " + tempF.toFixed(1) + "°F");
  $("#headline").text(response.city.name + " TIME AND ICON");
  $("#currenthumidity").text("Humidity: " + response.list[0].main.humidity + "%");
  $("#currentwindspeed").text("Wind speed: " + response.list[0].wind.speed);
}); 