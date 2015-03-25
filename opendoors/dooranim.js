$(document).ready(function(){
    $(".cntr").click(function(){
        $('#animate').cssanimation('#door-left', 3000);
		
 $('#animate').cssanimation('#door-right', 3000);
 
    });
	$("label").click( function(){
         $(this).hide();
		  $("#door-left").hide(2000);
		   $("#door-right").hide(2000);
    });
		
});