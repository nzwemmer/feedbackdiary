$(document).ready(function() {
    // Check if the "do not remind me again" option is enabled
    var doNotRemindAgain = localStorage.getItem("doNotRemindAgain");

    if (!doNotRemindAgain) {
      // Show the popup if the option is not set
      $("#popupContainer").show();
    }
  
    // Handle the click event of the popup toggle switch
    $("#popupToggle").click(function() {
      if ($(this).is(":checked")) {
        // If checked, set the "doNotRemindAgain" option in local storage
        localStorage.setItem("doNotRemindAgain", true);
      } else {
        // If unchecked, remove the "doNotRemindAgain" option from local storage
        localStorage.removeItem("doNotRemindAgain");
      }
    });

    // Handle the click event of the toggle popup button
    $("#togglePopupButton").click(function() {
      togglePopup();
    });

    // Function to toggle the popup
    function togglePopup() {
      $("#popupContainer").toggle();
      if (doNotRemindAgain) {
        localStorage.removeItem("doNotRemindAgain");
      }
    }

    // Handle the close button click event
    $("#popupDismiss").click(function() {
      // Hide the popup
      $("#popupContainer").hide();
    });
  
    // Ajax code to fetch dynamic content for the popup message
    $.ajax({
      type: "GET",
      url: "assets/framework/popup_content.php", // Replace with the correct URL to your PHP script
      success: function(response) {
        // Update the popup message content with the response
        $("#popupMessage").html(response);
        
        if (isMobileDevice()) {
          var warning = '<i id="warningLogo" class="fa-solid fa-laptop-code fa-beat-fade"></i> Mobile Phone detected. This website is designed computer-first. Mobile suport limited.';
          $("#warningMobile").html(warning);
        }

        if (doNotRemindAgain) {
          // If the "do not remind me again" option is set, hide the popup
          $("#popupContainer").hide();
        }
      },
      error: function(xhr, status, error) {
        console.error("Error fetching popup content:", error);
      }
    });

    function isMobileDevice() {
      return /Mobi|Android/i.test(navigator.userAgent);
    }
  });