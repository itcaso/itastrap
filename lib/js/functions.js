function loadWeather(location, woeid) {
	  $.simpleWeather({
	    location: location,
	    woeid: woeid,
	    unit: 'c',
	    success: function(weather) {
	    	html = '<div class="city">'+weather.city+', '+weather.country+'</div>';
			html += '<h2><i class="icon-'+weather.code+'"></i> '+weather.temp+'&deg;'+weather.units.temp+'</h2>';
			//html += '<li>'+weather.city+', '+weather.region+'</li>';
			html += '<div class="minmax"><span class="min">Min: '+weather.low+'&deg;C</span> / <span class="max">Max: '+weather.high+'&deg;C</span></div>';
			//html += '<ul><li>Min: '+weather.low+'&deg;C</li>';
			//html += '<li>Max: '+weather.high+'&deg;C</li></ul>';  
	    	$("#weather").html(html);
	    },
	    error: function(error) {
	      $("#weather").html('<p>'+error+'</p>');
	    }
	  });
	}

	loadWeather('Monterrey MX','');
	/*navigator.geolocation.getCurrentPosition(function(position) {
	    loadWeather(position.coords.latitude+','+position.coords.longitude); //load weather using your lat/lng coordinates
	  });*/

$.fn.dmy = function () {
   var mydate=new Date()
   var year=mydate.getYear()
   if(year<1000)
     year+=1900
     var day=mydate.getDay()
     var month=mydate.getMonth()
     var daym=mydate.getDate()
   if(daym<10)
     daym="0"+daym
     //var dayarray=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
     var montharray=new Array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
     html = '';
     //document.write(""+dayarray[day]+", "+montharray[month]+" "+daym+", "+year+"") 
     $(this).html(/*""+dayarray[day]+", */""+montharray[month]+" "+daym+", "+year+"");
};

function updateClock ( )
 	{
 	var currentTime = new Date ( );
  	var currentHours = currentTime.getHours ( );
  	var currentMinutes = currentTime.getMinutes ( );
  	var currentSeconds = currentTime.getSeconds ( );
  	var currentDay = currentTime.getDay();

  	// Pad the minutes and seconds with leading zeros, if required
  	currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
  	currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;

  	// Choose either "AM" or "PM" as appropriate
  	var timeOfDay = ( currentHours < 12 ) ? "AM" : "PM";

  	// Convert the hours component to 12-hour format if needed
  	currentHours = ( currentHours > 12 ) ? currentHours - 12 : currentHours;

  	// Convert an hours component of "0" to "12"
  	currentHours = ( currentHours == 0 ) ? 12 : currentHours;

  	// Compose the string for display
  	var currentTimeString = currentHours + ":" + currentMinutes + /*":" + currentSeconds + */" " + timeOfDay;
  	
  	var dayarray=new Array("Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado");
  	
   	$(".hora").html(""+dayarray[currentDay]+", "+currentTimeString+"");
   	  	
 }