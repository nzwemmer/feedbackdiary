<?php
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Check if the session has expired
    // Expiration time in seconds. 1800 = 30 minutes (default).
    $expiration = 1800;

    if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > $expiration)) {
        echo json_encode(['expired' => true]);
        $_SESSION['expired'] = true;
        exit;
    } elseif (!isset($_SESSION['LAST_ACTIVITY'])) {
        echo json_encode(['stop' => true]);
    } else {
        // Return a response indicating the session is active
        $seconds = $expiration - (time() - $_SESSION['LAST_ACTIVITY']);
        $time = gmdate("H:i:s", ($expiration - (time() - $_SESSION['LAST_ACTIVITY'])));
        echo json_encode(['expired' => false, 'seconds_remaining' => $seconds, 'time_remaining' => $time]);
    }
} else {
    header("location: /index");
}

?>
