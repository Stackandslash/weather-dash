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
  const citypass = $("#searchbox").val();
  console.log(citypass);
  updateWeather(citypass);
});

//The big updating function, for execution once we've confirmed the input is valid.
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
    console.log(response);
    console.log(lat, lon);
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
    console.log(lat, lon);
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
      console.log(response);
      queryURL =
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        cityname +
        "&units=imperial&appid=" +
        APIKey;
      $.ajax({
        url: queryURL,
        method: "GET",
      }).then(function (response) {
        console.log(queryURL);
        console.log(response);
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
            .text("Temperature: " + response.list[i].main.temp + "°F");
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
        if (citylist.includes(cityname)) {
          console.log("citylist length", citylist.length, "first citylist entry", citylist[0])
          return;
        }
        if (citylist.length >= 4){
          $(`#${citylist.shift()}`).remove();
          console.log("new list:", citylist);
        }
        citylist.push(cityname);
        var navItemOuterEl = $("<li class='nav-item'>");
        navItemOuterEl.appendTo("#citylist");
        $(
          `<a class="nav-link active list-group-item bg-white text-dark border-light text-center" href="#" id="${cityname}">${cityname}</a>`
        ).appendTo(navItemOuterEl);
      });
    });
  });
}
