<?php 
session_start();

if (!($_SERVER['REQUEST_METHOD'] === 'POST') || isset($_SESSION['token'])) {
    header('Location: /index');
} else {
    include_once 'connect.php';
    $token = $_POST['token'];
    $enteredPassword = $_POST['password'];

    // A little joke :)
    if ($_POST['token'] == "admin" && $_POST['password'] == "admin") {
        echo "Nice try :)  ";
    }

    // Establish a PDO database connection
    try {
        $pdo = new PDO($dsn, $dbusername, $dbpassword);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        // Retrieve the hashed password from the database
        $statement = $pdo->prepare("SELECT password, admin FROM users WHERE token = :token");
        $statement->bindParam(':token', $token);
        $statement->execute();

        $row = $statement->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            $storedPassword = $row['password'];

            // Compare the entered hashed password with the stored hashed password
            if (password_verify($enteredPassword, $storedPassword)) {
                // Passwords match, log the user in
                // Perform any additional login actions here

                // Set a session or cookie to indicate that the user is logged in
                $_SESSION['token'] = $token;

                // Update the last activity timestamp
                $_SESSION['LAST_ACTIVITY'] = time();

                if ($row['admin']) {
                    $_SESSION['admin'] = true;
                    echo "Admin access granted.";
                } else {
                    // Redirect the user to a logged-in page
                    echo "Credentials accepted!";
                }
            } else {
                // Passwords do not match, display an error message or perform any necessary actions
                echo "Error: Incorrect password. Try again.";
            }
        } else {
            // User not found, display an error message or perform any necessary actions
            echo "Error: Incorrect token. Please enter your personal token.";
        }
    } catch (PDOException $e) {
        echo "Error: Could not connect to database. Please try again later.";
    }
}
?>