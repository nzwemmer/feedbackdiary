        <?php
            session_start();
            include_once "assets/framework/header.php";
        ?>

        <script>
            function redirectToURL(url) {
                window.location.href = url;
            }
        </script>

            <!-- Course Select form -->
            <form id="courseSelectForm" class="decor optional form-container">
                <?php include_once "assets/forms/course_select.php"; ?>
            </form>

        <!-- Footer -->
        <?php include_once "assets/framework/footer.php"; ?>
    </body>
</html>
