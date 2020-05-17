
$(document).on("click", "a", function(event){
    console.log(event);
    updateWeather(event.target.text);
})

$("#searchbtn").on("click", function(event){
    //console.log(event);
    const citypass = $("#searchbox").val();
    console.log(citypass);
    updateWeather(citypass);
})

function updateWeather(cityname){

var APIKey = "c0708fd314d4abadfb6401261f72c41f";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial&appid=" + APIKey;

//One call and update for the current weather situation in the specified area.
$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(response) {

  console.log(queryURL);
  console.log(response);
  $("#currenttemp").text("Temperature: " + response.main.temp.toFixed(1) + "°F");
  $("#headline").text(response.name + " (" + moment().format('MM[/]DD[/]YYYY') + ") TIME AND ICON");
  $("#currenthumidity").text("Humidity: " + response.main.humidity + "%");
  $("#currentwindspeed").text("Wind speed: " + response.wind.speed + " MPH");
  //add the UV index
}); 

queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityname + "&units=imperial&appid=" + APIKey;
$.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
      console.log(queryURL);
      console.log(response);
      $(".weatherblock").each(function(i){
          const temp = response.list[i].main.temp;
          const blockdate = moment().add(i+1, 'days').format('MM[/]DD[/]YYYY');
          console.log(blockdate);
           $(this).children(".wbdate").text(blockdate);
           $(this).children(".wbtemp").text("Temperature: " + response.list[i].main.temp + "°F");
           $(this).children(".wbicon").text(""); //icon goes here
           $(this).children(".wbhumidity").text("Humidity: " + response.list[i].main.humidity + "%");  

      })
  }); 
}