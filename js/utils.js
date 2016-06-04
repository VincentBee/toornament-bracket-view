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

    return '-';
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
 * @returns String
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

function walkBracket(nodes, size, bracket, source, depth)
{
    bracket = (typeof bracket !== 'undefined')? bracket : [];
    source  = (typeof source !== 'undefined')? source : 'root';
    depth   = (typeof depth !== 'undefined')? depth : getBinaryTreeMaxDepth(size);
    console.log(depth);

    if (depth <= 0) {
        return bracket;
    }

    if (typeof bracket[depth] === 'undefined') {
        bracket[depth] = [];
    }

    if (source === 'empty') {
        bracket[depth].push(null);
        bracket = walkBracket(nodes, size, bracket, 'empty', depth-1);
        bracket = walkBracket(nodes, size, bracket, 'empty', depth-1);
    }

    for (var i=0; i<nodes.length; i++) {
        var node = nodes[i];

        if ((source == 'root' && node.is_root) || source === node.id) {
            bracket[depth].push(node);

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