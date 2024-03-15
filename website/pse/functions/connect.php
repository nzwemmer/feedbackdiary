<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $dbservername = "localhost";
    $dbusername = "niels";
    $dbpassword = getenv('DB_PASS');
    $dbdatabase = "pse_submissions";
    $dsn = "mysql:host=$dbservername;dbname=$dbdatabase;charset=utf8";
} else {
    header("location: /index");
}
?>
