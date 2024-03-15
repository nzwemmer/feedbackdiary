<?php
session_start();
include_once "assets/framework/header.php";
?>

<form id="aboutForm" class="decor optional form-container scroll-form">
  <div class="form-inner">
    <h1 id="about_status">Changelog (current version: <?php echo $_SESSION['version']; ?>)</h1>
    <p> <?php include_once "assets/framework/changelog_content.php" ?> </p>
    <button type="submit" class="neutral">Back home</button>
  </div>
</form>

<script src="assets/js/next_form.js"></script>
<?php include_once "assets/framework/footer.php"; ?>
</body>
</html>