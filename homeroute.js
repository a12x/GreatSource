$.get(chrome.extension.getURL('/homepage/index.html'), function(settings) {
  if (document.title !== 'GreatSource') {
    document.open();
    document.write(settings);
    document.close();
  }
});
