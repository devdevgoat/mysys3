// JavaScript Document

$(document).ready(function() {



$(".eqi-strip" ).hover(
  function() {
    $(this).find(".feature").show();
  }, function() {
    $(".feature").hide();
  }
);

$( ".eqi-strip .img-circle" ).click(function() { 

    $(".selectbox").show();
  
});

$( ".cross , .tick" ).click(function() { 

    $(".selectbox").hide();
  
});

$('.selectbox .button').click(function(){
    $(this).toggleClass("selected");
});


});
/*
*/