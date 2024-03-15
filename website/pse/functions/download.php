<?php
session_start();
include_once 'connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_SESSION['admin']) && $_SESSION['admin']) {
    try {
        $pdo = new PDO($dsn, $dbusername, $dbpassword);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Prepare the SQL statement
        $stmt = $pdo->prepare("SELECT * from entries");
        // Execute the statement
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC); // Fetch all rows as an associative array
        if ($data) {
            // Return the data as JSON
            echo json_encode($data);
            // Nullify LAST_ACTIVITY to stop countdown.
            $_SESSION['LAST_ACTIVITY'] = null;
            $_SESSION = array();
            // Destroy the session
            session_destroy();
        } else {
            // No data found, display an error message or perform any necessary actions
            echo "Error: Could not download data. Check database.";
        }
    } catch (PDOException $e) {
        // Return an error response
        echo "Error: Could not retrieve data. Please try again.";
    }
} else {
    header("location: /index");
}
?>
