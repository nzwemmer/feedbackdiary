<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['consent1']) and isset($_POST['consent2']) and isset($_POST['consent3']) and isset($_POST['consent4'])) {
        echo "Thank you for agreeing!";
    } else {
        echo "Error: Please agree to continue.";
    }
} else {
    header("location: /index");
}

?>