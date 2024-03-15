<?php
session_start();

if (isset($_SESSION['LAST_ACTIVITY']) and $_SESSION['expired']) {
    // Session expired, destroy the session and return a response indicating expiry
    session_unset();
    session_destroy();
    include_once "assets/framework/header.php";
?>

<form id="expiredForm" class="decor optional form-container">
  <div class="form-inner">
  <div class="image-container">
      <img src="assets/images/logo-large.png" alt="Logo" class="formLogo">
      <h1>For your safety, you were logged out due to inactivity. Your progress has not been saved. Please try again!</h1>
    </div>
    <button type="submit">Try again</button>
  </div>
</form>
<?php include_once "assets/framework/footer.php"; ?>
</body>
</html>
<?php
} else {
    header('location: index');
}
?>