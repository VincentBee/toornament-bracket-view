'use strict';

document.addEventListener('DOMContentLoaded', function () {
    var height = 118,
        bracket = document.getElementById('bracket'),
        body = document.body,
        html = document.documentElement,
        screenHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

    var updateMatchHeight = function(swiper) {
        var progress = swiper.progress * (swiper.slides.length-1);
        for (var i=0; i<swiper.slides.length; i++) {
            var matches  = swiper.slides[i].getElementsByClassName('match-container');
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
        spaceBetween: 10,

        onSliderMove: function (swiper, event) {
            // updateTop(event.touches[0]);
        },
        onProgress: function(swiper) {
            updateMatchHeight(swiper);
        }
    });

    get('views/match.html', function (template) {
        var matchHTML = Mustache.render(template, {
            'opponent1_name': 'Participant 1',
            'opponent2_name': 'Participant 2',
            'match_name': 'Match of the year'
        });
        var matches = document.getElementsByClassName('match-container')
        for (var j=0; j<matches.length; j++) {
            matches[j].innerHTML = matchHTML;
        }
    });
});

function get(url, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState != 4 || httpRequest.status != 200) return;
        callback(httpRequest.responseText);
    };
    httpRequest.open('GET', url);
    httpRequest.send();
}
