// Set the target date and time
var targetDateTime = new Date("June 5, 2023 12:00:00").getTime();

// Update the countdown every second
var countdown = setInterval(function () {
  // Get the current date and time
  var currentDateTime = new Date().getTime();

  // Calculate the time remaining
  var timeRemaining = targetDateTime - currentDateTime;

  // Calculate days, hours, minutes, and seconds
  var days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  var hours = Math.floor(
    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  var minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  // Display the countdown timer
  document.getElementById("timer").innerHTML =
    days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

  // If the countdown is finished, refresh the page
  if (timeRemaining < 0) {
    clearInterval(countdown);
    document.getElementById("timer").innerHTML = "Launching!";
    location.reload(); // Refresh the page
  }
}, 1000);
