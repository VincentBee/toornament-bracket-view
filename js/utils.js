/**
 * Extract a value from a query string.
 * 
 * @param name
 * @returns {*}
 */
function getQueryParameterByName(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * Load a resource through an ajax request.
 * 
 * @param url
 * @param callback
 */
function get(url, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState != 4 || httpRequest.status != 200) return;
        callback(httpRequest.responseText);
    };
    httpRequest.open('GET', url);
    httpRequest.send();
}

/**
 * @param match
 *
 * @returns {*}
 */
function getMatchName(match, stageSize)
{
    var round = match.round_number,
        lastRound = getBinaryTreeMaxDepth(stageSize),
        level = Math.pow(2, lastRound-round);

    switch (lastRound-round) {
        case 0:
            return 'Final';
        default:
            return '1/'+ level +' finals';
    }
}

/**
 * @param opponent
 *
 * @returns String
 */
function getParticipantName(opponent)
{
    if (opponent.participant !== null) {
        if (opponent.participant.name != null) {
            return opponent.participant.name;
        }
        return 'Participant #'+ opponent.participant.number;
    }

    return null;
}

/**
 * @param opponent
 *
 * @returns String
 */
function getOpponentResult(opponent)
{
    switch (opponent.result) {
        case 1:
            return 'win';
        case 2:
            return 'draw';
        case 3:
            return 'loss';
    }
}

/**
 * @param opponent
 *
 * @returns {*}
 */
function getOpponentScore(opponent)
{
    if (opponent.score !== null) {
        return opponent.score;
    }

    switch (opponent.result) {
        case 1:
            return 'W';
        case 2:
            return 'D';
        case 3:
            return 'L';
    }
}

/**
 * Return the looser opponent object of the match.
 *
 * @param match
 *
 * @returns {*}
 */
function getMatchLooserName(match)
{
    for (var i=0; i<2; i++) {
        var opponent = match.opponents[i];

        if (typeof opponent === 'undefined' || opponent === null) {
            continue;
        }

        if (opponent.result === 3) {
            return opponent.participant.name;
        }
    }

    return null;
}

/**
 * @param size
 *
 * @returns {number}
 */
function getBinaryTreeMaxDepth(size)
{
    var depth = 0;
    while (Math.pow(2, depth) < size) {
        depth++;
    }

    return depth;
}

/**
 * @param nodes   The list of node to walk
 * @param size    The size of the bracket
 * @param bracket The bracket result
 * @param source  The current node (for iteration)
 * @param depth   The depth level (for iteration)
 *
 * @returns {Array|*}
 */
function walkBracket(nodes, size, bracket, source, depth)
{
    bracket = (typeof bracket !== 'undefined')? bracket : [];
    source  = (typeof source !== 'undefined')? source : 'root';
    depth   = (typeof depth !== 'undefined')? depth : getBinaryTreeMaxDepth(size);

    if (depth <= 0) {
        return bracket;
    }

    if (typeof bracket[depth-1] === 'undefined') {
        bracket[depth-1] = {
            roundId: depth,
            matches: []
        };
    }

    if (source === 'empty') {
        bracket[depth-1].matches.push({});
        bracket = walkBracket(nodes, size, bracket, 'empty', depth-1);
        bracket = walkBracket(nodes, size, bracket, 'empty', depth-1);
    }

    for (var i=0; i<nodes.length; i++) {
        var node = nodes[i];

        if ((source == 'root' && node.is_root) || source === node.id) {
            bracket[depth-1].matches.push(node);

            for (var j=0; j<2; j++) {
                if (node.sources[j].type === 'winner') {
                    bracket = walkBracket(nodes, size, bracket, node.sources[j].id, depth-1);
                } else {
                    bracket = walkBracket(nodes, size, bracket, 'empty', depth-1);
                }
            }
            break;
        }
    }

    return bracket;
}

/**
 * @param element
 * @param cls
 * 
 * @returns {boolean}
 */
function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

/**
 * @param element
 * @param cls
 *
 * @returns {*}
 */
function getParent(element, cls) {
    if (hasClass(element, cls)) {
        return element;
    }
    if (element.tagName == "BODY") {
        return false;
    }

    return getParent(element.parentNode, cls);
}

/**
 * @param element
 *
 * @returns {{top: number, left: number}}
 */
function getPosition(element) {
    var top=0, left=0;

    while(element) {
        top += parseInt(element.offsetTop);
        left += parseInt(element.offsetLeft);
        element = element.offsetParent
    }

    return {top: top, left: left}
}
