actualizarBadge();

function actualizarBadge() {
  try {
    chrome.storage.sync.get({
      procesadas: 0
  }, function (items) {
      texto = JSON.stringify(items.procesadas)
      chrome.action.setBadgeText(
      { text: texto }
  );
  });
  }
  catch(e) {
    console.log(e.message);
  }
}

chrome.runtime.onInstalled.addListener(function () {
  actualizarBadge()
});

chrome.runtime.onStartup.addListener(function() {
  actualizarBadge();
})

chrome.storage.onChanged.addListener(async (changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
       if(key == "procesadas") {
        texto = JSON.stringify(newValue)
        chrome.action.setBadgeText(
          { text: texto }
        );
      }
  }
});