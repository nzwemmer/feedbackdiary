<?php 
session_start();

$_SESSION = array();
// Destroy the session
session_destroy();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    echo "Logged out successfully!";
} else {
    header('Location: index');
}

?>