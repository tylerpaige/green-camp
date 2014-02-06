(function($){ 
    $.fn.extend({
        powerPPT: function(options) {
            var defaults = {
                controls: false,
                loader: 'assets/img/loader-white.gif',
                origin: false,
                slide: '.slide'
            }
            
            var options = $.extend(defaults, options);
            
            return this.each(function() {
                var o = options,
                    transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd',
                    index,
                    cur,
                    save = null,
                    slide = o.slide,
                    slides = $(this).find(slide),
                    slideClass = slide.substr(1),
                    loader = '<div class="loader"><img src="'+o.loader+'" /><br/>img loading</div>';
                    
                if(o.origin == false){ cur = $(this).find(slide).eq(0); }
                else { cur = $(this).find(o.origin); }
                $(cur).addClass('visible');
                
                if(o.controls==true){
                    var controlsMarkup = '<div id="controls"><div class="up">↑</div><div class="left">←</div><div class="right">→</div><div class="down">↓</div></div>';
                    $(this).prepend(controlsMarkup);
                    var controls = $('#controls'),
                        conUp = $(controls).children('.up'),
                        conRight = $(controls).children('.right'),
                        conDown = $(controls).children('.down'),
                        conLeft = $(controls).children('.left'),
                        manageControls = function(slide) {
                            if(slide.parent().hasClass(slideClass) == false){ $(conUp).fadeOut(); }
                            else if($(conUp).is(':hidden')) { $(conUp).fadeIn(); }
                            
                            if((slide.next().hasClass(slideClass) == false) && (slide.hasClass('jump') == false)){ $(conRight).fadeOut(); }
                            else if($(conRight).is(':hidden')) { $(conRight).fadeIn(); }
                            
                            if(slide.prev().hasClass(slideClass) == false){ $(conLeft).fadeOut(); }
                            else if($(conLeft).is(':hidden')) { $(conLeft).fadeIn(); }
                            
                            if(slide.children('.'+slideClass).length <= 0){ $(conDown).fadeOut(); }
                            else if($(conDown).is(':hidden')) { $(conDown).fadeIn(); }
                        };
                } else {
                    var manageControls = function(){ return false; };
                }
                
                $.each(slides, function() {
                     var slide = $(this).not('.text').children('.content'),
                         img = $(slide).children('img');
                     if(img.length > 0){
                         var url = $(img).attr('src');
                         $(img).hide();
                         $(slide).prepend(loader);
                         $(img).one('load', function(){
                             $(slide).css("background-image", "url('"+url+"')").children('.loader').remove();
                             $(img).remove();
                         });
                     }
                });
                
                 keypress.combo('right', function() {
                     index = $(cur).siblings(slide).addBack().index(cur);
                     if(index < $(cur).siblings(slide).length){
                         target = index+1; 
                         cur = $(cur).siblings(slide).addBack().eq(target);    		
                         $(cur).addClass('slideLeft recent').one(transitionEnd, function(){ 
                             $(this).addClass('visible').removeClass('slideLeft recent').prevAll().removeClass('visible slideLeft slideRight recent');
                         }); 
                         $('.recent').not(cur).removeClass('recent');
                     } else if($(cur).hasClass('jump')) {
                         target = cur.attr('data-target');
                         cur = $(target);
                         $(cur).addClass('slideLeft recent').one(transitionEnd, function(){ 
                             $('.visible').not(cur).removeClass('visible slideLeft slideRight recent');
                             $(this).addClass('visible').removeClass('slideLeft recent');
                         }); 
                         $('.recent').not(cur).removeClass('recent');
                     }
                     manageControls($(cur));
                 });
                 keypress.combo('left', function() {
                     index = $(cur).siblings(slide).addBack().index(cur);
                     if(index > 0){
                         target = index-1;
                         cur = $(cur).siblings(slide).addBack().eq(target);
                         
                         $(cur).addClass('slideRight recent').one(transitionEnd, function() {
                            $(this).addClass('visible').removeClass('slideRight recent').nextAll().removeClass('visible slideRight recent');
                         });
                         $('.recent').not(cur).removeClass('recent'); //Only most recent advance should be called "Recent"
                     }
                     manageControls($(cur));
                 });
                 keypress.combo('down', function() {
                     if($(cur).children(slide).length > 0){
                         cur = $(cur).children(slide).eq(0);
                         $(cur).addClass('slideUp').one(transitionEnd, function() {
                             $(this).addClass('visible').removeClass('slideUp').parent('.visible').removeClass('visible');
                         });
                     }
                     manageControls($(cur));
                 });
                 keypress.combo('up', function() {
                     if($(cur).parent().hasClass(slideClass)){ // only ascend if the target is a slide, not the container
                         index = cur;
                         cur = cur.parent();
                         index.siblings('.content').parent().addBack().addClass('visible');
                         index.addClass('slideOut').one(transitionEnd, function() {
                             $(this).removeClass('visible slideOut').siblings().removeClass('slideOut recent visible');
                         });
                         manageControls(cur);
                     }
                    
                 });
                 keypress.combo('esc', function() {
                     if(cur.hasClass('esc')){ //if this slide has a target for an escape
                         save = cur, //save the current slide for reference
                         target = save.attr('data-target'); //set the target
                         cur = $(target); //make the target the current slide
                         cur.addClass('visible');
                         save.addClass('slideOut').one(transitionEnd, function() {
                             $(this).removeClass('visible slideOut recent');
                         });
                         manageControls(cur);
                     } else if(save != null){ //if slide doesn't have an escape, but does have a save state (I.E. it was the target of an escape)
                         target = save;
                         save = null;
                         target.addClass('visible');
                         cur.addClass('slideOut').one(transitionEnd, function() {
                             $(this).removeClass('visible slideOut recent');
                         });
                         cur = target;
                         manageControls(cur);
                     }
                 });
                 
                 manageControls($(cur));
                 
            });
        }
    });
})(jQuery);