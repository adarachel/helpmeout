chrome.action.onClicked.addListener((tab) => {
    chrome.windows.create({
        url: 'popup.html',
        type: 'popup',
        width: 300,
        height: 200
    });
});