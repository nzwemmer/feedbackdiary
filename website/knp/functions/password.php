<?php
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    include_once 'connect.php';

    // Retrieve the password from the form
    $password = $_POST['password'];
    $confirmPassword = $_POST['password_confirm'];
    $token = $_SESSION['token_prepared'];

    // Verify if the passwords match
    if ($password !== $confirmPassword) {
        echo "Error: Passwords do not match.";
        exit;
    } elseif (empty($_POST['password']) || empty($_POST['password_confirm'])) {
        echo "Error: Password cannot be empty.";
        exit;
    } elseif (!isset($_POST['stored'])) {
        echo "Error: Please confirm that you have stored your password and token.";
        exit;
    } elseif (strlen($_POST['password']) < 8) {
        echo "Error: Password must be at least 8 characters long.";
        exit;
    } elseif (!preg_match('/^(?=.*[a-zA-Z])(?=.*\d)(?=.*\W).+$/', $_POST['password'])) {
        echo "Error: Password must contain letters, digits, and at least one special character.";
        exit;
    } else {
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    }

    try {
        $pdo = new PDO($dsn, $dbusername, $dbpassword);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "INSERT INTO users (token, password) VALUES (:token, :hashed_password)";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':token', $token);
        $stmt->bindParam(':hashed_password', $hashed_password);
        $stmt->execute();

        // Make the token definite.
        $_SESSION['token'] = $_SESSION['token_prepared'];

        // Update LAST_ACTIVITY since user now does not use login.
        $_SESSION['LAST_ACTIVITY'] = time();
        echo "Account created! Logging in..";
    } catch (PDOException $e) {
        echo "Error: General.";
    }
} else {
    header('location: index');
}
?>
