<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_SESSION['user_token']) && !$_SESSION['expired']) {
    include_once 'connect.php';

    if (!empty($_POST['message_positive']) && !empty($_POST['message_negative']) && isset($_POST['sentiment'])) {
        // Get the form data
        $message_positive = $_POST['message_positive'];
        $message_negative = $_POST['message_negative'];
        $message_additional = !empty($_POST['message_additional']) ? $_POST['message_additional'] : "_NONE_";
        $token = $_SESSION['user_token'];

        // Get the current time in H:i:s format
        if ($_SERVER['HTTP_HOST'] == "localhost" || str_contains($_SERVER['HTTP_HOST'], "192.168.2.") || str_contains($_SERVER['HTTP_HOST'], "192.168.68")) {
          $currentDateTime = date('Y-m-d H:i:s');
          $currentTime = date('H:i:s');
        } else {
          $currentTime = date('H:i:s', strtotime('+2 hours'));
          $currentDateTime = date('Y-m-d H:i:s', strtotime('+2 hours'));
        }

        // Check if selectedDate field exists
        if (isset($_POST['selectedDate'])) {
          $selectedDate = $_POST['selectedDate'];

          // Concatenate selectedDate and currentTime in the desired format (DD/MM/YYYY H:i:s)
          $formattedDateTime = $selectedDate . ' ' . $currentTime;

          // Convert formattedDateTime to MySQL datetime format (YYYY-MM-DD HH:MM:SS)
          $formattedDateTime = date('Y-m-d H:i:s', strtotime($formattedDateTime));

          // Compare formattedDateTime with the current date and time
          if ($formattedDateTime > $currentDateTime) {
            echo "Error: Date can't exceed current date.";
            exit;
          }
        } else {
          $formattedDateTime = $currentDateTime; // Set the datetime to null if not provided
        }

        // Check if selectedDate field exists
        if (isset($_POST['sentiment'])) {
          $selectedSentiment = $_POST['sentiment'];

          // Compare formattedDateTime with the current date and time
          if ($selectedSentiment > 2 || $selectedSentiment < -2) {
            echo "Error: Sentiment not understood.";
            exit;
          }
        } else {
          $selectedSentiment = 99; // 99 for not provided. Should normally be between -2 and 2.
        }

        try {
            $pdo = new PDO($dsn, $dbusername, $dbpassword);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Prepare the SQL statement
            $stmt = $pdo->prepare("INSERT INTO entries (message_positive, message_negative, message_additional, token, sentiment, date) VALUES (:pos, :neg, :add, :token, :sentiment, :datetime)");

            // Bind the form data to the prepared statement
            $stmt->bindParam(':pos', $message_positive);
            $stmt->bindParam(':neg', $message_negative);
            $stmt->bindParam(':add', $message_additional);
            $stmt->bindParam(':token', $token);
            $stmt->bindParam(':datetime', $formattedDateTime, PDO::PARAM_STR);
            $stmt->bindParam(':sentiment', $selectedSentiment);

            // Execute the statement
            $stmt->execute();

            // Return a success response
            echo "Thank you for your submission!";

            // Destroy the session immediately so users can't refresh and keep sending stuff.
            // The logout function that follows is just a dummy :).
            $_SESSION = array();
            session_destroy();
        } catch (PDOException $e) {
            // Return an error response
            // echo $e->getMessage();
            echo "Error: Could not store data. Please try again later.";
        }
    } else {
        echo "Error: Please fill in the required fields marked in red!";
    }
} else {
    header("location: /index");
}
?>
