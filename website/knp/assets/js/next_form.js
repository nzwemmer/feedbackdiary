$(document).ready(function() {
  // Slide in the forms from the right initially
  var buttonPressCount = 0; // Initialize button press count

  // Function to apply red border to elements with specified IDs
  function applyLine(ids, classToAdd, classToRemove) {
    ids.forEach(function(id) {
      $("#" + id).addClass(classToAdd);
      $("#" + id).removeClass(classToRemove);
    });
  }

  // Handle form submissions
  $("form").submit(function(e) {
    e.preventDefault();

    var formData = $(this).serialize();
    var url = "";
    var nextForm = "";
    var currentForm = $(this);
    var element = "";
    var refresh = false;
    var delay = 1000;
    var animate = true;
    // Define an initial array of IDs for elements you want to have a lining
    var lineIds = [];

    switch ($(this).attr("id")) {
      case "loginForm":
        url = "functions/login.php";
        lineIds.push("user_token");
        lineIds.push("password");
        nextForm = $("#diaryForm");
        element = "#login_status";
        refresh = true;
        break;
      case "aboutForm":
        url = "functions/dummy.php";
        nextForm = $("#loginForm, #diaryForm");
        refresh = true;
        delay = 0;
        break;
      case "viewForm":
        url = "functions/view.php";
        nextForm = $("#historyForm");
        element = "#fetch_status";
        delay = 0;
        animate = false;
        break;
      case "logoutForm":
        url = "functions/logout.php";
        nextForm = $("#loginForm");
        element = "#logout_status";
        refresh = true;
        delay = 1000;
        break;
      case "consentForm":
        url = "functions/consent.php";
        nextForm = $("#generalTokenForm");
        element = "#consent_status";
        break;
      case "generalTokenForm":
        url = "functions/token.php";
        nextForm = $("#passwordForm");
        element = "#general_token_status";
        break;
      case "passwordForm":
        url = "functions/password.php";
        nextForm = $("#diaryForm");
        element = "#password_status";
        refresh = true;
        break;
      case "downloadForm":
        url = "functions/download.php";
        nextForm = $("#downloadForm");
        element = "#download_status";
        refresh = true;
        break;
      default:
        url = "functions/store_data.php";
        nextForm = $("#logoutForm");
        lineIds.push("message_positive");
        lineIds.push("message_negative");
        lineIds.push("message_sentiment");
        element = "#diary_status";
        refresh = true;
    }

    $.ajax({
      type: "POST",
      url: url,
      data: formData,
      success: function(response) {
        if (~response.indexOf("Error:")) {
          call_error(response, element);
        } else {
          switch (url) {
            case "functions/download.php":
              download_file(response);
              response = "File downloaded successfully!";
              element = "#download_status";
              break;
            case "functions/token.php":
              $("#personal_token").html(response); // Update personal token.
              response = "General token accepted!";
              element = "#general_token_status";
              break;
            case "functions/store_data.php":
              call_success(response, "#fetchStatus", $("#historyForm"));
              break;
          }
          call_success(response, element, currentForm);
        }
      },
      error: function(xhr, status, error) {
        console.error("General error occurred.");
      }
    });

    function download_file(response) {
      // Append the response to a file and initiate download
      var fileData = response; // Assuming the response is the data to be appended
      var fileName = "database_dump_" + getCurrentDate() + ".txt"; // Set the desired file name
      var blob = new Blob([fileData], { type: "text/plain" });
      // For other browsers
      var url = window.URL || window.webkitURL;
      var link = document.createElement("a");
      link.href = url.createObjectURL(blob);
      link.download = fileName;
      link.click();
    }

    function call_error(response, element) {
      var icon = '<span class="icon-outline"><i class="fa-solid fa-triangle-exclamation errorLogo"></i></span> '
      var errorMessage = icon + response;
      // Apply red line to elements with specified IDs
      applyLine(lineIds, "warningBorder", "successBorder");

      $(element).html(errorMessage).addClass('shaking-element');
      setTimeout(function() {
        $(element).removeClass('shaking-element');
      }, 500);
    }

    function call_success(response, element, form) {
      var successMessage = "";
      applyLine(lineIds, "successBorder", "warningBorder");
      if (animate) {
        var icon = '<span class="icon-outline"><i class="fa-solid fa-check fa-bounce successLogo"></i></span> ';
        successMessage = icon + response;
      } else {
        successMessage = response;
      }
      $(element).html(successMessage);
      setTimeout(function() {
        if (animate) {
          form.animate({ left: "-100%" }, 750, function() {
            form.hide();
            if (refresh) {
              setTimeout(function() {
                if (delay === 0) { // For the about, or any future page going to home after.
                  window.location.href = "/";
                } else {
                  location.reload();
                }
              }, 750);
            } else {
              nextForm.css("left", "100%").show().animate({ left: "0%" }, 750);
            }
          });
        } else {
          buttonPressCount++; // Increment the button press count
          var fetchStatusButton = form.find('.fetch_status_button');
          var currentContent = fetchStatusButton.html().trim();
          var hide = '<i class="fa-solid fa-eye-slash"></i> hide';
          var show = '<i class="fa-solid fa-eye"></i> show';
          var newContent = currentContent === show ? hide : show;
          fetchStatusButton.html(newContent);
          if (buttonPressCount > 1) {
            form.find('.fetch_status_class').toggle(); // Hide the content on the second button press
          }
          toggleButtonAll(".time_button", '<i class="fa-solid fa-eye-slash"></i> <i class="fa-solid fa-clock"></i>');
          toggleButtonAll(".pos_button", '<i class="fa-solid fa-eye-slash"></i> <i class="fa-solid fa-thumbs-up positive"></i>');
          toggleButtonAll(".neg_button", '<i class="fa-solid fa-eye-slash"></i> <i class="fa-solid fa-thumbs-down negative"></i>');
          toggleButtonAll(".add_button", '<i class="fa-solid fa-eye-slash"></i> <i class="fa-solid fa-circle-question"></i>');
          form.find('.fetch_buttons_class').toggle();
        }
      }, delay);
    }
    

    function getCurrentDate() {
      var now = new Date();
      var year = now.getFullYear();
      var month = padNumber(now.getMonth() + 1);
      var day = padNumber(now.getDate());
      return year + "-" + month + "-" + day;
    }

    // Used again in this file. Should be merged at some point with other JS file.
    function toggleButtonAll(element, content) {
      var fetchButton = $("#viewForm").find(element);
      fetchButton.html(content);
    }

    function padNumber(num) {
      return num.toString().padStart(2, "0");
    }
  });
});
