//Setting up our variable, initially hiding our divs (avoiding placeholder problems in case of a first time visitor), and calling the last city searched up, if any.
var citylist = [];
var lat = 0;
var lon = 0;
$("#currentweatherdiv").hide();
$(".weatherblock").hide();
updateWeather(localStorage.getItem("lastcity"));

//Our onclick for established links. Since they've already been verified, not much needs to be done here.
$(document).on("click", "a", function (event) {
  event.preventDefault();
  updateWeather(event.target.text);
});

$("#searchbtn").on("click", function (event) {
  event.preventDefault();
  //console.log(event);
  event.preventDefault();
  const citypass = $("#searchbox").val();
  $("#searchbox").val("");
  updateWeather(citypass);
});

//The big updating function, for execution once we've confirmed the input is valid. This whole thing could probably do to be broken up into smaller functions later.
function updateWeather(cityname) {
  if(cityname == null){
    return;
  }
  var APIKey = "c0708fd314d4abadfb6401261f72c41f";
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityname +
    "&units=imperial&appid=" +
    APIKey;

  //One call and update for the current weather situation in the specified area.
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    const whicon =
      "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
    lat = response.coord.lat;
    lon = response.coord.lon;
    $("#currenttemp").text(
      "Temperature: " + response.main.temp.toFixed(1) + "°F"
    );
    $("#headline").html(
      response.name +
        " (" +
        moment().format("MM[/]DD[/]YYYY") +
        ") <img src='" +
        whicon +
        "' alt=' Current weather icon'>"
    );
    $("#currenthumidity").text("Humidity: " + response.main.humidity + "%");
    $("#currentwindspeed").text("Wind speed: " + response.wind.speed + " MPH");
    queryURL =
      "https://api.openweathermap.org/data/2.5/uvi?appid=" +
      APIKey +
      "&lat=" +
      lat +
      "&lon=" +
      lon;

    //Another call and update for the UV Index
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      const uv = response.value;
      const bg = "bg-danger";
      if (uv < 3) {
        bg = "bg-success";
      } else if (uv < 5) {
        bg = "bg-warning";
      }

      $("#uvindex").html(
        'UV Index: <span id="uvbox" class = "' +
          bg +
          ' rounded p-1 text-light">' +
          uv +
          "</span>"
      );
      $("#currentweatherdiv").show();
      queryURL =
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        cityname +
        "&units=imperial&appid=" +
        APIKey;
      $.ajax({
        url: queryURL,
        method: "GET",
      }).then(function (response) {
        $(".weatherblock").each(function (i) {
          const blockdate = moment()
            .add(i + 1, "days")
            .format("MM[/]DD[/]YYYY");
          const wbicon =
            "http://openweathermap.org/img/w/" +
            response.list[i].weather[0].icon +
            ".png";
          $(this).children(".wbdate").text(blockdate);
          $(this)
            .children(".wbtemp")
            .text("Temp: " + response.list[i].main.temp + "°F");
          $(this)
            .children(".wbicon")
            .html("<img src='" + wbicon + "' alt=' Current weather icon'>");
          $(this)
            .children(".wbhumidity")
            .text("Humidity: " + response.list[i].main.humidity + "%");
        });
        $(".weatherblock").show();
        // This portion saves cities to the temporary list, and the permanent value for the next visit. This block is here because the ajax .then functions appear to act as an input checker. If the query doesn't return anything, the .then doesn't seem to fire. So, only valid searches can return results.
        localStorage.setItem("lastcity", cityname);

        //This stops the block of code if the city has already been added to the history previously, since the rest of the code will add it.
        if (citylist.includes(cityname)) {
          return;
        }
        // This checks if the history has reached a certain size. If it has, it removes the oldest entry from the list to make room for the new one.
        if (citylist.length >= 4){
          $(`#${citylist.shift()}`).remove();
        }

        //This sends over a new element to the citylist element containing the city name. The element can be clicked on to re-search.
        citylist.push(cityname);
        var navItemOuterEl = $("<li class='nav-item'>");
        navItemOuterEl.appendTo("#citylist");
        $(
          `<a class="nav-link active list-group-item bg-white text-dark border-light text-center" href="#" id="${cityname}">${cityname}</a>`
        ).css('textTransform', 'capitalize').appendTo(navItemOuterEl);
      });
    });
  });
}
