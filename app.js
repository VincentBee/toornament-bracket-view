'use strict';

document.addEventListener('DOMContentLoaded', function () {
    var height = 90,
        bracket = document.getElementById('bracket'),
        body = document.body,
        html = document.documentElement,
        screenHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

    var updateMatchHeight = function(swiper) {
        var progress = swiper.progress * (swiper.slides.length-1);
        for (var i=0; i<swiper.slides.length; i++) {
            var matches  = swiper.slides[i].getElementsByClassName('match');
            for (var j=0; j<matches.length; j++) {
                matches[j].style.height = (height * Math.pow(2, i-progress)) + "px";
            }
        }
    };

    var updateTop = function(touch) {
        console.log(screenHeight, bracket.offsetHeight);
        // var top = 0;
        // if (bracket.offsetHeight < screenHeight) {
            var top = screenHeight/2 - bracket.offsetHeight/2;
        // } else {
            // top = (touch.clientY * bracket.offsetHeight / screenHeight) - touch.clientY;
            // if (top > 0) {
            //     top = 0;
            // }
            // if (top < -screenHeight) {
            //     top = -screenHeight;
            // }
        // }

        bracket.style.top = top + 'px';
    };

    var swiper = new Swiper('.swiper-container', {
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 20,

        onSliderMove: function (swiper, event) {
            // updateTop(event.touches[0]);
        },
        onProgress: function(swiper) {
            updateMatchHeight(swiper);
        }
    });
});
