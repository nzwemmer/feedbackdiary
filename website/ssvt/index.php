<?php
session_start();
include_once "assets/framework/header.php";

if (isset($_SESSION["admin"])) {
    ?>
    <!-- Download form -->
    <form id="downloadForm" class="decor optional">
        <?php include_once "assets/forms/download.php"; ?>
    </form>

    <!-- View form -->
    <form id="viewForm" class="decor optional">
        <?php include_once "assets/forms/view.php"; ?>
    </form>

    <!-- Logout form -->
    <form id="logoutForm" class="decor hidden">
        <?php include_once "assets/forms/logout.php"; ?>
    </form>

    <!-- Admin panel form -->
    <form id="adminPanelForm" class="decor hidden">
        <?php include_once "assets/forms/adminpanel.php"; ?>
    </form>

    <!-- Admin form switcher JS. Only show when admin logged in. -->
    <script src="assets/js/switch_forms_admin.js"></script>

    <!-- Add radio buttons to select the form -->
    <div class="pre-footer">
        <label>
            <input type="radio" name="form_selection" value="download" checked>
            <span>Download</span>
        </label>
        <label>
            <input type="radio" name="form_selection" value="view">
            <span>View</span>
        </label>
        <label>
            <input type="radio" name="form_selection" value="panel">
            <span>Panel</span>
        </label>
        <label>
            <input type="radio" name="form_selection" value="logout">
            <span>Quit</span>
        </label>
    </div>
<?php
} else if (isset($_SESSION["token"])) {
?>
    <!-- Script for session expiry check -->
    <script src="assets/js/session_expiry.js"></script>

    <!-- Script for picking a different date for submission -->
    <script src="https://cdn.jsdelivr.net/npm/jquery"></script>
    <script src="https://cdn.jsdelivr.net/npm/moment"></script>
    <script src="https://cdn.jsdelivr.net/npm/daterangepicker"></script>
    <script src="assets/js/daterangepicker.js"></script>

    <!-- Diary form -->
    <form id="diaryForm" class="decor diaryFade">
        <?php     
            if (str_contains($_SESSION["token"], "group")) {
                include_once "assets/forms/diary_SWEBOK.php";
            } else {
                include_once "assets/forms/diary.php"; 
            }
        ?>
    </form>

    <!-- Fetch form -->
    <form id="viewForm" class="decor hidden">
        <?php include_once "assets/forms/view.php"; ?>
    </form>

    <!-- Logout form -->
    <form id="logoutForm" class="decor hidden">
        <?php include_once "assets/forms/logout.php"; ?>
    </form>

    <!-- Form switcher JS. Only show when logged in. -->
    <script src="assets/js/switch_forms.js"></script>

    <!-- Add radio buttons to select the form -->
    <div class="pre-footer">
        <label>
            <input type="radio" name="form_selection" value="diary" checked>
            <span>Diary entry</span>
        </label>
        <label>
            <input type="radio" name="form_selection" value="history">
            <span>History</span>
            <span class="new-feature-icon"> new!</span>
        </label>
        <label>
            <input type="radio" name="form_selection" value="logout">
            <span>Quit</span>
            <span class="new-feature-icon"> new!</span>
        </label>
    </div>
    <?php
} else {
    ?>
    <!-- Popupcontainer -->
    <div id="popupContainer" class="decor popup">
        <div id="popupContent">
            <h1 id="popupMessage"></h1>
            <button id="popupDismiss" class="neutral">
                <i class="fas fa-times"></i>
            </button>
            <label>
                <input type="checkbox" id="popupToggle" />
                <span class="checkbox-custom"></span>Do not show again
            </label>
        </div>
    </div>

    <!-- Popup JS. -->
    <script src="assets/js/popup.js"></script>
    <script src="assets/js/fadeLogin.js"></script>

    <!-- Login form -->
    <form id="loginForm" class="decor optional form-container">
        <?php include_once "assets/forms/login.php"; ?>
    </form>

    <!-- "Need some help?" JS -->
    <script src="assets/js/help.js"></script>
    <?php
}
?>

<!-- Next form JS. -->
<script src="assets/js/next_form.js"></script>

<!-- Footer -->
<?php include_once "assets/framework/footer.php"; ?>
</body>
</html>
