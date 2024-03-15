<?php
session_start();
include_once 'connect.php';

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

  function translateToFontAwesomeIcon($number) {
    switch ($number) {
      case -2:
        return '<i class="fa-regular fa-face-angry angry"></i> very negative';
      case -1:
        return '<i class="far fa-frown frown"></i> negative';
      case 0:
        return '<i class="far fa-meh meh"></i> neutral';
      case 1:
        return '<i class="far fa-smile smile"></i> positive';
      case 2:
        return '<i class="fa-regular fa-face-laugh-beam beam"></i> very positive';
      default:
        return '<i class="fa-regular fa-face-dizzy dizzy"> </i><span style="color: grey;"> missing (submission made before v1.3)</span>';
    }
  }

  function generate_student_html_entries($entries) {
    foreach ($entries as $entry) {
      $html .= '<div class="entry">
        <p class="time time_entry"><i class="fa-solid fa-clock"></i> <span style="color: grey;">|</span> '. fancyTimestamp($entry['date']). '</p>
        <hr class="regular-hr time_divider">
        <p class="pos_entry"><i class="fa-solid fa-thumbs-up positive"></i> <span style="color: grey;">|</span> '.$entry['message_positive'].'</p>
        <hr class="regular-hr pos_divider">
        <p class="neg_entry"><i class="fa-solid fa-thumbs-down negative"></i> <span style="color: grey;">|</span> '.$entry['message_negative'].'</p>
        <hr class="regular-hr neg_divider">
        <p class="add_entry"><i class="fa-solid fa-circle-question additional"></i> <span style="color: grey;">|</span> '.$entry['message_additional'].'</p>
        <hr class="bold-hr add_divider">
        <p class="emotion_entry"><i class="fa-regular fa-face-laugh-wink emotion"></i> <span style="color: grey;">|</span> '. translateToFontAwesomeIcon($entry['sentiment']) .'</p>
      </div>';
    }
    return $html;
  }

  function generate_admin_html_entries($entries) {
    foreach ($entries as $entry) {

      if(strpos($entry['token'], "group") !== False) {
        $html .= '<div class="entry group_entry">';
        $html .= '<p class="time token_entry"><i class="fa-solid fa-users"></i> <span style="color: grey;">|</span> ' . $entry['token'] . '</p>';
      } else {
        $html .= '<div class="entry personal_entry">';
        $html .= '<p class="time token_entry"><i class="fa-solid fa-user"></i> <span style="color: grey;">|</span> ' . $entry['token'] . '</p>';
      }
      $html .= '
      <hr class="regular-hr token_divider">
      <p class="time time_entry"><i class="fa-solid fa-clock"></i> <span style="color: grey;">|</span> '. fancyTimestamp($entry['date']). '</p>
      <hr class="regular-hr time_divider">
      <p class="pos_entry"><i class="fa-solid fa-thumbs-up positive"></i> <span style="color: grey;">|</span> '.$entry['message_positive'].'</p>
      <hr class="regular-hr pos_divider">
      <p class="neg_entry"><i class="fa-solid fa-thumbs-down negative"></i> <span style="color: grey;">|</span> '.$entry['message_negative'].'</p>
      <hr class="regular-hr neg_divider">
      <p class="add_entry"><i class="fa-solid fa-circle-question additional"></i> <span style="color: grey;">|</span> '.$entry['message_additional'].'</p>
      <hr class="bold-hr add_divider">
      <p class="emotion_entry"><i class="fa-regular fa-face-laugh-wink emotion"></i> <span style="color: grey;">|</span> '. translateToFontAwesomeIcon($entry['sentiment']) .'</p>
      </div>';
    }
    return $html;
  }

  try {
    $pdo = new PDO($dsn, $dbusername, $dbpassword);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Admin content.
    if (isset($_SESSION["admin"])) {
      // Prepare the SQL statement
      $stmt = $pdo->prepare("SELECT * FROM entries");

      // User content.
    } elseif (isset($_SESSION['user_token'])) {
      $token = $_SESSION['user_token'];
      $stmt = $pdo->prepare("SELECT * FROM entries WHERE token = :token");

      // Bind the token parameter
      $stmt->bindParam(':token', $token);
    } else {
      header('Location: index');
    }

    // Execute the statement
    $stmt->execute();

    // Fetch all rows as an associative array
    $entries = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Sort entries based on date in descending order (most recent first)
    usort($entries, function($a, $b) {
        $dateA = new DateTime($a['date']);
        $dateB = new DateTime($b['date']);
        return $dateB <=> $dateA;
    });
    // Generate HTML content to display the entries
    $content = '';

    if (isset($_SESSION['admin'])) {
      $content .= generate_admin_html_entries($entries);
    } elseif (isset($_SESSION['user_token'])) {
      $content .= generate_student_html_entries($entries);
    }

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
?>
