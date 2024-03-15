<?php
session_start();

if (!($_SERVER['REQUEST_METHOD'] === 'POST') || isset($_SESSION['user_token'])) {
    header('Location: /index');
} else {
    include_once 'connect.php';

    $general_token = $_POST['general_token'];
    // Establish a PDO database connection
    try {
        $pdo = new PDO($dsn, $dbusername, $dbpassword);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        // Retrieve the hashed password and salt from the database
        $statement = $pdo->prepare("SELECT general_token FROM secret WHERE general_token = :general_token");
        $statement->bindParam(':general_token', $general_token);
        $statement->execute();

        $row = $statement->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            // Generate random string
            $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()';
            $randomString = '';
            $length = 10;

            for ($i = 0; $i < $length; $i++) {
                $randomString .= $characters[rand(0, strlen($characters) - 1)];
            }

            // Check if the generated token already exists in the users table
            $userStatement = $pdo->prepare("SELECT COUNT(*) FROM users WHERE user_token = :user_token");
            $userStatement->bindParam(':user_token', $randomString);
            $userStatement->execute();
            
            $userRow = $userStatement->fetchColumn();
            
            // Generated token already exists, generate a new one
            // Repeat the process until a unique token is generated
            while ($userRow) {
                $randomString = '';
                for ($i = 0; $i < $length; $i++) {
                    $randomString .= $characters[rand(0, strlen($characters) - 1)];
                }
                
                $userStatement->bindParam(':user_token', $randomString);
                $userStatement->execute();
                $userRow = $userStatement->fetchColumn();
            }

            $_SESSION['user_token_prepared'] = $randomString;
            echo $randomString;
        } else {
            // User not found, display an error message or perform any necessary actions
            echo "Error: Incorrect token. Please enter the general token.";
        }
    } catch (PDOException $e) {
       echo "Error: Unable to connect to database.";
    }
    
}
?>
