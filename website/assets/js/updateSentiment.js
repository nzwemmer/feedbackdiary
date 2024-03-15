  // Function to update the selected sentiment value
  function updateSentiment(value) {
    var sentimentButtons = document.getElementsByClassName("sentiment-button");
    var selectedSentimentInput = document.getElementById("selected-sentiment");

    // Update selected sentiment button and hidden input value
    for (var i = 0; i < sentimentButtons.length; i++) {
      if (i === value + 2) {
        sentimentButtons[i].classList.add("active", "active-" + i);
      } else {
        sentimentButtons[i].classList.remove("active", "active-" + i);
      }
    }

    selectedSentimentInput.value = value;
  }