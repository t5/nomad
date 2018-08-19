window.onload=function() {
    chrome.storage.sync.get(['bookmarks'], function(result) {
      for (var name in result.bookmarks) {

        // add the url
        var url = result.bookmarks[name];
        var elem = document.createElement("p");
        var node = document.createTextNode(name);
        elem.appendChild(node);
        document.body.appendChild(elem);

        chrome.extension.getBackgroundPage().openTab(elem, url, name);
      }
    });
}
