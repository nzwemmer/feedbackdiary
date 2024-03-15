<?php
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    include_once 'connect.php';

    // Retrieve the password from the form
    $password = $_POST['password'];
    $confirmPassword = $_POST['password_confirm'];
    $user_token = $_SESSION['user_token_prepared'];

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
    }

    // Generate a random salt
    $salt = bin2hex(random_bytes(16));

    // Create the salted password hash
    $saltedPassword = $password . $salt;
    $hashedPassword = hash('sha256', $saltedPassword);

    try {
        $pdo = new PDO($dsn, $dbusername, $dbpassword);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "INSERT INTO users (user_token, password_hash, salt) VALUES (:user_token, :password_hash, :salt)";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':user_token', $user_token);
        $stmt->bindParam(':password_hash', $hashedPassword);
        $stmt->bindParam(':salt', $salt);
        $stmt->execute();

        // Make the token definite.
        $_SESSION['user_token'] = $_SESSION['user_token_prepared'];

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
