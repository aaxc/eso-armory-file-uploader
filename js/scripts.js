$(function () {
  // Simulate click
  $('#my-button').click(function () {
    $('#my-file').click();
  });

  // Submit form
  $("#uploadButton").on('click', function () {
    let disabled = $(this).attr('aria-disabled');
    if (disabled == 'false') {
      saveFile();
    }
  });

  /**
   * Form submit and file upload function
   *
   * @returns {Promise<void>}
   */
  async function saveFile() {
    let that = document.getElementById('my-file');
    let formData = new FormData();
    formData.append("file", that.files[0]);
    formData.append("token", $('#appToken').val());
    var action = $('#uploadForm').attr('action');
    let result = await fetch(action, {
      method: "POST",
      body: formData
    });
    console.log(result);
  }
});
