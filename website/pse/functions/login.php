<?php 
session_start();

if (!($_SERVER['REQUEST_METHOD'] === 'POST') || isset($_SESSION['user_token'])) {
    header('Location: /index');
} else {
    include_once 'connect.php';
    $user_token = $_POST['user_token'];
    $enteredPassword = $_POST['password']; // Replace 'password' with the name of your password input field
    // Store the password hash and salt in the database
    if ($_POST['user_token'] == "admin" && $_POST['password'] == "admin") {
        echo "Nice try :)  ";
    }
    // Establish a PDO database connection
    try {
        $pdo = new PDO($dsn, $dbusername, $dbpassword);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        // Retrieve the hashed password and salt from the database
        $statement = $pdo->prepare("SELECT password_hash, salt, admin FROM users WHERE user_token = :user_token");
        $statement->bindParam(':user_token', $user_token);
        $statement->execute();

        $row = $statement->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            $storedHashedPassword = $row['password_hash'];
            $storedSalt = $row['salt'];

            // Generate the hash of the entered password using the stored salt
            $enteredHashedPassword = hash('sha256', $enteredPassword . $storedSalt);

            // Compare the entered hashed password with the stored hashed password
            if ($enteredHashedPassword === $storedHashedPassword) {
                // Passwords match, log the user in
                // Perform any additional login actions here

                // Set a session or cookie to indicate that the user is logged in
                $_SESSION['user_token'] = $user_token;

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