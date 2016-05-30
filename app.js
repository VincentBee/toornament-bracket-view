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
    var accessToken  = null;

    getBracketView(tournamentId, stageNumber, apiKey, accessToken, onBracketViewSuccess,
        function (status, data) {
            if (401 === status) {
                getAccessToken(apiKey, clientId, clientSecret, function (data) {
                    accessToken = data.access_token;
                    getBracketView(tournamentId, stageNumber, apiKey, accessToken, onBracketViewSuccess, null)
                }, null);

            } else if (403 === status) {
                alert('Access denied.');
            }
        }
    );

    var matches = [];

    var onBracketViewSuccess = function (data) {
        console.log(data);
        switch (data.type) {
            case 'single_elimination':
                for (var i=0; i<data.nodes.length; i++) {
                    matches[data.nodes[i].x][data.nodes[i].y] = data.nodes[i].match;
                }
                break;
            default:
                alert('This stage is not a bracket.');
                break;
        }

        console.log(matches);
    };

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


var getBracketView = function(tournamentId, stageNumber, apiKey, accessToken, successHandler, errorHandler) {
    var r = new XMLHttpRequest();
    r.open('GET', 'https://api.toornament.com/v1/tournaments/' + tournamentId + '/stages/' + stageNumber + '/view', true);
    r.setRequestHeader('Content-Type', 'application/json');
    r.setRequestHeader('X-Api-Key', apiKey);
    r.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    r.onreadystatechange = function () {
        if (r.readyState !== 4) {
            return;
        }
        if (successHandler !== null && r.status == 200) {
            successHandler(JSON.parse(r.responseText))
        } else if (errorHandler !== null) {
            errorHandler(r.status, r.responseText)
        }
    };
    r.send();
};

var getAccessToken = function(apiKey, clientId, clientSecret, successHandler, errorHandler) {
    var r = new XMLHttpRequest();
    r.open('GET', 'https://api.toornament.com/oauth/v2/token?grant_type=client_credentials&client_id=' + clientId + '&client_secret=' + clientSecret, true);
    r.setRequestHeader('Content-Type', 'application/json');
    r.setRequestHeader('X-Api-Key', apiKey);
    r.onreadystatechange = function () {
        if (r.readyState !== 4) {
            return;
        }
        if (successHandler !== null && r.status == 200) {
            successHandler(JSON.parse(r.responseText))
        } else if (errorHandler !== null) {
            errorHandler(r.status, r.responseText)
        }
    };
    r.send();
};
