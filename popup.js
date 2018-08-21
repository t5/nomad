
function setup() {
    setupLinks();
    setupBookmarkAdder();
}

function setupLinks() {
    // after loading the popup, add the links to bookmarks
    chrome.storage.sync.get(['bookmarks'], function(result) {
      for (var name in result.bookmarks) {

        var listgroup = document.getElementsByClassName("list-group")[0];

        // elem will contain nameDiv and buttonDiv, which will then be put in the list
        var elem = document.createElement("li");
        elem.classList.add("list-group-item");
        elem.classList.add("list-group-item-action");

        var nameDiv = document.createElement("div");
        var node = document.createTextNode(name);

        nameDiv.appendChild(node);
        if (chrome.extension.getBackgroundPage().isTabOpen(name)) {
          nameDiv.appendChild(document.createTextNode(" (open)"));
        }
        elem.appendChild(nameDiv);

        // make sure name doesn't overflow
        nameDiv.style.cssText = "text-overflow: ellipsis; overflow: hidden; white-space: nowrap;";
        nameDiv.classList.add("pr-2");

        // add the url and make it clickable
        var url = result.bookmarks[name];
        chrome.extension.getBackgroundPage().openTab(elem, url, name);

        var buttonDiv = document.createElement("div");
        var remElem = document.createElement("button");
        var remText = document.createTextNode("Delete");
        remElem.appendChild(remText);
        remElem.setAttribute("type", "button");
        remElem.classList.add("btn");
        remElem.classList.add("btn-outline-danger");
        remElem.classList.add("text-right");
        remElem.classList.add("btn-sm");
        buttonDiv.appendChild(remElem);
        elem.appendChild(buttonDiv);

        // make the bookmarks removable
        chrome.extension.getBackgroundPage().removeBookmark(remElem, name, function() {
          location.reload();           
        });

        // make it flex
        elem.classList.add("d-flex"); 
        elem.classList.add("justify-content-between"); 
        elem.classList.add("align-items-center"); 
        elem.style.cssText = "min-height: 50px"; 

        listgroup.appendChild(elem);
      }
    });
}


function setupBookmarkAdder() {
  // when Enter is pressed, add a bookmark
  var textField = document.getElementById("bname");
  textField.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      document.getElementById("add_bookmark").click();
    }
  });

  // add new bookmark
  isNewBookmark = document.getElementById("add_bookmark");
  isNewBookmark.addEventListener("click", function() {
      var newName = document.getElementById("bname").value;

      chrome.tabs.query({'active': true, 'currentWindow': true}, function(tabs) {
        var newURL = tabs[0].url;

        if (newName === "") {
            newName = tabs[0].title;
        }

        chrome.extension.getBackgroundPage().addBookmark(newName, newURL);
        chrome.extension.getBackgroundPage().open[tabs[0].id] = newName;
        chrome.extension.getBackgroundPage().updateTitleFav(tabs[0].id);
        location.reload();
      });
  });
}

window.onload=function() {
    setup();
}
