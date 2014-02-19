var data = require('../model/index'),
	path = require('path'),
	fs = require('fs'),
  	gm = require('gm');

exports.index = function (req, res) {

	console.log("index.js - routes");

	// VIDEOS from database
	data.getDbVideos(function(err,theData){

		  	 	if (err){
		  			console.log("ERROR : " + err);
		  			// TODO: handle Error
		  		} else {
		  	 		// console.log(theData);
		  	 		res.render('index',theData);
		  	 	}

		  	});

};

exports.slider = function (req, res) {
	res.render(	
		'slider', 
		{ title: 'Vi tror du gillar', layout : 'layout-betasvtplay' }
	);
}

exports.test = function (req, res) {

		  data.getDbVideos(function(err,theData){

		  	 	if (err){
		  			console.log("ERROR : " + err);
		  			// TODO: handle Error
		  		} else {
		  	 		// console.log(theData);
		  	 		res.render('test',theData);
		  	 	}

		  	});


}

exports.newvideo = function(req, res){
  res.render('newvideo', { title: 'Add New Video' });
};

exports.addvideo = function(req,res) {

	// console.log( req.body );



		var aBody = req.body;
		var aName = aBody.uniquename.replace(/[^a-z0-9]/gi, '').toLowerCase(); // encodeURIComponent(aBody.uniquename).replace(/%20/g,'-');

	    var tempPath = req.files.file.path,
	        targetPath = path.resolve('./public/uploads/' + aName + '.jpg');

	    if (path.extname(req.files.file.name).toLowerCase() === '.jpg') {

	        fs.rename(tempPath, targetPath, function(err) {

	            if (err) {
	            	console.log(err);
	            	res.send("Something went wrong with the file uploading : read the console");
	            } else {

	            	console.log("Upload completed!");

	            	var sourcePath = targetPath;

	            	// resize and remove EXIF profile data
	            	var lSize = {width: 988, height: 557};
	            	var lTargetpath = './public/img/alts/large/' + aName + '.jpg';
	            	gm(sourcePath)
	            	.resize(lSize.width)
	            	.crop(lSize.width,lSize.height)
	            	.noProfile()
	            	.write(lTargetpath, function (err) {
	            	  if (err) {

	            	  	console.log('Error', err);

	            	  } else {
	            	  	console.log('Done resizing large');
	            	  }
	            	});

	            	var sSize = {width: 200, height: 200};
	            	var sTargetpath = './public/img/alts/square/' + aName + '.jpg';
	            	gm(sourcePath)
	            	  .resize(null, sSize.height + ">")
	            	  .gravity('Center')
	            	  .extent(sSize.width, sSize.height)
	            	  .noProfile()
	            	  .write(sTargetpath, function (err) {
	            	    if (err) {
	            	    	console.log('Error', err);
	            	    } else {
	            	    	console.log('Done resizing square');
	            	    }
	            	  });


	            	data.setVideo( req.body, aName );

	            	res.send("Färdigt! : " + aName);

	            }

	        });
	    } else {
	        fs.unlink(tempPath, function () {
	        	console.error("Only .jpg files are allowed!");
	            res.send("Det krävs en .jpg bild!");
	        });
	    }


};
