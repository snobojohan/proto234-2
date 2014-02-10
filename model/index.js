var videos;

// Testdata
exports.getTestData = function theData(callback) {
    callback("",{
			    	title: "Model test title",
			    	pagetitle: "Model test pagetitle",
                    videos: videos
	});
};
videos = [
   {
   	"id":0,
    length:"23",
    "program":"Lotta & GW på jakt",
   	"title":"Avsnitt 2: Vildsvin",
   	
   	"season":1,
   	"body":"Lorem ipsum dolor sit amet.", 
   	"freeze":"/img/234_0002_lotta-och-gw.jpg"
   },
   {
   	"id":1,
   	"program":"Work of Art",
       length:"28",
   	"title":"Avsnitt 4",
   	"season":2,
   	"body":"Lorem ipsum dolor sit amet.", 
   	"freeze":"/img/234_0006_workofart.jpg"
   },
   {
    	"id":2,
        length:"26",
        "program":"Äkta människor",
    	"title":"Avsnitt 4: Hämnden",
 	
    	"season":1,
    	"body":"Therese och Pilar känner sig förnedrade när deras pojkvänner inte behandlas som människor. Samtidigt börjar Rogers anti hubot-förening få väldigt våldsamma planer, men varför beter sig Bea så konstigt?", 
    	"freeze":"http://www.svt.se/cachable_image/1383748103/akta-manniskor/article1583441.svt/alternates/extralarge/florentine-mimi-bea.jpg"
    },
    {
    	"id":3, 
    	"startpoint":"true",
    	length:"12", 
    	"program":"Bron",
    	"playid":"1602925",
    	"title":"Avsnitt 1", 
    	"body":"People who are mean aren't nice or fun to hang around.", 
    	"freeze":"/img/234_0024_Bron.jpg"
    },
    {
    	"id":4,
        
        length:"12",
        "program":"Revolt",
        "title":"Avsnitt 9",
        "body":"Dagen för hopptävlingen är här – det är nu det gäller. Kommer Eddie att kunna slå Isabelle?",
        "freeze":"http://www.svt.se/cachable_image/1385635431000/revolt/article1600605.svt/ALTERNATES/extralarge/eddie-tavling.jpg"
    },
    {
    	"id":5, 
    	length:"15", 
    	"program":"Svensk Humor",
    	"title":"Avsnitt 6",
    	"body":"I want a new XBox One. Please fund my Kickstarter.",
        "freeze":"/img/234_0008_svenskhumor.jpg"
    },
    {
    	"id":6, 
    	length:"38", 
    	"program":"Modellagenturen",
    	"title":"Avsnitt 3",
    	"body":"I want a new XBox One. Please fund my Kickstarter.",
        "freeze":"/img/234_0011_modellagenturen2.jpg"
    },
    {
    	"id":7, 
    	length:"38", 
    	"program":"Homeland",
    	"season": 3,
    	"title":"Avsnitt 11: Big Man in Tehran",
    	"body":"I want a new XBox One. Please fund my Kickstarter.",
        "freeze":"/img/234_0016_Homeland.jpg"
    },
];

exports.getVideos = function theData(callback) {
    callback("",{
			    	title: "234",
			    	pagetitle: "Demo page",
                    videos: videos,
                    likedvideos: videos
	});
};

exports.getDbVideos = function theData(callback) {

	  var dirty = require('dirty');
	  var db = dirty('videos.db');
	  var dbVideos = [];
        var recommendedVideos = [];
	
	  db.on('load', function(length) {
          // console.log('db loaded. nr of video:', length)
	      db.forEach(function(key, val) {
            // console.log('Found key: %s, val: %j', key, val);
	      
	        val.uniqueid = key;
	      
            // console.log( "-- TEST -->> : " + val.recommended );

            if(!val.recommended ){
              // Push to playlist
              dbVideos.push(val);
            } else if (val.recommended == "on"){
              // Push to recommende list
              recommendedVideos.push(val);
            }
	      
            //   console.log(val);
	       });

          callback("",{
              title: "Videos",
              pagetitle: "Videos",
              videos: dbVideos,
              recommendedvideos: recommendedVideos
          });

      });
};


exports.getVideo = function(id) {
    for(var i=0; i < videos.length; i++) {
        if(videos[i].id == id) return videos[i];
    }
}




exports.getRelated = function(id) {

	var relatedVideos = [];
	
    for(var i=(id+1); i < videos.length; i++) {
        relatedVideos.push( videos[i] );
    }
 
    // console.log( relatedVideos );
}

exports.setVideo = function( aBody, aUniqueName ) {

	console.log( aBody.videoname );
	
	// Get our form values. These rely on the "name" attributes
	// var videoName = aBody.videoname;
	// var programmeTitle = aBody.programmetitle;
	
	// var aUniqueName = encodeURIComponent(aBody.uniquename).replace(/%20/g,'+');
	var aPlayId = aBody.playid;
	
	var dirty = require('dirty');
	  var db = dirty('videos.db');
	
	  db.on('load', function() {
	    db.set(aUniqueName, {
	    	playid: aPlayId,
	    	programmetitle: aBody.programmetitle,
	    	season: aBody.season,
	    	episode: aBody.episode,
	    	episodetitle: aBody.episodetitle,
	    	length: aBody.length,
	    	description: aBody.description,
        recommended: aBody.recommended
	    });
	    console.log('Added %s aUniqueName.');
		
	    db.forEach(function(key, val) {
	      // console.log('Found key: %s, val: %j', key, val);
	    });
	  });
	
	  db.on('drain', function() {
	    console.log('All records are saved on disk now.');
	  });
	
	return true;

}
