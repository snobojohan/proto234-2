// SHOW THE PAGE
// alert("SHOW IT");
$('body').addClass('show-after-tamper');

var isFirstPage = (window.location.href.length < 24);
var isProgrammePage = ( window.location.href.indexOf("http://beta.svtplay.se/program") > -1 );
var isVideoPage = ( (window.location.href.indexOf("/klipp/") > -1) || (window.location.href.indexOf("/video/") > -1));

var isTitlePage = ( ($(".play-videoarea-container-outer").length > -1) && !isVideoPage );
// This misses some...
var isCategoryPage = ( $('#recommended-videos').length > -1 && !isFirstPage  && !isProgrammePage && !isTitlePage);


var hbsReplacer = function(hbspath,theJson,$target,insertType){
	if(typeof Handlebars != 'undefined'){
		console.log("CALLING DIRECTLY");
		hbsReplacerDo(hbspath,theJson,$target,insertType);
	} else {
		$.getScript( "http://localhost:3000/js/libs/handlebars-v1.3.0.js", function() {   
	    	hbsReplacerDo(hbspath,theJson,$target,insertType);
		});
	}
	
}

var hbsReplacerDo = function(hbspath,theJson,$target,insertType){

	var template, source;

	        
    $.ajax({
        url: hbspath, //path ex. js/templates/mytemplate.handlebars
        cache: false,
        crossDomain: true,
        fail: function() {
            console.log( "error" );
        },
        success: function(data) {
            console.log("sucess");

            source    = data;
            template  = Handlebars.compile(source);
        
            if(insertType == "after"){
				$target.after( template(theJson) );
			} else if (insertType == "append") {
				$target.append( template(theJson) );
			} else {
				$target.html( template(theJson) );
			}   

        }               
    });    

}
///////// GENERAL FIXES /////////////
$('.play-navigation-tvmode a').text("Fjärrkontroll");

$('.play-search-box').attr("placeholder","Hitta i 234");
 // HERE
$('.play-menu-item a:contains("Start")').text("Titta");
$('.play-menu-item a:contains("Program")').text("Upptäck");

// The tags
	var theTags = '<div class="taglist"><div class="play-videolist-section-header"><h1 class="play-h3">Genrer</h1></div>' +
	              '<div class="tags"><a href="/sok?q=romcoms"><i class="fa fa-tag"></i></span> RomComs</a>' +
	    		  	' &nbsp; <a href="/sok?q=krim"><i class="fa fa-tag"></i></span> Krim</a>' +
	    			' &nbsp; <a href="/sok?q=humor"><i class="fa fa-tag"></i></span> Humor</a>' +
	    			' &nbsp; <a href="/sok?q=kort"><i class="fa fa-tag"></i></span> Korta program</a>' +
	    			' &nbsp; <a href="/sok?q=Svenskt"><i class="fa fa-tag"></i></span> Svenskt</a>' +
	    			' &nbsp; <a href="/sok?q=Amerikanskt"><i class="fa fa-tag"></i></span> Amerikanskt</a>' +
	    			' &nbsp; <a href="/sok?q=Brittiskt"><i class="fa fa-tag"></i></span> Brittiskt</a></div>'
	    		  ;
	$('.play-footer-container-inner').html(' ');
	$('.play-footer-container-inner').html( theTags );



	// Manipulate the more
	$('.play-h3:contains("Mer från Film & Drama")').html('Mer <i class="fa fa-tag"></i> Humor');
	$('.play-h3:contains("Mer från Mer från Kultur & Nöje")').html('Mer <i class="fa fa-tag"></i> Musik');
	// Tag more
	var aTag = '<i class="fa fa-tag"></i></span> ';
	$('h2 .play-text-bold').before(aTag);

