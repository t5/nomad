window.onload=function() {

    // after loading the popup, add the links to bookmarks
    chrome.storage.sync.get(['bookmarks'], function(result) {
      for (var name in result.bookmarks) {
        // add the url
        var url = result.bookmarks[name];
        var elem = document.createElement("p");
        var node = document.createTextNode(name);
        elem.appendChild(node);
        document.body.appendChild(elem);

        chrome.runtime.getBackgroundPage(function(bg) {
          if (bg.isTabOpen(name))
            elem.style.color = "silver";
          bg.openTab(elem, url, name);
        });

        var remElem = document.createElement("p");
        var remNode = document.createTextNode("-");
        remElem.style.color = "red";
        remElem.appendChild(remNode);
        document.body.appendChild(remElem);

        chrome.runtime.getBackgroundPage(function(bg) {
          bg.removeBookmark(remElem, name, function() {
              window.close();
          });
        });
      }
    });

    // add new bookmark
    isNewBookmark = document.getElementById("add_bookmark");
    isNewBookmark.addEventListener("click", function() {
        var newName = document.getElementById("bname").value;
        chrome.tabs.query({'active': true, 'currentWindow': true}, function(tabs) {
          var newURL = tabs[0].url;

          chrome.runtime.getBackgroundPage(function(bg) {
            bg.addBookmark(newName, newURL);
            bg.open[tabs[0].id] = newName;
          });
          window.close();
        });
    });
}
