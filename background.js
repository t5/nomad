chrome.runtime.onInstalled.addListener(function() {
  // this is a map from ID to name
  open = {};
  
  bookmarks = {reddit: "https://reddit.com", 
              google: "https://google.com", 
              ucla: "https://ucla.edu"};
  chrome.storage.sync.set({"bookmarks": bookmarks});
});

function updateTitleFav(tabId) {
  chrome.tabs.executeScript(tabId, {file: 'contentScript.js'}, function() {
    chrome.tabs.sendMessage(tabId, {tabName: open[tabId],
                                    fav: chrome.runtime.getURL("icons/favicon.ico")});
  });
}

// when bookmark tabs are updated, open obj is also updated
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (open.hasOwnProperty(tabId) && changeInfo.status == "complete") {
      // change the favicon and title
      updateTitleFav(tabId);
  }
  if (changeInfo.url && open.hasOwnProperty(tabId)) {
    chrome.storage.sync.get(["bookmarks"], function(result) {
      var currBookmarks = result.bookmarks;
      var currName = open[tabId];
      currBookmarks[currName] = changeInfo.url;
      chrome.storage.sync.set({"bookmarks": currBookmarks});
    });
  }
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  // access the array of open tabs
  if (open.hasOwnProperty(tabId)) {
    // remove the closed tab from the open tabs
    delete open[tabId];
  }
});

function openTab(elem, url, name){
  elem.addEventListener("click", function() {
    // check if tab open
    if (isTabOpen(name)) {
      // make tab active
      var clickedTabId = Object.entries(open).find(i => i[1] === name);
      chrome.tabs.get(parseInt(clickedTabId[0], 10), function(tab) {
        chrome.tabs.update(tab.id, {highlighted: true});
        return;
      });
    }
    else {
      // if the link button is clicked
      var newTab = url;
      chrome.tabs.create({url: newTab}, function(tab) { 
        // after creating the tab, add it's ID and URL to open
          open[tab.id] = name;
      });
    }
  });
}

function addBookmark(name, url) {
  chrome.storage.sync.get(["bookmarks"], function(result) {
    currBookmarks = result.bookmarks;
    currBookmarks[name] = url;
    chrome.storage.sync.set({"bookmarks": currBookmarks});
  });
}

function removeBookmark(elem, name, callback) {
  elem.addEventListener("click", function(event) {

    // stop deletion from opening the tab
    event.stopPropagation();

    chrome.storage.sync.get(["bookmarks"], function(result) {
      currBookmarks = result.bookmarks;
      delete currBookmarks[name];
      chrome.storage.sync.set({"bookmarks": currBookmarks});
      callback();
    });
  });
}

function isTabOpen(name) {
  return (Object.values(open).indexOf(name) > -1)
}
