chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: { hostEquals: 'your-website.com' } // Replace with your website's URL
                })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});