if ( isFirstPage ) {
	console.log("isFirstPage");
	$('#recommended-videos').html("<img src='http://localhost:3000/img/playlist.jpg' style='width:100%' />");
	$('.play-videolist-group .play-h3:contains("Populärast")').text("Vi tror du gillar");
	$('.play-container > .play-videolist-group').slice(-4).remove();
} else if ( isProgrammePage ){

	console.log("isProgrammePage");
	$('.play-alphabetic-group.is-first').html( theTags );

	// DO IT!
	hbsReplacer("http://localhost:3000/hbs/videolist.handlebars",{title: "Sista chansen"},$('.play-alphabetic-group.is-first'),"append");
	
	hbsReplacer("http://localhost:3000/hbs/videolist.handlebars",{title: "Senaste program"},$('.play-alphabetic-group.is-first'),"append");
	
	hbsReplacer("http://localhost:3000/hbs/videolist.handlebars",{title: "Populärast just nu"},$('.play-alphabetic-group.is-first'),"append");

} else if ( isCategoryPage ){
	console.log("isCategoryPage");
	$('#recommended-videos').html("");
} else if ( isVideoPage ){
	console.log("isVideoPage");
	// $('.play-container .play-videoarea-container-outer').html( "<h1>TBA</h1>" );
} else if ( isTitlePage ) {
	console.log("isTitlePage");
	$('.play-container .play-videoarea-container-outer').addClass('play-videoarea-container-outer--tampered');
	console.log( "IS TITLE PAGE" );
	hbsReplacer("http://localhost:3000/hbs/titleinfo.handlebars",{title: "Girls", tagline:"Komediserie om fyra tjejer i New York", text: "Girls handlar om de fyra tjejerna Hannah, Marnie, Jessa och Shoshanna. De är alla strax över tjugo och lever i New York. I centrum står Hannah som har författardrömmar.",img:"http://www.svt.se/cachable_image/1385988303/girls/article964885.svt/alternates/large_cinema/girls_992.jpg"},$('.play-container .play-videoarea-container-outer'),"html");
	hbsReplacer("http://localhost:3000/hbs/rightsout.handlebars",{txt: "Rättigheter för tidigare avsnitt har gått ut"},$('#playJs-more-episodes .play-videolist-element:last-child'),"after");
	playArrowHTML = '<div class="playcenter playcenter--s">' +
	    			'<span class="fa fa-play-circle fa-4x"></span>' +
	    			'</div>';
	$("#playJs-more-episodes .play-videolist-heading").after( playArrowHTML );
	
}

/*
///// FIRSTPAGE STUFF /////
if(window.location.href.indexOf("?start") > -1) {
	$('.play-videolist-group .play-h3:contains("Populärast")').text("Vi tror du gillar");
	$('.play-container > .play-videolist-group').slice(-2).remove();
}
$('.play-h3:contains("Mer från Film & Drama")').html('Mer <i class="fa fa-tag"></i> Humor');
// $('.play-container > .play-videolist-group').slice(-3).remove();
$('.play-footer-container-inner').html(' ');
$('.play-footer-container-inner').html(theHTML);

$('.playJsAlphabeticTitle').addClass('playx-clearfix');

$('h2 .play-text-bold').before(aTag);

if(window.location.href.indexOf("kulturochnoje") > -1) {
    $('#recommended-videos').before(theHTML);
    $('#recommended-videos').remove();
    $('<img src="http://localhost:3000/img/alts/square/1795302ettorochnollor.jpg" class="ao-image" />').insertBefore(".playJsAlphabeticTitle a");
}
*/


/*
(function() {
      var hb = document.createElement('script'); hb.type = 'text/javascript'; hb.async = true;
      hb.src = 'http://localhost:3000/js/libs/handlebars-v1.3.0.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(hb, s);
    
    	console.log("--------------------");
    	console.log("-> " + Handlebars);
    	console.log("--------------------");
    
      (function getTemplateAjax(path) {
        
        var source;
        var template;
        
        $.ajax({
            url: "http://localhost:3000/hbs/titleinfo.handlebars", //path ex. js/templates/mytemplate.handlebars
            cache: false,
            crossDomain: true,
            fail: function() {
                console.log( "error" );
            },
            success: function(data) {
                console.log("sucess");
                source    = data;
                template  = Handlebars.compile(source);
                $('.play-container').html( template );
                
               
            }               
        });         
    })()
})();
*/

