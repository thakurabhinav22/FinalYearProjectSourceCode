function handleCredentialResponse(response) {
    const oauthToken = response.credential;
    console.log("Sign-in successful!"); 
    loadPicker(oauthToken); 
  }

  function loadPicker(oauthToken) {
    gapi.load('picker', { 'callback': createPicker });

    function createPicker() {
      try {
        const picker = new google.picker.PickerBuilder()
          .addView(google.picker.ViewId.DOCS) 
          .setOAuthToken(oauthToken)
          .setDeveloperKey('') 
          .setCallback(pickerCallback)
          .build();
        picker.setVisible(true);
        console.log("Picker created successfully."); 
      } catch (error) {
        console.error("Error loading the picker: ", error); 
      }
    }
  }

  function pickerCallback(data) {
    if (data[google.picker.Response.ACTION] === google.picker.Action.PICKED) {
      const fileId = data[google.picker.Response.DOCUMENTS][0][google.picker.Document.ID];
      document.getElementById("fileInfo").innerText = 'Selected File ID: ' + fileId;
    }
  }