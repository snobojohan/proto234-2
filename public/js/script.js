
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

    console.log('item',theItem);

    theItem.fitVids({ customSelector: "iframe[src^='http://www.svtplay.se']"});

}

$(document).ready(function() {



  DayChooser.init();

  //INIT RECOMMEND LIST
  PlaylistHandler.init($("#epg"));
  //RecommendHandler.init($('#recommend-list'));
  VideoCarouselHandler.init($('#carousel-example-generic'));
  setNextText();

  //SPLASH
    SplashHandler.init($('.svt234-Splash'));
    if (window.location.search.substring(1).indexOf("video") > -1) {
      SplashHandler.startVideo();
    } else if (window.location.search.substring(1).indexOf("page") > -1) {
      SplashHandler.startPage();
    } else {
      SplashHandler.show();
    }

    //carousel listeners
    $('#carousel-example-generic').on('slide.bs.carousel', function() {
        $('.svt234-More').addClass('hideview');
    }).on('slid.bs.carousel', function () {
        VideoCarouselHandler.stopVideo();

        setNextText();

        PlaylistHandler.setActiveItem(VideoCarouselHandler.getActiveIndex());
      	// wait
      	setTimeout(function() {

          playVideo( $(".item.active") );

      	}, 100);
    });

    function setNextText() {
      var $next = $(".item.active").next(),
          $prev = $(".item.active").prev();
      if ($next.length > 0) {
        var title = $next.find(".svt234-VideoInfo").data("title"),
            episode = $next.find(".svt234-VideoInfo").data("episode"),
            $nextbutton = $(".svt234-VideoControlls .video-next");
        $nextbutton.find('.next-title').text(title);
        $nextbutton.find('.next-episode').text(episode);
      }

      if ($prev.length > 0) {
        var title = $prev.find(".svt234-VideoInfo").data("title"),
            episode = $prev.find(".svt234-VideoInfo").data("episode"),
            $prevbutton = $(".svt234-VideoControlls .video-prev");
        $prevbutton.find('.next-title').text(title);
        $prevbutton.find('.next-episode').text(episode);
      }

    }

});

var DayChooser = {
  init: function() {
    this.$list = $("#jsShowDay");
    this.bindEvents();
  },
  bindEvents: function() {
    var self = this;
    var $container = $(".svt234InfoContainer");
    var bgimg;
    var $parent;

    this.$list.find("a").on('click', function(e) {

      self.$list.find(".active").removeClass("active");

      $parent = $(this).parent("li");
      console.log( $parent );

      $parent.addClass("active");

      console.log(  $container.css("background-image") );

      bgimg =  $container.css("background-image")

      if($(this).text() != "Idag"){
        $('#epg').addClass("epg--otherday");
        $container.css("background-image", "none");
        $('.main-progress').addClass('hidden');
      } else {
        $('#epg').removeClass("epg--otherday");
        $container.css("background-image", "url(" + bgimg + ")");
        $('.main-progress').removeClass('hidden');
      }

    });
  }
}

