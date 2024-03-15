<?php
session_start();
if (isset($_SESSION["token"])) {
    header('Location: index');
} else {
  include_once "assets/framework/header.php";
?>

<script src="assets/js/popup.js"> </script>
  <form id="consentForm" class="decor optional">
    <?php include_once "assets/forms/consent.php"; ?>
  </form>

  <form id="generalTokenForm" class="decor optional" style="display: none;">
    <?php include_once "assets/forms/token.php";?>
  </form>

  <form id="passwordForm" class="decor optional" style="display: none;">
    <div class="form-left-decoration optional"></div>
    <div class="form-right-decoration optional"></div>
    <div class="circle optional"></div>
    <div class="form-inner">
      <h1 id="password_status"></h1>
      <h1> Your personal token is: <span id="personal_token"></span> <span style="font-size: 12px;" id="copy">(click here to copy)<span></h1>
      <h2>Please provide a password. </h2> <h3 class="warningLogo">Store the personal token and password well, as they are not recoverable!</h3>
      <input type="password" name="password" placeholder="Password...">
      <input type="password" name="password_confirm" placeholder="Confirm Password...">
      <div style="margin-bottom: 10px;">
      <label>
        <input type="checkbox" id="stored" name="stored"></input>
        <span class="checkbox-custom" style="margin-left: 1%;"></span>I have stored my credentials securely.
      </label>
    </div>
      <button type="submit" class="neutral">Continue</button>
    </div>
  </form>

<script src="assets/js/copy_on_click.js"></script>

<div id="popupContainer" class="decor popup">
  <div id="popupContent">
    <h1 id="popupMessage">Popup Message</h1>
    <button id="popupDismiss" class="neutral">
      <i class="fas fa-times"></i>
    </button>
    <label>
      <input type="checkbox" id="popupToggle" />
      <span class="checkbox-custom"></span>Do not show again
    </label>
  </div>
</div>
<?php

}
?>
<script src="assets/js/next_form.js"></script>
<?php include_once "assets/framework/footer.php"; ?>

</body>
</html>
