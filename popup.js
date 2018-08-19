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

        if (chrome.extension.getBackgroundPage().isTabOpen(name))
          elem.style.color = "silver";
        chrome.extension.getBackgroundPage().openTab(elem, url, name);

        var remElem = document.createElement("p");
        var remNode = document.createTextNode("-");
        remElem.style.color = "red";
        remElem.appendChild(remNode);
        document.body.appendChild(remElem);
        chrome.extension.getBackgroundPage().removeBookmark(remElem, name, function() {
            window.close();
        });
      }
    });

    // add new bookmark
    isNewBookmark = document.getElementById("add_bookmark");
    isNewBookmark.addEventListener("click", function() {
        var newName = document.getElementById("bname").value;
        chrome.tabs.query({'active': true, 'currentWindow': true}, function(tabs) {
          var newURL = tabs[0].url;

          chrome.extension.getBackgroundPage().addBookmark(newName, newURL);

          var newElem = document.createElement("p");
          var newNode = document.createTextNode(newName);
          newElem.appendChild(newNode);
          document.body.insertBefore(newElem, document.body.firstChild.nextSibling.nextSibling.nextSibling.nextSibling);

          chrome.extension.getBackgroundPage().open[tabs[0].id] = newName;
          window.close();
        });
    });
}
