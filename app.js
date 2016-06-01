'use strict';

document.addEventListener('DOMContentLoaded', function () {
    var swiper = new Swiper('.swiper-container', {
        slidesPerView: 'auto',
        centeredSlides: true
    });

    var tournamentId = getQueryParameterByName('tournamentId');
    var stageNumber  = getQueryParameterByName('stageNumber');
    var apiKey       = getQueryParameterByName('apiKey');
    var clientId     = getQueryParameterByName('clientId');
    var clientSecret = getQueryParameterByName('clientSecret');

    var toornamentApi = new Toornament({
        apiKey: apiKey,
        clientId: clientId,
        clientSecret: clientSecret
    });

    toornamentApi.callApi('stage_view', {
        tournamentId: tournamentId,
        stageNumber: stageNumber
    });
    toornamentApi.run();

    get('views/match.html', function (template) {
        var matchHTML = Mustache.render(template, {
            'opponent1_name': 'Participant 1',
            'opponent2_name': 'Participant 2',
            'match_name': 'Match of the year'
        });
        var matches = document.getElementsByClassName('match-container');
        for (var j=0; j<matches.length; j++) {
            matches[j].innerHTML = matchHTML;
        }
    });
});

function getQueryParameterByName(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function get(url, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState != 4 || httpRequest.status != 200) return;
        callback(httpRequest.responseText);
    };
    httpRequest.open('GET', url);
    httpRequest.send();
}
