console.log("content JS running")
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "fetched") {
        if (!request.data) {
            console.log("khong co data")
        } else if (request.url === window.location.href) {
            if (request.search) {
                console.log("search posts:", request)
                // handle in facebook/search
                listPosts = document.querySelectorAll("div[role='feed'] > div");
                for (let i = 0; i < listPosts.length; i++) {
                    let hasButtonGetId = listPosts[i].querySelector("button.button-get-id");
                    if (hasButtonGetId) {
                        break
                    }
                    handleDom(listPosts[i], request)

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


                // handle scroll events
                const target = document.querySelector('div.x193iq5w.x1xwk8fm[role="feed"]');
                const config = {childList: true, subtree: true};

                const callback = function (mutationsList, observer) {
                    for (const mutation of mutationsList) {
                        if (mutation.addedNodes.length === 0) {
                            return;
                        }
                        let articleAdd = mutation.addedNodes[0]
                        let hasButtonGetId = articleAdd.querySelector("button.button-get-id");
                        if (hasButtonGetId) {
                            break
                        }
                        handleDom(articleAdd, request)
                    }
                };

                const observer = new MutationObserver(callback);
                observer.observe(target, config);

            } else {
                console.log('detail post', request)
                // handle detail post
                let hasButtonGetId = document.getElementById("button-get-id-detail");
                if (!hasButtonGetId) {
                    console.log("not hasButtonGetId")
                    let classNames = "h2[id^='jsc_'], h3[id^='jsc_']"
                    let node = makeButtonGetId(document, classNames, "button-get-id-detail")

                    if (node) {
                        node.addEventListener("click", async (e) => {
                            e.stopPropagation()
                            handleGetIdOfDetailPost(request, request.url)
                        })
                    } else if (!request.update) {
                        console.log("handle when not button")
                        handleGetIdOfDetailPost(request, request.url)
                    }
                } else if (!request.update) {
                    console.log("handle when click and has button")
                    handleGetIdOfDetailPost(request, request.url)
                }

                // handle in detail post
                // let body = request.data
                // const e = document.createElement('textarea');
                // e.innerHTML = body;
                // body = e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
                // let data = body.match(/id="m_story_permalink_view"(.*?)data-ft="(.*?)">/) || [];
                // if (data[2]) {
                //     data = data[2].split(" ")
                //     data.splice(-1)
                //     data = JSON.parse(data.join(' ').slice(0, -1))
                //
                //     let classNames = "h2[id^='jsc_']"
                //     let node = makeButtonGetId(document, classNames)
                //
                //     // let node = document.createElement("button");
                //     // let textnode = document.createTextNode("Get Id");
                //     // node.appendChild(textnode);
                //     // node.setAttribute("style", "background-color: #4CAF50; border: none; color: white; border-radius: 8px; margin-top: 5px; display: inline-block; cursor: pointer;");
                //     // let a = document.getElementsByClassName("xu06os2 x1ok221b")[0]
                //     // a.appendChild(node);
                //
                //     node.addEventListener("click", (e) => {
                //         e.stopPropagation()
                //         saveToClipboard(data.content_owner_id_new, data.top_level_post_id)
                //     });
                // }
                // }
            }
        }
    }
    sendResponse({});
    return true;
})

function makeButtonGetId(obj, wrapClassNames, idOfButton = null) {
    let node = document.createElement("button");
    let textnode = document.createTextNode("Get Id");
    node.appendChild(textnode);
    node.setAttribute("style", "background-color: #4CAF50; border: none; color: white; border-radius: 8px; margin-left: 7px; display: inline-block; cursor: pointer;");
    node.classList.add("button-get-id");
    if (idOfButton) {
        node.setAttribute("id", idOfButton)
    }
    let wrapButton = obj.querySelector(wrapClassNames)
    if (wrapButton) {
        wrapButton.appendChild(node);
        return node
    }
    return null
}

function saveToClipboard(ownerId, postId) {
    let id = `${ownerId}_${postId}`
    navigator.clipboard.writeText(id);
    alert(`ID: ${id}`)
}

function handleDom(obj, request) {
    // add class of  new to here
    let a = obj.querySelector("a[href*='/posts/'], a[href*='/permalink']")

    if (a) {
        let classNames = "h2.x1heor9g>span.x193iq5w>span.x1lliihq, h2[id^='jsc_'], h3[id^='jsc_']"
        // let classNames = "span.x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.x8182xy.xwrv7xz"
        let node = makeButtonGetId(obj, classNames)
        if (node) {
            node.addEventListener("click", async (e) => {
                e.stopPropagation()
                let urlPost = a.getAttribute("href")
                handleGetIdOfDetailPost(request, urlPost)
            });
        }
    } else {
        let a1 = obj.querySelector("a.x1i10hfl.xjbqb8w.x6umtig.x1b1mbwd.xaqea5y.xav7gou.x9f619.x1ypdohk.xt0psk2.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x16tdsg8.x1hl2dhg.xggy1nq.x1a2a7pz.x1heor9g.xt0b8zv.xo1l8bm")
        if (a1) {
            // let use = a1.querySelector("use")
            // const mouseoverEvent = new Event('mouseover');
            // if (use) {
            //     use.addEventListener("mouseover", async (e) => {
            //         console.log('mouseover')
            //     });
            //     use.dispatchEvent(mouseoverEvent);
            // } else {
            //     a1.addEventListener("mouseover", async (e) => {
            //         console.log('mouseover')
            //     });
            //     a1.dispatchEvent(mouseoverEvent)
            // }

            let classNames = "h2.x1heor9g>span.x193iq5w>span.x1lliihq, h2[id^='jsc_'], h3[id^='jsc_']"
            let node = makeButtonGetId(obj, classNames)
            if (node) {
                node.addEventListener("click", async (e) => {
                    e.stopPropagation()
                    let urlPost = a1.getAttribute("href")
                    console.log("urlPost", urlPost)
                    handleGetIdOfDetailPost(request, urlPost)
                });
            }
        }
    }
}

function handleGetIdOfDetailPost(request, urlPost) {
    // handle get video post id
    let linkVideo = urlPost.match(/\/.*\/(.*?)\/videos\/(\d+)/)
    let photosPost = urlPost.match(/\/.*\/(.*?)\/photos\/.*?\/(\d+)/)
    if (linkVideo && linkVideo.length >= 2) {
        saveToClipboard(linkVideo[1], linkVideo[2])
    } else if (photosPost && photosPost.length >= 2) {
        saveToClipboard(photosPost[1], photosPost[2])
    } else {
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
                    saveToClipboard(data.content_owner_id_new, data.top_level_post_id)
                } else {
                    alert("Không lấy được ID!!!")
                }
            }
        })
    }
}