var SplashHandler = {

    TRANSITION_END : "webkitTransitionEnd transitionend oTransitionEnd otransitionend",

    init: function($container) {
      this.$container = $container;
      this.$progressbar = $container.find('.progress');
      this.$progressbar.find('.progress-bar').css('width', '0');
      if (window.location.search.substring(1).indexOf("autostart") > -1) {
          console.log("Autostart is on");
          this.autoStart = true;
      }
    },

    show: function() {
      var self = this;
      this.$container.removeClass("splashHide");
      self.startLoader();
    },
    hide: function() {
      var self = this;
      this.$container.one(this.TRANSITION_END, function(e) {
        self.startVideo();
      }).addClass("splashHide");
    },
    startVideo: function() {
      //$('.svt234Page').removeClass('splashHide hidden')[0].offsetWidth;
      $('.svt234-MainVideo').removeClass('splashHide')[0].offsetWidth;
      PlaylistHandler._updatePlaylist();
      if (this.autoStart)
        VideoCarouselHandler.startVideo();
    },
    startPage: function() {
      $('.svt234-MainVideo').addClass('hidden');
      $('.svt234Page').removeClass('splashHide hidden')[0].offsetWidth;
      //$('.svt234-MainVideo').removeClass('splashHide')[0].offsetWidth;
      PlaylistHandler._updatePlaylist();
      PlaylistHandler.centerScroller(PlaylistHandler.getActiveItem());
    },
    startLoader: function() {
      var self = this;
      this.$progressbar.find('.progress-bar').one(this.TRANSITION_END, function(e) {
        e.stopPropagation();
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
        PlaylistHandler.centerScroller(self.$container.find('.epg__item').closestToOffset({top: 0, left: self.$container.width()/2}).prev());
      }).on('click', '.jsScrollRight', function(e) {
         PlaylistHandler.centerScroller(self.$container.find('.epg__item').closestToOffset({top: 0, left: self.$container.width()/2}).next());
      });

      this.$container.on('click', '.epg__item .fixed-square-xs', function(e) {
        //self.setActiveItem($(this).data("to"));
        var $obj = $(this),
            to = $('.epg__item.hover_click')[0] === $obj[0] ? 0 : 500;

        //var $avtiveItem = self.$container.find('.epg__item:eq(' + $obj.data("to") + ')');//self.getActiveItem();
        VideoCarouselHandler.setActiveIndex($obj.closest('.epg__item').data("to"));
        $('.svt234Page').addClass("splashHide hidden");
        VideoCarouselHandler.showView();

        //console.log(($('.epg__item.hover_click')[0] == $obj[0]), ($('.epg__item.hover_click')[0] === $obj[0]), $obj[0], $('.epg__item.hover_click')[0])
        //$('.epg__item.hover_click').removeClass('hover_click');
        //$('.svt234-PlaylistInfo').data("index", $obj.data("to"));
        //self.showInfo($obj);
        //self.setBigPoster($obj);
        //self.centerScroller($obj);

        //$obj.addClass('hover_click');

        /*if (e.target.className == "fixed-square-xs") {

          setTimeout(function() {
            //$('.epg__item.hover_click').removeClass('hover_click');
            $('.svt234-PlaylistInfo .watch').trigger('click');
          }, to);
        }*/
        e.preventDefault();
      }).find('.epg__item').hover( function() {
          $(this).css('padding-bottom', ($(this).find('.title-info').height() + 32) + "px");
          self.setBigPoster($(this));
      }, function() {
        $(this).css('padding-bottom', '');
        self.setBigPoster(self.getActiveItem());
      });


      /*$('.svt234-PlaylistInfo').on('click', '.watch', function() {

        var $avtiveItem = self.$container.find('.epg__item:eq(' + $('.svt234-PlaylistInfo').data("index") + ')');//self.getActiveItem();
        VideoCarouselHandler.setActiveIndex($avtiveItem.data("to"));
        $('.svt234Page').addClass("splashHide hidden");
        VideoCarouselHandler.showView();

      }).on('click', '.close-view', this.hideInfo);*/

      /*$(window).on("resize", function() {
        var activeItem = self.getActiveItem();
        if (activeItem) {
          self.centerScroller(activeItem);
        }
      });*/
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
    setActiveItem: function(index) {
      this.$container.find('.epg__item').removeClass('active').find('.progress').addClass('hidden');
      this.centerScroller(this.$container.find('.epg__item:eq(' + index + ')').addClass('active'));
      this.setBigPoster(this.getActiveItem());
      this._setProgress();
      this.getActiveItem().find('.progress').removeClass('hidden');
      //this._calculateProgress();

    },
    setBigPoster: function($item) {
      $(".svt234InfoContainer").css("background-image", "url('/img/alts/large/" + $item.data("uniqueid") + ".jpg')");
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
    centerScroller: function($item) {
      if($("#epg").length ){
        var epg = $("#epg"),
            centerScrollPoint = ( epg.width() / 2 ) - ( $item.width() / 2 );

        //$(".now-playing").addClass('playhide')[0].offsetWidth;

        epg.scrollTo( $item , 250, {axis:'x',offset: - centerScrollPoint, onAfter: function() {
          //$(".now-playing").css('left', $item.offset().left + ($item.width() / 2 - $(".now-playing").width() / 2) + "px").removeClass('playhide');
        }} );
      }

    },
    showInfo: function($item) {
      var title = $item.find('.media-heading').text(),
          container = $('.svt234-PlaylistInfo');
      container.find('h3').text(title);
      container.removeClass('splashHide');
    },
    hideInfo: function() {
      $('.epg__item.hover_click').removeClass('hover_click');
      $('.svt234-PlaylistInfo').addClass('splashHide');
    },

    _setProgress: function() {
      var active = this.getActiveItem();
      $('.epg__item .info').text('');
      active.find('.info').text('nu');
      active.next().find('.info').text('nästa program')[0].offsetWidth;
    },
    _updatePlaylist: function() {
      //if (this.width < 1)
      this._calculateWidth();
      this._calculateProgress();

      this.$container.find('.epg__list').width(this.width);
      this.centerScroller(this.getActiveItem());
      this.setBigPoster(this.getActiveItem());
      this._setProgress();
    },
    _updateIndex: function(startIndex) {
        this.$container.find('.epg__item:gt(' + startIndex + ')').each( function() {
            var obj = $(this);
            obj.attr("data-slide-to", parseInt(obj.attr("data-slide-to")) + 1);
        });
    },
    _calculateProgress: function() {
      var  beforeActiveWidth = 0;
      this.$container.find('.epg__item:lt(' + this.$container.find('.epg__item.active').index() + ')').each(function() {
          beforeActiveWidth += $(this).outerWidth();
          console.log($(this).outerWidth(), $(this).width());
      });
      this.beforeActiveWidth = beforeActiveWidth;
      this.$container.find('.main-progress .progress-bar').width(this.beforeActiveWidth);
    },
    _calculateWidth: function() {
      //SET WIDTH
        var width = 0;
        this.$container.find('.epg__item').each(function() {
          //console.log('$(this).outerWidth()', $(this).outerWidth());
          width += $(this).outerWidth();

        });
        this.width = width < 1 ? 10000 : width;

    },
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
      $(".svt234-Close .video-close").on("click", function() {
        self.closeVideo();
        return false;
      });

        $(".jsPlayVideo").on("click", function(e) {
          playVideo( $(this) );
          e.preventDefault();
        });

        this.$container.on('click', '.se-more', function() {
          $('.svt234-More').toggleClass('hideview');
        });

        $('.svt234-More').on('click', '.close-view', function() {
          $('.svt234-More').toggleClass('hideview');
        });

    },
    showView: function() {
      $('.svt234-MainVideo').addClass('splashHide').removeClass('hidden')[0].offsetWidth;
      $('.svt234-MainVideo').removeClass('splashHide');
      playVideo(this.$container.find('.item.active'));
    },
    startVideo: function(index) {

      if (!index)
        index = this.getActiveIndex();

      this.$container.carousel(index);

      playVideo(this.$container.find('.item.active'));
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
    setActiveIndex: function(index) {
      this.stopVideo();
      this.$container.carousel(index);
    },
    getActiveIndex: function() {
      return this.$container.find('.item.active').data("index");
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

