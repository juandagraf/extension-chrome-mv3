chrome.action.onClicked.addListener(function (tab) {
  openOptions(chrome.runtime.id);
});

function openOptions(id) {
  chrome.tabs.query({ url: `chrome-extension://${id}/settings.html` }, (tab) => {
    if (tab[0] == undefined) {
      chrome.tabs.create({
        url: "../settings.html",
        active: true
      });
    }
  },
  );
}