chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  document.title = request.tabName;

  // remove all favicons
  document.querySelectorAll("link[rel*='icon']").forEach(x => x.parentNode.removeChild(x));

  // add new favicon
  var fav = document.createElement('link');
  fav.rel = "shortcut icon";
  fav.href = request.fav; 
  document.getElementsByTagName('head')[0].appendChild(fav);
});
