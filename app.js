'use strict';

document.addEventListener('DOMContentLoaded', function () {
    var height = 118,
        bracket = document.getElementById('bracket'),
        body = document.body,
        html = document.documentElement,
        screenHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

    var resetMatchClasses = function(swiper) {
        var matches = document.getElementsByClassName('match-container');
        for (var i = 0; i < matches.length; i++) {
            matches[i].classList.remove('size-small');
        }
    };

    var addMatchClasses = function(swiper) {
        var activeIndex = swiper.activeIndex;
        for (var i=0; i<activeIndex; i++) {
            var matches  = swiper.slides[i].getElementsByClassName('match-container');
            for (var j=0; j<matches.length; j++) {
                matches[j].classList.add('size-small');
            }
        }
    };

    var updateMatchHeight = function(swiper) {
        var progress = swiper.progress * (swiper.slides.length-1);
        for (var i=0; i<swiper.slides.length; i++) {
            var matches  = swiper.slides[i].getElementsByClassName('match-container');
            for (var j=0; j<matches.length; j++) {
                matches[j].style.height = (height * Math.pow(2, i-progress)) + "px";
            }
        }

        resetMatchClasses(swiper);
        addMatchClasses(swiper);
    };

    var swiper = new Swiper('.swiper-container', {
        slidesPerView: 'auto',
        centeredSlides: true,
        spaceBetween: 10,
        onInit: updateMatchHeight,
        onSlideChangeEnd: updateMatchHeight
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
