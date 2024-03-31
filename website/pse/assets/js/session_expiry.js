// Initial call for showing properly how many minutes are remaining.
checkSessionExpiry();

// Function to check session expiry
function checkSessionExpiry() {
  $.ajax({
    url: "functions/session.php",
    method: "GET",
    dataType: "json",
    success: function (response) {
      if (response.expired) {
        // Session expired, perform logout or other actions
        logoutUser();
      } else if (response.stop) {
        $("#countdown").removeClass("orange");
        $("#countdown").removeClass("red");
        $("#countdown").removeClass("color-flashing");
        $("#countdown").html("Phew!");
      } else if (
        response.seconds_remaining < 1200 &&
        response.seconds_remaining > 900
      ) {
        // 20 minutes left, start showing timer.
        $("#countdown").removeClass("orange");
        $("#countdown").removeClass("red");
        $("#countdown").removeClass("color-flashing");
        $("#countdown").html(
          response.time_remaining +
            "   <a href='#' class='refresh-button' onclick='refreshSession()'><i class='fas fa-sync-alt'></i></a>"
        );
      } else {
        if (response.seconds_remaining < 300) {
          // Fewer than 5 minutes remaining. Really get gnarly.
          $("#countdown").html(
            "Your session will expire in: " +
              response.time_remaining +
              "   <a href='#' class='refresh-button' onclick='refreshSession()'><i class='fas fa-sync-alt'></i></a>"
          );
          $("#countdown").removeClass("orange");
          $("#countdown").addClass("red");
          $("#countdown").addClass("color-flashing");
        } else if (response.seconds_remaining < 900) {
          // Fewer than 15 minutes remaining. Start being more serious.
          $("#countdown").html(
            "Your session will expire in: " +
              response.time_remaining +
              "   <a href='#' class='refresh-button' onclick='refreshSession()'><i class='fas fa-sync-alt'></i></a>"
          );
          $("#countdown").addClass("orange");
        } else {
          $("#countdown").removeClass("orange");
          $("#countdown").removeClass("red");
          $("#countdown").removeClass("color-flashing");
          $("#countdown").html("");
        }
      }
    },
  });
}

// Function to perform logout or other actions
function logoutUser() {
  // Perform logout operations here
  // For example, redirect to the logout page
  window.location.href = "session_expired.php";
}

function refreshSession() {
  // Send an AJAX request to the server to update the session
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "functions/refresh_session.php", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      // Session refreshed successfully
      $("#countdown").removeClass("orange");
      $("#countdown").removeClass("red");
      $("#countdown").removeClass("color-flashing");
      $("#countdown").html("Session refreshed!");
      // Hide the message after 5 seconds
      setTimeout(function () {
        $("#countdown").html(""); // Clear the message content
      }, 5000);
    }
  };
  xhr.send();
}

// Call the checkSessionExpiry function periodically (e.g., every minute)
setInterval(checkSessionExpiry, 1000);
