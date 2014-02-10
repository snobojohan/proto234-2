// TODO: Rekommenderat (vi tror du gillar). pusha in sig i playlist och bland items...

$.fn.closestToOffset = function(offset) {
    var el = null, elOffset, x = offset.left, y = offset.top, distance, dx, dy, minDistance;
    this.each(function() {
        elOffset = $(this).offset();

        if (
        (x >= elOffset.left)  && (x <= elOffset.right) &&
        (y >= elOffset.top)   && (y <= elOffset.bottom)
        ) {
            el = $(this);
            return false;
        }

        var offsets = [[elOffset.left, elOffset.top], [elOffset.right, elOffset.top], [elOffset.left, elOffset.bottom], [elOffset.right, elOffset.bottom]];
        for (off in offsets) {
            dx = offsets[off][0] - x;
            dy = offsets[off][1] - y;
            distance = Math.sqrt((dx*dx) + (dy*dy));
            if (minDistance === undefined || distance < minDistance) {
                minDistance = distance;
                el = $(this);
            }
        }
    });
    return el;
};

$('#carousel-example-generic').on('slid.bs.carousel', function () {
    // nothing now
});

var $activeItem;

var theIframe = function( anId, height){
  var ret = "<div class=\"video-wrapper carousel-inner__videomax\"><iframe class=\"video-wrapper__object\" src=\"http:\/\/www.svtplay.se\/video\/"
            + anId
            + "\/?type=embed&position=0\" seamless frameborder=\"0\" scrolling=\"no\" allowfullscreen style=\"width:"
            + "100%;"
            + "height:"
            + height
            + "px;\"><\/iframe>";
  return ret;
}

var centerScroller = function($item){

    var centerScrollPoint = ( $("#epg").width() / 2 ) - ( $item.width() / 2 );

    // Special iteration fix
    // var centerScrollPoint = (( $("#epg").width() / 4 ) - 12 ) - ( $item.width() / 2 );

    $("#epg").scrollTo( $item , 250, {axis:'x',offset: - centerScrollPoint} );
}

var theScroller = function(direction){

    console.log("do some scrolling to the: " + direction);

    $area = $("#epg");


    $(".epg__item:visible").each(function( index ) {

      console.log( index + ": " + $( this ).text() );

    });

    // $("#epg").scrollTo( $item , 500, {axis:'x',offset: - 30 } );
}

// debulked onresize handler
function on_resize(c,t){onresize=function(){clearTimeout(t);t=setTimeout(c,200)};return c};

on_resize(function() {
  console.log("RESIZED");
  if($activeItem){
  	centerScroller($activeItem);
  }

  var aspectRatio = 9 / 16;
  // console.log("aspectRatio : " + aspectRatio);

  var $videoIframe = $("iframe.video-wrapper__object");
  var $videoWrapper = $("div.video-wrapper");

  if( $videoIframe.length ){

    var iframeWidth = $videoIframe.width();

    $videoIframe.css( "height", function( index ) {
        return iframeWidth * aspectRatio;
    });


	  $videoIframe.removeAttr('height');

  } else {
  	// console.log("Object was not an iFrame");
  }

})(); // these parenthesis triggers this function on pageload

function playVideo($obj){

              // var dimensions = { "width": 800, "height": 400};

            var theItem = $obj.closest( ".item" );
            var theImage = theItem.find(".img-responsive--fill");
            var thePlaybutton = theItem.find(".playcenter");

            var theId = theImage.data("playid");


            console.log( theItem );
            var dimensions = { "width": theImage.width(), "height": theImage.height()};

            console.log( dimensions.width );
            console.log( dimensions.height );

            // theWrapper.css( { "width": dimensions.width, "height": dimensions.height  } );
            thePlaybutton.addClass("hider");
            theImage.before(
                // We don't send width anymore, only height
                theIframe( theId, dimensions.height )

            ).addClass("hider");

            // wait
            setTimeout(function() {

              // DO ALL THE OTHER STUFF!!!
              // theWrapper.removeAttr( "style" );
            }, 500)

}

