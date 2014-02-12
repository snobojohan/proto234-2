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

var $activeItem;

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

/*on_resize(function() {
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

})();*/ // these parenthesis triggers this function on pageload

function playVideo($obj){

            var theItem = $obj.closest( ".item" );
            var theImage = theItem.find(".jsPlayVideo");
            var thePlaybutton = theItem.find(".playcenter");
            var iframeTemplate = Handlebars.compile($("#video-iframe").html());

            var theId = theImage.data("playid");

            // theWrapper.css( { "width": dimensions.width, "height": dimensions.height  } );
            thePlaybutton.addClass("hider");
            var theIframeVideo = iframeTemplate( {id: theId});
            theItem.append(theIframeVideo).css('background-image', 'none');

            theItem.fitVids({ customSelector: "iframe[src^='http://www.svtplay.se']"});

}

$(document).ready(function() {


  //SPLASH
  SplashHandler.init($('.svt234-Splash'));
  SplashHandler.show();

  //INIT RECOMMEND LIST
  PlaylistHandler.init($("#epg"));
  //RecommendHandler.init($('#recommend-list'));
  VideoCarouselHandler.init($('#carousel-example-generic'));
  setNextText();


  // $(".video-wrapper").html( theIframe(1719847) );

	// make it btn
	$('.file-inputs').bootstrapFileInput();

    $activeItem = $("#epg .active");

    //centerScroller($activeItem);

    /*$( "#epg" ).on('click', '.epg__item', function() {
        $activeItem = $(this);
        centerScroller($activeItem);
    });*/

    //$(".jsRelatedTitle").text( $("#carousel-example-generic .active").data("program") );

    $('#carousel-example-generic').on('slid.bs.carousel', function () {

        console.log("SLIDING");

        VideoCarouselHandler.stopVideo();

        setNextText();
      	// wait
      	setTimeout(function() {
      		// DO ALL THE OTHER STUFF!!!
      		$activeItem = $("#epg .active");

      		//centerScroller($activeItem);

          playVideo( $(".item.active") );

      	}, 100);
    });

    function setNextText() {
      var $next = $(".item.active").next(),
          $prev = $(".item.active").prev();
      if ($next.length > 0) {
        var title = $next.find(".svt234-VideoInfo .title").text(),
            episode = $next.find(".svt234-VideoInfo .episode").text(),
            $nextbutton = $(".svt234-VideoControlls .video-next");
        $nextbutton.find('.next-title').text(title);
        $nextbutton.find('.next-episode').text(episode);
      }

      if ($prev.length > 0) {
        var title = $prev.find(".svt234-VideoInfo .title").text(),
            episode = $prev.find(".svt234-VideoInfo .episode").text(),
            $prevbutton = $(".svt234-VideoControlls .video-prev");
        $prevbutton.find('.next-title').text(title);
        $prevbutton.find('.next-episode').text(episode);
      }

    }

});

var SplashHandler = {
    TRANSITION_END : "webkitTransitionEnd transitionend oTransitionEnd otransitionend",
    TRANSITION_START : "webkitTransitionStart transitionstart oTransitionStart otransitionstart",

    init: function($container) {
      this.$container = $container;
      this.$progressbar = $container.find('.progress');
      this.$progressbar.find('.progress-bar').css('width', '0');
    },

    show: function() {
      var self = this;
      this.$container.removeClass("splashHide");
      self.startLoader();
    },
    hide: function() {
      this.$container.one(this.TRANSITION_END, function() {
          $('.svt234-MainVideo').removeClass('splashHide');
      }).addClass("splashHide");
    },
    startLoader: function() {
      var self = this;
      this.$progressbar.find('.progress-bar').one(this.TRANSITION_END, function() {
        self.hide();
      }).css('width', '100%');
    }
};



var PlaylistHandler = {
     init: function($container) {
        this.$container = $container;
        this.template = Handlebars.compile($("#playlist-item").html());
        this.bindEvents();
        this._updatePlaylist();
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
    _updatePlaylist: function() {
      //if (this.width < 1)
      this._calculateWidth();

      this.$container.find('.epg__list').width(this.width);
    },
    _updateIndex: function(startIndex) {
        this.$container.find('.epg__item:gt(' + startIndex + ')').each( function() {
            var obj = $(this);
            obj.attr("data-slide-to", parseInt(obj.attr("data-slide-to")) + 1);
        });
    },
    _calculateWidth: function() {
      //SET WIDTH
        var width = 0;
        this.$container.find('.epg__item').each(function() {
          //console.log('$(this).outerWidth()', $(this).outerWidth());
          width += $(this).outerWidth();

        });
        this.width = width < 1 ? 10000 : width;
    }
};

var VideoCarouselHandler = {
    init: function($container) {
        this.$container = $container;
        this.template = Handlebars.compile($("#video-item").html());

        this._bindEvents();

        this._updateVideos();
    },
    _bindEvents: function() {
      var self = this;
      $(".svt234-VideoControlls .video-close").on("click", function() {
        self.closeVideo();
        return false;
      });

        $(".jsPlayVideo").on("click", function(e) {
          playVideo( $(this) );
          e.preventDefault();
        });

    },
    stopVideo: function() {
      $(".fluid-width-video-wrapper").remove();
      $(".hider").removeClass("hider");
    },
    closeVideo: function() {
      VideoCarouselHandler.stopVideo();
      $('.svt234-MainVideo').addClass('hidden');
       $('.svt234Page').removeClass("hidden")[0].offsetWidth;
       $('.svt234Page').removeClass("splashHide");
       PlaylistHandler._updatePlaylist();
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

