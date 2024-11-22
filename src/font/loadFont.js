function loadFonts(fontPaths, callback) {
    const fonts = {};
    let loadedFonts = 0;
  
    fontPaths.forEach((path) => {
      fetch(path)
        .then(response => response.json())
        .then(font => {
          fonts[path] = font;
          loadedFonts++;
          if (loadedFonts === fontPaths.length) {
            callback(fonts);
          }
        })
        .catch(error => console.error('Error loading font:', error));
    });
}

export default loadFonts;