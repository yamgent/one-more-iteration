function getCurrentTabUrl(callback) {
    var queryInfo = {
        active: true,
        currentWindow: true
    }

    chrome.tabs.query(queryInfo, function(tabs) {
        // since we query for active, there can only be
        // one exact tab for that
        var tab = tabs[0];
        var url = tab.url;

        console.assert(typeof url == 'string', 'tab.url should be a string');
        callback(url);
    });
}

function getCanIHasReviewUrl(tabUrl, callback, errorCallback) {
    var githubUrl = 'https://github.com/';
    var canIHasReviewUrl = 'https://canihasreview.pyokagan.com/';

    if (!tabUrl.startsWith(githubUrl)) {
        errorCallback('This extension only works when you are on GitHub.');
        return;
    }

    if (!tabUrl.includes("/pull/")) {
        errorCallback('Please open a PR on your active tab to show the corresponding CanIHasReview.');
        return;
    }

    callback(tabUrl.replace(githubUrl, canIHasReviewUrl));
}

function showError(errorMessage) {
    document.getElementById('error-message').textContent = errorMessage;
}

function loadExternalPage(url) {
    var externalWebPageFrame = document.getElementById('external-web-page');
    externalWebPageFrame.setAttribute('src', url);
    externalWebPageFrame.setAttribute('width', 600);
    externalWebPageFrame.setAttribute('height', 400);
}

document.addEventListener('DOMContentLoaded', function() {
    getCurrentTabUrl(function(tabUrl) {
        getCanIHasReviewUrl(tabUrl, function(canIHasReviewUrl) {
            showError('Loading page ' + canIHasReviewUrl + '...');
            loadExternalPage(canIHasReviewUrl);
        }, function(errorMessage) {
            showError(errorMessage);
        });
    });
});
