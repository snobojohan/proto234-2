// app.js
/**
 * Module dependencies.
 */

var 	express = require('express')
	,	hbs = require('hbs')
	,	routes = require('./routes')
	,	http = require('http')
    ,   fs = require('fs')
//	,	path = require('path')
//	,	fs = require('fs')
	/*,	dirty = require('dirty')*/;



var app = express();

app.use(express.bodyParser({uploadDir:'/tmpfiles'}));

/// DIRTY ///
// var db = dirty('videos.db');

var locals = {
	author:'johb'
	// add other vars here
};

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');

app.set('view engine', 'html');
app.engine('html', hbs.__express);

hbs.registerPartials(__dirname + '/views/partials');

hbs.registerHelper("epgwidth", function(lngt){
    return Math.max(190, lngt * 8);
});

hbs.registerHelper('template_include', function(name) {
    var file = fs.readFileSync("views/partials/" + name, "utf8");
    return file.replace("{{@", "{{");
});

hbs.registerHelper('random_list', function(context) {

});

app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(app.router);
app.use(express.static(__dirname + '/public'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

////////////////////////////////////////
// Routing
////////////////////////////////////////
app.get('/', routes.index );
app.get('/test', routes.test );

app.get('/framer', routes.framer );

app.get('/framed', routes.framed );
app.get('/newvideo', routes.newvideo );
// Post videos

app.post('/addvideo', routes.addvideo );



/*app.post('/addvideo', function (req, res) {

	console.log( req.body );

	var aBody = req.body;

	var aName = encodeURIComponent(aBody.uniquename).replace(/%20/g,'+');
	var aPlayId = aBody.playid;

    var tempPath = req.files.file.path,
        targetPath = path.resolve('./public/uploads/' + aName + '.jpg');

    if (path.extname(req.files.file.name).toLowerCase() === '.jpg') {

        fs.rename(tempPath, targetPath, function(err) {

            if (err) {
            	console.log(err);
            	res.send("Something went wrong with the file uploading : read the console");
            } else {
            	console.log("Upload completed!");
            	res.send("Upload completed! : " + aName + " " + aPlayId );

            }



        });
    } else {
        fs.unlink(tempPath, function () {

        	console.error("Only .jpg files are allowed!");

            // if (err) throw err;


            res.send("Only .jpg files are allowed!");
        });
    }


});*/
/*
app.post('/addvideo', function(request, response){

    console.log(request.body.videoname);
    console.log(request.body.programmetitle);

});
*/

/* The 404 Route (ALWAYS Keep this as the last route) */
app.use(function(req, res, next){
    res.status(404).render('404', {title: "Sorry, page not found"});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});