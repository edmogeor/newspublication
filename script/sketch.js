// © COPYRIGHT GEORGE EDMONDS 2018

var scaler;

function setScale() {
  scaler = Math.min(
    $( window ).width() / 2174,
    $( window ).height() / 1480,
  );
  inputscaler = Math.max(Math.min(scaler, 1.5), 0.35);
  $("#urlinput").css( "font-size", 25*inputscaler + 'px');
  $("#download").css( "font-size", 25*inputscaler + 'px');
  $("#urlinput").css( "width", 700*inputscaler + 'px');
  $("#urlinput").css( "padding", 10*inputscaler + 'px');
  $("#download").css( "padding", 10*inputscaler + 'px');
}

$( window ).resize(function() {
  setScale();
});


function isURL(str) {
  var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if(!regex .test(str)) {
    alert("Please enter valid URL.");
    return false;
  } else {
    return true;
  }
}

$(document).ready(function() {
  setScale();
  $("#input-container").css( "display", "block")
  $( "#download" ).click(function() {
    var url = $('#urlinput').val();
    if (isURL(url) == true) {
      $.getJSON("https://newsapi.edmonds.design/extract/" +'?url='+ url, function(result) {
            setScale();
            console.log(result);
            $("#headline").text(result.headline);
            $("#source").text(result.source);
            if (result.date !== "Invalid date") {
              $("#date").text(result.date);
              $("#time").text(result.time);
            } else {
              $("#date").text('');
              $("#time").text('');
            }
            $("#number1").text("N° " + result.wordpos.one);
            $("#number2").text("N° " + result.wordpos.two);
            $("#number3").text("N° " + result.wordpos.three);
            $("#number4").text("N° " + result.wordpos.four);
            $("#word1").text(result.words.one);
            $("#word2").text(result.words.two);
            $("#word3").text(result.words.three);
            $("#word4").text(result.words.four);
            $("#summary").text(result.summary);
            $("#colorcode").text(result.pixelrgb);
            var summary = document.getElementById("summary");
            $("#summary").dotdotdot({
              ellipsis: " ...",
              truncate: "word",
           });
            $("#page").css( "color", getContrastYIQ(result.pixelhex))
            $("#page").css( "background-color", result.pixelrgb)
            $("#word1-container").css( "border-bottom", "5px solid " + getContrastYIQ(result.pixelhex));
            $("#word2-container").css( "border-bottom", "8px solid " + getContrastYIQ(result.pixelhex));
            $("#word3-container").css( "border-bottom", "14px solid " + getContrastYIQ(result.pixelhex));
            $("#word4-container").css( "border-bottom", "23px solid " + getContrastYIQ(result.pixelhex));
            var doc = new jsPDF({
              unit: 'mm',
              format: [170, 180]
            })
            doc.addHTML($('#page')[0], 0, 0, {
              'background': '#fff',
            }, function() {
              doc.save('page.pdf');
              location.reload();
            });
        });
      };
    });
  });

function getContrastYIQ(hexcolor){
    var r = parseInt(hexcolor.substr(0,2),16);
    var g = parseInt(hexcolor.substr(2,2),16);
    var b = parseInt(hexcolor.substr(4,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? 'black' : 'white';
}
