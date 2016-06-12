'use strict';

document.addEventListener('DOMContentLoaded', function () {
    var bracketElement  = document.getElementById('bracket'),
        matchTemplate   = null,
        roundTemplate   = null,
        bracketTemplate = null,
        stageView       = null,
        stage           = null;

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


    var attemptToBuildBracket = function() {
        if (matchTemplate === null || roundTemplate === null || bracketTemplate === null || stage === null || stageView === null) {
            return;
        }

        var rounds = walkBracket(stageView.nodes, stage.size);

        bracketElement.innerHTML = Mustache.render(bracketTemplate, {
            'rounds': rounds,
            'round_content': function () {
                return Mustache.render(roundTemplate, {
                    'round_id': this.roundId,
                    'matches': this.matches,
                    'match_content': function () {
                        if (!this.hasOwnProperty('match')) {
                            return;
                        }

                        var opponent1 = this.match.opponents[0],
                            opponent2 = this.match.opponents[1];

                        return Mustache.render(matchTemplate, {
                            'opponent1_name': getParticipantName(opponent1),
                            'opponent2_name': getParticipantName(opponent2),
                            'opponent1_result': getOpponentResult(opponent1),
                            'opponent2_result': getOpponentResult(opponent2),
                            'opponent1_score': getOpponentScore(opponent1),
                            'opponent2_score': getOpponentScore(opponent2),
                            'opponent_looser': getMatchLooserName(this.match),
                            'match_name': getMatchName(this.match, stage.size),
                            // 'connector_top': node.sources[0].type==='winner',
                            // 'connector_bot': node.sources[1].type==='winner'
                        });
                    }
                });
            }
        });

        var bracketSwiper = new Swiper('#bracket', {
            wrapperClass: 'bracket-wrapper',
            slideClass: 'bracket-slide',
            slidePrevClass: 'bracket-prev',
            slideActiveClass: 'bracket-active',
            slideNextClass: 'bracket-next',
            slidesPerView: 'auto'
        });

        var roundSwipers = [];
        rounds.forEach(function (round, index, rounds) {
            roundSwipers[index] = new Swiper('#round-'+round.roundId, {
                direction: 'vertical',
                wrapperClass: 'round-wrapper',
                slideClass: 'round-slide',
                slidePrevClass: 'round-prev',
                slideActiveClass: 'round-active',
                slideNextClass: 'round-next',
                slidesPerView: 'auto',
                controlBy: 'container',
                observer: true,
                observeParents: true
            });
        });
        roundSwipers.forEach(function(swiper, index, swipers) {
            var controlledSwipers = [];
            if (index>0) {
                controlledSwipers.push(swipers[index-1]);
            }
            if (index<swipers.length-1) {
                controlledSwipers.push(swipers[index+1]);
            }
            // for (var i=0; i<swipers.length; i++) {
            //     if (i === index) {
            //         continue;
            //     }
            //     controlledSwipers.push(swipers[i]);
            // }
            swiper.params.control = controlledSwipers;
            console.log(controlledSwipers);
        });

        // roundSwipers[0].params.control = roundSwipers[1];
        // roundSwipers[1].params.control = [roundSwipers[0], roundSwipers[2]];
        //
        // roundSwipers[2].params.control = ;
    };

    var showError = function (code, data) {
        switch (code) {
            case 401:
                alert('Authentication failed');
                break;
            case 403:
                alert('You don\'t have access to this tournament');
                break;
            case 404:
                alert('Tournament or Stage not found');
                break;
        }
    };

    get('views/match.html', function (template) {
        matchTemplate = template;
        attemptToBuildBracket();
    });
    get('views/round.html', function (template) {
        roundTemplate = template;
        attemptToBuildBracket();
    });
    get('views/bracket.html', function (template) {
        bracketTemplate = template;
        attemptToBuildBracket();
    });

    toornamentApi.callApi('get_stage', {tournamentId: tournamentId, stageNumber: stageNumber}, function (data) {
        console.log('get_stage:', data);
        stage = data;
        attemptToBuildBracket();
    }, showError);
    toornamentApi.callApi('get_stage_view', {tournamentId: tournamentId, stageNumber: stageNumber}, function (data) {
        console.log('get_stage_view:', data);
        stageView = data;
        attemptToBuildBracket();
    }, showError);

    toornamentApi.run();
});