$(document).ready(function() {

  $(".right.carousel-control").hover(

    // var prev = $("#epg .active").prev();
    // var next = $("#epg .active").next();


    function() {
      // $( this ).append( $( "<span> ***</span>" ) );
      // $( this ).
    }, function() {
      // $( this ).find( "span:last" ).remove();
    }

  );


  //INIT RECOMMEND LIST
  PlaylistHandler.init($("#epg"));
  RecommendHandler.init($('#recommend-list'));
  VideoCarouselHandler.init($('#carousel-example-generic'));


   $(".jsMainmenu-item").bind({

        click: function(event) {

            _self = $(this);


            $(".jsMainmenu-item.active").removeClass('active');
            console.log("removed");

            _self.addClass( "active" );
            console.log("added");
            // event.preventDefault();
        }

    });

  // test
  if( $(".theiframe").length ){

   $(".jsSmaller").bind({

        click: function(event) {
            console.log("CLICKED jsSmaller");
            $(".theiframe").addClass( "theiframe--narrow" );

            // wait
            setTimeout(function() {
              $(".discover-area").show();
            }, 500)

            event.preventDefault();
        }

    });

    $(".jsLarger").bind({

        click: function(event) {
            $(".discover-area").hide();
            console.log("CLICKED jsSmaller");
            $(".theiframe").removeClass( "theiframe--narrow" );
            event.preventDefault();
        }


    });
  }

  // $(".video-wrapper").html( theIframe(1719847) );
  $(".jsPlayVideo").bind({

        click: function(event) {
            playVideo( $(this) );
            event.preventDefault();
        }

    });

	// make it btn
	$('.file-inputs').bootstrapFileInput();

    $activeItem = $("#epg .active");

    centerScroller($activeItem);

    $( "#epg" ).on('click', '.epg__item', function() {
        $activeItem = $(this);
        centerScroller($activeItem);
    });

    console.log( "XXX program XXXXX :::: " + $("#carousel-example-generic .active").data("program") );

    $(".jsRelatedTitle").text( $("#carousel-example-generic .active").data("program") );

    $('#carousel-example-generic').on('slid.bs.carousel', function () {

        console.log("SLIDING");

        $(".video-wrapper").remove();
        $(".hider").removeClass("hider");

      	// wait
      	setTimeout(function() {
      		// DO ALL THE OTHER STUFF!!!
      		$activeItem = $("#epg .active");
      		centerScroller($activeItem);

          playVideo( $(".item.active") );

      	}, 100);
    });


});

var PlaylistHandler = {
     init: function($container) {
        this.$container = $container;
        this.template = Handlebars.compile($("#playlist-item").html());
        this.bindEvents();
    },
    bindEvents: function() {
      var self = this;
      this.$container.siblings(".epg-arrows").on('click', '.jsScrollLeft', function(e) {
        console.log('scroll left');
        centerScroller(self.$container.find('.epg__item').closestToOffset({top: 0, left: self.$container.width()/2}).prev());
      }).on('click', '.jsScrollRight', function(e) {
         centerScroller(self.$container.find('.epg__item').closestToOffset({top: 0, left: self.$container.width()/2}).next());
         console.log('scroll right');
      });
    },
    addToPlaylist: function($item, index) {
        var $activeElement = this.getActiveItem(),
            activeIndex = index || this.getActiveIndex(),
            html = this.template({
                                  startpoint: false,
                                  uniqueid:$item.data("uniqueid"),
                                  index:activeIndex + 1,
                                  programmetitle:$item.data("title"),
                                  episodetitle:$item.data("episode")
                                });

        this._updateIndex(activeIndex);
        return this.$container.find('.epg__item:eq(' + activeIndex + ')').after(html).next();
    },
    getActiveItem: function() {
        return this.$container.find('.epg__item.active');
    },
    getCustomItem: function() {
        return this.$container.find('.epg__item.custom');
    },
    getActiveIndex: function() {
        return parseInt(this.getActiveItem().data("slide-to"))
    },
    _updateIndex: function(startIndex) {
        this.$container.find('.epg__item:gt(' + startIndex + ')').each( function() {
            var obj = $(this);
            obj.attr("data-slide-to", parseInt(obj.attr("data-slide-to")) + 1);
        });
    }
};

var VideoCarouselHandler = {
    init: function($container) {
        this.$container = $container;
        this.template = Handlebars.compile($("#video-item").html());

        this._updateVideos();
    },
    addVideo: function($item, index) {
        this._updateVideos();

        var $activeElement = this.$videos.parent().find('.active'),
            activeIndex = index || parseInt($activeElement.attr("data-index")),
            html = this.template({
                                  startpoint: false,
                                  playid:$item.data("playid"),
                                  uniqueid: $item.data("uniqueid"),
                                  index:activeIndex + 1,
                                  programmetitle:$item.data("title"),
                                  episodetitle:$item.data("episode")
                                });

        this._updateIndex(index);
        this.$container.find('.item:eq(' + activeIndex + ')').after(html);
    },
    _updateVideos: function() {
        this.$videos = this.$container.find(".carousel-inner .item");
    },
    _updateIndex: function(startIndex) {
        this.$videos.parent().find('.item:gt(' + startIndex + ')').each( function() {
            var obj = $(this);
            obj.attr("data-index", parseInt(obj.attr("data-index")) + 1);
        });
    }
};

var RecommendHandler = {
    init: function($container) {
        this.$container = $container;

        this.bindEvents();
    },
    bindEvents: function() {
        var self = this;
        this.$container.on('click', '.jsRecommendVideo', function(e) {
            self.playVideo($(this));
            e.preventDefault();
        }).on('click', '.jsAddToPlaylist:not(.disabled)', function(e) {
            self.addToPlaylist($(this).siblings('.jsRecommendVideo'));
            $(this).addClass('disabled');
            e.preventDefault();
        });
    },
    addToPlaylist: function($item) {
          var index = PlaylistHandler.getActiveIndex() + PlaylistHandler.getCustomItem().length;

          PlaylistHandler.addToPlaylist($item, index).addClass("custom");
          VideoCarouselHandler.addVideo($item, index );
    },
    playVideo: function($item) {
        var $activeElement = PlaylistHandler.getActiveItem();
        PlaylistHandler.addToPlaylist($item);
        VideoCarouselHandler.addVideo($item, parseInt($activeElement.attr("data-slide-to")) );

        //trigger click
        $activeElement.next().trigger('click');
    }
};

