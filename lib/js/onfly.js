jQuery(document).ready(function() {

	if ("geolocation" in navigator) {
	  $('.js-geolocation').show(); 
	  /*alert("SII!!");*/
	} else {
	  $('.js-geolocation').hide();
	  /*alert("NOO :(!!")*/
	}

	/* Where in the world are you? */
	$('.js-geolocation').on('click', function() {
	  navigator.geolocation.getCurrentPosition(function(position) {
	    loadWeather(position.coords.latitude+','+position.coords.longitude); //load weather using your lat/lng coordinates
	  });
	});



   Metronic.init(); // init metronic core componets
   Layout.init(); // init layout
   QuickSidebar.init(); // init quick sidebar
Demo.init(); // init demo features
   Index.init();   
   Index.initDashboardDaterange();
   Index.initJQVMAP(); // init index page's custom scripts
   Index.initCalendar(); // init index page's custom scripts
   Index.initCharts(); // init index page's custom scripts
   Index.initChat();
   Index.initMiniCharts();
   Tasks.initDashboardWidget();
   $('.fecha').dmy();
   setInterval('updateClock()', 1000);

   
   $( ".contenido input, .contenido select" ).change(function() {
	  	$("button.eliminar").hide();
	  	$("button.guardar_update").show();
	});

});