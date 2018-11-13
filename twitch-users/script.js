var channels = ["freecodecamp", "test_channel", "ESL_SC2"];

function getChannelInfo() {
  channels.forEach(function (channel) {
    // make URL
    function makeURL(type, name) {
      return 'https://wind-bow.glitch.me/twitch-api/' + type + '/' + name + '?callback=?';
    }

    // first chain
    $.getJSON(makeURL("users", channel), function (data1) {
      var logo;
      if (data1.logo == undefined) {
        logo = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/867725/Image_not_available.png";
      }
      logo = data1.logo;

      // second chain, grab stream data
      $.getJSON(makeURL("streams", channel), function (data2) {
        var statusDisplay;
        var statusClass;
        if (data2.stream === undefined) {
          statusDisplay = "not an account";
          statusClass = "offline";
        }
        else if (data2.stream === null) {
          statusDisplay = "currently offline";
          statusClass = "offline";
        }
        else {
          statusDisplay = "currently online";
          statusClass = "online";
        }

        // Append Data from global var. Add classes to toggle
        $("#logo").append('<img class="' + statusClass + '" src="' + logo + '"/>');
        $("#status").append('<p class="' + statusClass + '">' + channel + ' is ' + statusDisplay + '</p>')
      });
    });
  });
}



$(document).ready(function () {
  getChannelInfo();
  $("#btn-all").click(function () {
    $(".offline,.online").removeClass("hide");
  });
  $("#btn-online").click(function () {
    $(".offline, .online").removeClass("hide");
    $(".offline").addClass("hide");
  });
  $("#btn-offline").click(function () {
    $(".offline,.online").removeClass("hide");
    $(".online").addClass("hide");
  });
});
