'use strict';

document.addEventListener('DOMContentLoaded', function () {
    var swiper = new Swiper('.swiper-container', {
        slidesPerView: 'auto',
        centeredSlides: true
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
