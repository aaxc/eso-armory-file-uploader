(function handleWindowControls() {
  // When document has loaded, initialise
  document.onreadystatechange = () => {
    if (document.readyState == "complete") {
      init();
    }
  };

  function init() {
    let window = remote.getCurrentWindow();
    const minButton = document.getElementById('minimize-button'),
          closeButton = document.getElementById('close-button'),
      destroyButton = document.getElementById('destroy-button');

    minButton.addEventListener("click", event => {
      window = remote.getCurrentWindow();
      window.minimize();
    });

    closeButton.addEventListener("click", event => {
      window = remote.getCurrentWindow();
      window.close();
    });

    destroyButton.addEventListener("click", event => {
      window = remote.getCurrentWindow();
      window.destroy();
    });
  }
})();
