try {
    const websiteUrl = 'http://localhost:3000/';

    setIcon(true);

    chrome.tabs.onActivated.addListener((tab) => {
        chrome.tabs.get(tab.tabId, (data) => setIcon(!isLoggedUrl(data.url)));
    })

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        setIcon(!isLoggedUrl(tab.url))
    })

    chrome.action.onClicked.addListener(function (tab) {
        chrome.tabs.query({
            active: true,
            lastFocusedWindow: true
        }, function (tabs) {
            const tab = tabs[0];

            if (isLoggedUrl(tab.url)) {
                chrome.scripting.executeScript({
                    target: {tabId: tab.id},
                    function: getCookies
                }, (data) => {
                    const cookies = data[0].result.match(/(apiKey=.*?;)|(auth=.*?;)/gm).join(' ');

                    if (cookies.length === 2) {
                        chrome.tabs.create({url: `${websiteUrl}setCookie?cookie=${encodeURIComponent(cookies)}`})
                    }
                })
            }
        });
    });
} catch (e) {
    console.error(e)
}

function getCookies() {
    return document.cookie;
}

function isLoggedUrl(url) {
    return url.startsWith('https://vrchat.com/home') && !url.startsWith('https://vrchat.com/home/login')
}

function setIcon(gray = false) {
    if (gray) {
        chrome.action.setIcon({
            path: 'images/icon32-gray.png'
        })
    } else {
        chrome.action.setIcon({
            path: 'images/icon32.png'
        })
    }
}