<?php
session_start();

function fancyTimestamp($timestamp) {
  $now = new DateTime();
  $date = DateTime::createFromFormat('Y-m-d H:i:s', $timestamp);

  $diffInMilliseconds = $now->getTimestamp() * 1000 - $date->getTimestamp() * 1000;
  $diffInSeconds = floor($diffInMilliseconds / 1000);
  $diffInMinutes = floor($diffInSeconds / 60);
  $diffInHours = floor($diffInMinutes / 60);
  $diffInDays = floor($diffInHours / 24);

  if ($diffInSeconds < 5) {
    return 'just now';
  } elseif ($diffInMinutes < 1) {
    return $diffInSeconds . 's ago';
  } elseif ($diffInHours < 1) {
    return $diffInMinutes . 'm ago';
  } elseif ($diffInDays < 1) {
    return $diffInHours . 'h ago';
  } elseif ($diffInDays === 1) {
    return 'yesterday';
  } elseif ($diffInDays < 7) {
    return $diffInDays . 'd ago';
  } else {
    return $date->format('d-m-Y, H:i');
  }
}

  function generate_html_entries($entries) {
    foreach ($entries as $entry) {
      $html .= '<div class="entry">
          <p class="time"><i class="fa-solid fa-clock"></i> '. fancyTimestamp($entry['date_added']). '</p>
          <hr class="regular-hr">
          <p><i class="fa-solid fa-thumbs-up positive"></i> '.$entry['date'].'</p>
          <hr class="regular-hr">
          <p><i class="fa-solid fa-thumbs-up positive"></i> '.$entry['message_positive'].'</p>
          <hr class="regular-hr">
          <p><i class="fa-solid fa-thumbs-down negative"></i> '.$entry['message_negative'].'</p>
          <hr class="regular-hr">
          <p><i class="fa-solid fa-circle-question additional"></i> '.$entry['message_additional'].'</p>
          <hr class="bold-hr">
      </div>';
    }
    return $html;
}



if (isset($_SESSION['user_token'])) {
    include_once 'connect.php';

    $token = $_SESSION['user_token'];

    try {
        $pdo = new PDO($dsn, $dbusername, $dbpassword);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Prepare the SQL statement
        $stmt = $pdo->prepare("SELECT * FROM entries WHERE token = :token");

        // Bind the token parameter
        $stmt->bindParam(':token', $token);

        // Execute the statement
        $stmt->execute();

        // Fetch all rows as an associative array
        $entries = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Sort entries based on date in descending order (most recent first)
        usort($entries, function($a, $b) {
          $dateA = new DateTime($a['date_added']);
          $dateB = new DateTime($b['date_added']);
          return $dateB <=> $dateA;
        });

        // Generate HTML content to display the entries
        $content = '';
        $content .= generate_html_entries($entries);

        if (empty($content)) {
            $content = '<p style="text-align: center; font-size: 14px;"><i class="fa-solid fa-folder-open"></i> <i class="fa-solid fa-wind"></i> (empty)</p>';
        } else {
            $content = '<hr class="bold-hr">' . $content;
        }

        // Return the generated HTML content
        echo $content;
    } catch (PDOException $e) {
        // Return an error response
        echo "Error: Could not retrieve data. Please try again later.";
    }
}
?>
