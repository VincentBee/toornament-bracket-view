'use strict';

document.addEventListener('DOMContentLoaded', function () {
    var bracketElement = document.getElementById('bracket'),
        matchTemplate  = null,
        stageView      = null,
        stage          = null;

    var tournamentId = getQueryParameterByName('tournamentId'),
        stageNumber  = getQueryParameterByName('stageNumber'),
        apiKey       = getQueryParameterByName('apiKey'),
        clientId     = getQueryParameterByName('clientId'),
        clientSecret = getQueryParameterByName('clientSecret');

    var toornamentApi = new Toornament({
        apiKey: apiKey,
        clientId: clientId,
        clientSecret: clientSecret
    });

    get('views/match.html', function (template) {
        matchTemplate = template;
        attemptToBuildBracket();
    });

    toornamentApi.callApi('get_stage', {tournamentId: tournamentId, stageNumber: stageNumber}, function (data) {
        console.log('get_stage:', data);
        stage = data;
        attemptToBuildBracket();
    });
    toornamentApi.callApi('get_stage_view', {tournamentId: tournamentId, stageNumber: stageNumber}, function (data) {
        console.log('get_stage_view:', data);
        stageView = data;
        attemptToBuildBracket();
    });
    toornamentApi.run();

    var attemptToBuildBracket = function() {
        if (matchTemplate === null || stage === null || stageView === null) {
            return;
        }
        var bracket = walkBracket(stageView.nodes, stage.size);

        var bracketContent = '<div class="swiper-wrapper">';
        for (var roundId in bracket) {
            bracketContent += '<div class="swiper-slide round">';
            for (var matchId in bracket[roundId]) {
                var node = bracket[roundId][matchId];
                if (node === null) {
                    bracketContent += '<div class="match-container"></div>';
                    continue;
                }

                var match     = node.match,
                    opponent1 = match.opponents[0],
                    opponent2 = match.opponents[1];

                bracketContent += '<div class="match-container">';

                bracketContent += Mustache.render(matchTemplate, {
                    'opponent1_name': getParticipantName(opponent1),
                    'opponent2_name': getParticipantName(opponent2),
                    'opponent1_result': getOpponentResult(opponent1),
                    'opponent2_result': getOpponentResult(opponent2),
                    'opponent1_score': getOpponentScore(opponent1),
                    'opponent2_score': getOpponentScore(opponent2),
                    'opponent_looser': getMatchLooserName(match),
                    'match_name': getMatchName(match, stage.size),
                    'connector_top': node.sources[0].type==='winner',
                    'connector_bot': node.sources[1].type==='winner'
                });

                bracketContent += '</div>';
            }
            bracketContent += '</div>';
        }
        bracketContent += '</div>';
        bracketElement.innerHTML = bracketContent;

        var swiper = new Swiper('#bracket', {
            slidesPerView: 'auto',
            centeredSlides: true
        });
    }
});
