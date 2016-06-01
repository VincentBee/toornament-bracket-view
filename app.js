'use strict';

document.addEventListener('DOMContentLoaded', function () {
    var bracketElement = document.getElementById('bracket');

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

    toornamentApi.callApi('stage_view', {tournamentId: tournamentId, stageNumber: stageNumber}, function (data) {
        var bracket = [];
        for (var i=0; i<data.nodes.length; i++) {
            var node    = data.nodes[i],
                nodeId  = node.id.split('.'),
                roundId = nodeId[2],
                matchId = nodeId[3];

            if (typeof bracket[roundId] === 'undefined') {
                bracket[roundId] = [];
            }

            if (typeof bracket[roundId][matchId] === 'undefined') {
                bracket[roundId][matchId] = node.match;
            }

            for (var j=0; j<node.targets.length; j++) {
                var target = node.targets[j];
                // console.log('target', target.id);
            }
        }

        console.log(data);
        console.log(bracket);

        var bracketContent = '<div class="swiper-wrapper">';
        for (var roundId in bracket) {
            bracketContent += '<div class="swiper-slide round">';
            for (var matchId in bracket[roundId]) {
                bracketContent += '<div class="match-container">';
                bracketContent += '</div>';
            }
            bracketContent += '</div>';
        }
        bracketContent += '</div>';
        console.log(bracketElement);
        console.log(bracketContent);
        bracketElement.innerHTML = bracketContent;

        var swiper = new Swiper('#bracket', {
            slidesPerView: 'auto',
            centeredSlides: true
        });

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
    toornamentApi.run();
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
