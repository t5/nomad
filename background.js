chrome.runtime.onInstalled.addListener(function() {
    // this is a map from ID to URL
    open = {};
    
    bookmarks = {reddit: "https://reddit.com", 
                google: "https://google.com", 
                ucla: "https://ucla.edu"};
    chrome.storage.sync.set({"bookmarks": bookmarks});
});

// when bookmark tabs are updated, open obj is also updated
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.url && open.hasOwnProperty(tabId)) {
      chrome.storage.sync.get(["bookmarks"], function(result) {
        var currBookmarks = result.bookmarks;
        var currName = open[tabId];
        currBookmarks[currName] = changeInfo.url;
        console.log(currBookmarks);
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
      // if the link button is clicked
      var newTab = url;
      chrome.tabs.create({url: newTab}, function(tab) { 
        // after creating the tab, add it's ID and URL to open
          open[tab.id] = name;
      });
    });
}
