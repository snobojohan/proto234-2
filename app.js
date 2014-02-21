// app.js
/**
 * Module dependencies.
 */

var 	express = require('express')
	,	hbs = require('hbs')
	,	routes = require('./routes')
	,	http = require('http')
    ,   fs = require('fs')
    ,   cors = require('cors')
	,	path = require('path')
//	,	fs = require('fs')
	/*,	dirty = require('dirty')*/;



var app = express();

// Authenticator

app.use(express.basicAuth(function(user, pass) {
 return user === 'demo' && pass === 'plattform';
}));


// Allows cross-domain-requests
app.use(cors());

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

hbs.registerPartials(__dirname + '/views/partials/');

hbs.registerHelper("epgwidth", function(lngt){
    return Math.max(190, lngt * 8);
});

hbs.registerHelper('template_include', function(name) {
    var file = fs.readFileSync("views/partials/" + name, "utf8");
    return file.replace("{{@", "{{");
});

hbs.registerHelper('random_number', function(min, max) {
    return Math.floor(Math.random()*max) + min;
});

hbs.registerHelper ('truncate', function (str, len) {
    if (str.length == 0) {
        str = "Programbeskrivning saknas";
    }

    if (str.length > len && str.length > 0) {
        var new_str = str + " ";
        new_str = str.substr (0, len);
        new_str = str.substr (0, new_str.lastIndexOf(" "));
        new_str = (new_str.length > 0) ? new_str : str.substr (0, len);

        return new hbs.SafeString ( new_str +'...' );
    }
    return str;
});

app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(app.router);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://beta.svtplay.se");
  res.header("Access-Control-Allow-Headers", "-Requested-With, x-requested-by");
  next();
});

app.use(express.compress());
app.use('/img', static('/public/img', 86400000 ));
app.use('/', static('/public', 0));
//app.use('/', express.static(__dirname + '/public', { maxAge: 86400000 /* 1d */ }));

//app.use(express.static(app.root + '/public/img', ));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

////////////////////////////////////////
// Routing
////////////////////////////////////////
app.get('/', routes.index );

app.get('/test', routes.test );

app.get('/slider', routes.slider );

app.get('/google', routes.google );

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

function static(dirname, age) {
    return express.static(path.join(__dirname, dirname), { maxAge: age });
}
