console.log("content JS running")
var index = 0;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "fetched") {
        if (!request.data) {
            console.log("khong co data")
        } else if (request.url === window.location.href) {
            if (request.search) {
                // handle in facebook/search
                listPosts = document.querySelectorAll("div[role='feed'] > div.x1yztbdb[role = 'article']");
                for (let i = index; i < listPosts.length; i++) {
                    let a = listPosts[i].querySelectorAll("a[href*='/posts/']")[0]
                    if (a) {

                        let classNames = "span.x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x8182xy.xwrv7xz.x1kgmq87.xmgb6t1.x1h0ha7o.xg83lxy.x1nn3v0j.x1120s5i"
                        let node = makeButtonGetId(listPosts[i], classNames)

                        node.addEventListener("click", async (e) => {
                            e.stopPropagation()
                            let urlPost = a.getAttribute("href")
                            chrome.runtime.sendMessage(request.id, {
                                type: 'getDataFromMbasic',
                                data: urlPost,
                            }, function (response) {
                                if (response) {
                                    const e = document.createElement('textarea');
                                    e.innerHTML = response;
                                    response = e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
                                    let data = response.match(/id="m_story_permalink_view"(.*?)data-ft="(.*?)">/) || [];
                                    if (data[2]) {
                                        data = data[2].split(" ")
                                        data.splice(-1)
                                        data = JSON.parse(data.join(' ').slice(0, -1))
                                        let strAlert = `ID: ${data.content_owner_id_new}_${data.top_level_post_id}\nAuthor ID: ${data.content_owner_id_new}\nPOST ID: ${data.top_level_post_id}\nPage ID: ${data.page_id}`
                                        navigator.clipboard.writeText(strAlert);
                                        alert(strAlert)
                                    }
                                }
                            })
                        });
                    }


                    // listPosts.forEach(async function (post) {
                    //     let a = post.querySelectorAll("a[href*='/posts/']")[0]
                    //     if (a) {
                    //         let node = document.createElement("button");
                    //         let textnode = document.createTextNode("Get Id");
                    //         node.appendChild(textnode);
                    //         node.setAttribute("style", "background-color: #4CAF50; border: none; color: white; border-radius: 8px; margin-top: 5px; display: inline-block; cursor: pointer;");
                    //         let a = post.querySelectorAll("span.x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x8182xy.xwrv7xz.x1kgmq87.xmgb6t1.x1h0ha7o.xg83lxy.x1nn3v0j.x1120s5i")[0]
                    //         if(a) {
                    //             a.appendChild(node);
                    //         }
                    //         // let urlPost = a.getAttribute("href");
                    //         // let body = getDataFromMbasic(urlPost)
                    //         // let data = body.match(/id="m_story_permalink_view"(.*?)data-ft="(.*?)">/) || [];
                    //         // sendResponse({});
                    //         // return false
                    //     }
                    // })
                }
                index = listPosts.length;
            } else {
                // handle in detail post
                let body = request.data
                const e = document.createElement('textarea');
                e.innerHTML = body;
                body = e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
                let data = body.match(/id="m_story_permalink_view"(.*?)data-ft="(.*?)">/) || [];
                if (data[2]) {
                    data = data[2].split(" ")
                    data.splice(-1)
                    data = JSON.parse(data.join(' ').slice(0, -1))

                    let classNames = "span.x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1xmvt09.x1lliihq.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.xudqn12.x3x7a5m.x6prxxf.xvq8zen.xo1l8bm.xi81zsa.x1yc453h"
                    let node = makeButtonGetId(document, classNames)

                    // let node = document.createElement("button");
                    // let textnode = document.createTextNode("Get Id");
                    // node.appendChild(textnode);
                    // node.setAttribute("style", "background-color: #4CAF50; border: none; color: white; border-radius: 8px; margin-top: 5px; display: inline-block; cursor: pointer;");
                    // let a = document.getElementsByClassName("xu06os2 x1ok221b")[0]
                    // a.appendChild(node);

                    let strAlert = `ID: ${data.content_owner_id_new}_${data.top_level_post_id}\nAuthor ID: ${data.content_owner_id_new}\nPOST ID: ${data.top_level_post_id}\nPage ID: ${data.page_id}`
                    node.addEventListener("click", (e) => {
                        e.stopPropagation()
                        navigator.clipboard.writeText(strAlert);
                        alert(strAlert)
                    });
                }
            }

            // // console.log("length body",body.length)
            // let data = body.match(/id="m_story_permalink_view"(.*?)data-ft="(.*?)">/) || [];
            // if (data[2]) {
            //     data = data[2].split(" ")
            //     data.splice(-1)
            //     data = JSON.parse(data.join(' ').slice(0, -1))
            //
            //     let node = document.createElement("button");
            //     let textnode = document.createTextNode("Get Id");
            //     node.appendChild(textnode);
            //     node.setAttribute("style", "background-color: #4CAF50; border: none; color: white; border-radius: 8px; margin-top: 5px; display: inline-block; cursor: pointer;");
            //     let a = document.getElementsByClassName("xu06os2 x1ok221b")[0]
            //     a.appendChild(node);
            //
            //     let strAlert = `ID: ${data.content_owner_id_new}_${data.top_level_post_id}\nAuthor ID: ${data.content_owner_id_new}\nPOST ID: ${data.top_level_post_id}\nPage ID: ${data.page_id}`
            //     node.addEventListener("click", (e) => {
            //         e.stopPropagation()
            //         alert(strAlert)
            //         navigator.clipboard.writeText(strAlert);
            //     });
            // }
        }
    }
    sendResponse({});
    return true;
})

function makeButtonGetId(obj, classNames) {
    let node = document.createElement("button");
    let textnode = document.createTextNode("Get Id");
    node.appendChild(textnode);
    node.setAttribute("style", "background-color: #4CAF50; border: none; color: white; border-radius: 8px; margin-left: 7px; display: inline-block; cursor: pointer;");
    let swapButton = obj.querySelectorAll(classNames)[0]
    if (swapButton) {
        swapButton.appendChild(node);
    }
    return node
}

async function getDataFromMbasic(url) {
    try {
        murl = url.replace("www.facebook", "mbasic.facebook")
        let res = await fetch(murl)
        if (res.status === 200) {
            data = await res.text()
        } else {
            return false;
        }
        return data
    } catch (e) {
        return false;
    }

}
