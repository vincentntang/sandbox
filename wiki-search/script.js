$(document).ready(() => {
  $('#search').click(() => {
    var searchTerm = $('#searchTerm').val();
    //API url with search term
    var baseUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + searchTerm + "&format=json&callback=?";

    $.ajax({
      type: "GET",
      url: baseUrl,
      async: false,
      dataType: "json",
      success: (data) => {
        // console.log(data[1][0]); // Title Item 1
        // console.log(data[2][0]); // Description Item 1
        // console.log(data[3][0]); // Link Item 1
        /* output JSON items */
        $('#output').empty();
        for (var i = 0; i < data[1].length; i++) {
          $('#output').append('<h3>' + data[1][i] + '</h3>'); // Title
          $('#output').append('<p>' + data[2][i] + '</p>'); // Descr
          $('#output').append('<a href="' + data[3][i] + '">' + data[3][i] + '</a>'); // url
          $('#output').append('<hr>');
        }
        $("#searchTerm").val('');

      }, //end success
      error: (errorMessage) => {
        alert("Error");
      }
    }); // end ajax
  }); // end click

  /* Enter Button = 13 */
  $("#searchTerm").keypress((e) => {
    if (e.which == 13) {
      $("#search").click();
    }
  });

}); // end ready