console.log("Background RUNNING")

var reqs = {}
// Receive message from content script and relay to the devTools page for the
// current tab
chrome.action.onClicked.addListener(async function (tab) {
    console.log("CLICKED")
    const {id, url} = tab;
    let data
    let search = false
    if (url && url.includes("facebook.com/search") && !reqs[url]) {
        reqs[url] = true
        search = true
        data = true
    } else if (url && url.includes("facebook.com") && !reqs[url]) {
        data = true
        // murl = url.replace("www.facebook", "mbasic.facebook")
        // let res = await fetch(murl)
        // if (res.status == 200) {
        //     reqs[url] = true
        //     setTimeout(function () {
        //         delete reqs[url]
        //     }, 3000)
        //     data = await res.text()
        // }
    }
    console.log("sendResponse", data, url)
    chrome.tabs.sendMessage(id, {
        type: 'fetched',
        url: url,
        data: data,
        search
    })
});

// processing get data from mbasic.facebook
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "getDataFromMbasic") {
        let murl = request.data.replace("www.facebook", "mbasic.facebook")
        console.log(murl)
        let res = fetch(murl)
        res.then(function (data) {
            return data.text()
        }).then(function (data) {
            sendResponse(data)
        }).catch((e) => {
            sendResponse(false)
        })
        return true;
    }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    // check for a URL in the changeInfo parameter (url is only added when it is changed)
    if (changeInfo.url && (changeInfo.url.includes("facebook.com/search") || changeInfo.url.includes("/posts/"))) {
        console.log("url changed")
        const url = changeInfo.url
        let data = false
        let search = false
        let update = true
        if (url && url.includes("facebook.com/search")) {
            search = true
            data = true
        } else if (url && url.includes("/posts/")) {
            data = true
        }
        console.log("sendResponse", data, search, url)
        setTimeout(function () {
            chrome.tabs.sendMessage(tabId, {
                type: 'fetched',
                url: url,
                data: data,
                search,
                update
            })
        }, 3000)
    }
});


