/**
 * Toornament client Api
 *
 * @param options
 *
 * @constructor
 */
function Toornament(options) {
    this.host           = options.host || 'https://api.toornament.com';
    this.version        = options.version || 'v1';

    this.apiKey         = options.apiKey || null;
    this.clientId       = options.clientId || null;
    this.clientSecret   = options.clientSecret || null;
    this.accessToken    = null;

    this.xhr            = new XMLHttpRequest();
    this.queue          = [];
}

/**
 * Build the target url
 *
 * @param targetResource String
 * @param attributes     Object
 *
 * @returns String|null
 */
Toornament.prototype.getTargetUrl = function(targetResource, attributes) {
    switch (targetResource) {
        case 'get_stage':
            return this.host + '/' + this.version + '/tournaments/'+attributes.tournamentId+'/stages/'+attributes.stageNumber;
        case 'get_stage_view':
            return this.host + '/' + this.version + '/tournaments/'+attributes.tournamentId+'/stages/'+attributes.stageNumber+'/view';
    }

    return null; // todo: throw exception
};

Toornament.prototype.getTargetMethod = function(targetResource) {
    switch (targetResource) {
        case 'get_stage':
        case 'get_stage_view':
            return 'GET';
    }

    return null; // todo: throw exception
};

Toornament.prototype.isSecured = function(targetResource) {
    switch (targetResource) {
        case 'get_stage':
        case 'get_stage_view':
            return true;
    }

    return null; // todo: throw exception
};

Toornament.prototype.getHeaders = function(targetResource) {
    var headers = {
        'X-Api-Key': this.apiKey,
        'Content-Type': 'application/json'
    };

    switch (targetResource) {
        case 'get_stage':
        case 'get_stage_view':
            headers.Authorization = 'Bearer ' + this.accessToken;
    }

    return headers;
};

Toornament.prototype.generateAccessToken = function(previousRequest) {
    var toornament = this;
    this.queue.unshift(previousRequest);
    this.queue.unshift({
        requireAuthentication: false,
        method: 'GET',
        targetUrl: this.host + '/oauth/v2/token?grant_type=client_credentials&client_id=' + this.clientId + '&client_secret=' + this.clientSecret,
        headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': this.apiKey
        },
        successHandler: function (data) {
            toornament.accessToken = data.access_token;
            for (var i in toornament.queue) {
                if (typeof toornament.queue[i].headers.Authorization === 'undefined') {
                    continue;
                }
                toornament.queue[i].headers.Authorization = 'Bearer ' + data.access_token;
            }
        },
        errorHandler: null
    });

    this.run();
};

Toornament.prototype.callApi = function(targetResource, attributes, successHandler, errorHandler) {
    this.queue.push({
        requireAuthentication:  this.isSecured(targetResource),
        method:                 this.getTargetMethod(targetResource),
        targetUrl:              this.getTargetUrl(targetResource, attributes),
        headers:                this.getHeaders(targetResource),
        successHandler:         successHandler || null,
        errorHandler:           errorHandler || null
    });
};

Toornament.prototype.sendRequest = function(request) {
    var toornament = this,
        xhr = this.xhr;

    if (request.requireAuthentication && toornament.accessToken === null) {
        return this.generateAccessToken(request);
    }

    xhr.open('GET', request.targetUrl, true);
    for (var index in request.headers) {
        xhr.setRequestHeader(index, request.headers[index]);
    }

    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) {
            return;
        }

        if (request.successHandler !== null && xhr.status == 200) {
            request.successHandler(JSON.parse(xhr.responseText));
            toornament.run();

        } else if (request.errorHandler !== null) {
            request.errorHandler(xhr.status, xhr.responseText);
        }
    };

    xhr.send();
};

Toornament.prototype.run = function() {
    var request = this.queue.shift();

    if (typeof request === 'undefined') {
        return;
    }

    this.sendRequest(request);
};