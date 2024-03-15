<?php
session_start();

$course = $_SESSION["course"];
$course_short = $_SESSION["course_short"];
$year = $_SESSION["year"];
$programme = $_SESSION["programme"];

// Generate the dynamic content for the popup message
$popupContent = '<div class="fa-popuptext">';
$popupContent .= '<h1> Welcome to FeedbackDiary! </h1>';
$popupContent .= 'And first of all, welcome also to ' . $course . " " . $year . '! </br> Second of all: thank you for helping me with my thesis! </br> Please take some time to carefully read these instructions.';
$popupContent .= '<h1 id="warningMobile"></h1>';
$popupContent .= '<p>Sign up:</p>';
$popupContent .= '<ul class="fa-list">';
$popupContent .= '<li class="fa-key"> Use provided general token.</li>';
$popupContent .= '<li class="fa-user-plus"> A personal access token will be generated.</li>';
$popupContent .= '<li class="fa-unlock-keyhole"> Choose a password.</li>';
$popupContent .= '<li class="fa-triangle-exclamation"> Password and personal token are not recoverable.</li>';
$popupContent .= '</ul>';

$popupContent .= '<p>Describe your daily findings:</p>';
$popupContent .= '<ul class="fa-list">';
$popupContent .= '<li class="fa-thumbs-up"> One positive. </li>';
$popupContent .= '<li class="fa-thumbs-down"> One negative.</li>';
$popupContent .= '<li class="fa-question"> An optional remark. </li>';
$popupContent .= '<li class="fa-globe"> English works best, Dutch is allowed. </li>';
$popupContent .= '<li class="fa-triangle-exclamation"> Direct feedback not required, but possible.</li>';
$popupContent .= '</ul>';

$popupContent .= '<p>Entry feedback extraction:</p>';
$popupContent .= '<ul class="fa-list">';
$popupContent .= '<li class="fa-calendar-week"> Your entries are processed daily. </li>';
$popupContent .= '<li class="fa-investigate"> Extracted by both me and A.I. </li>';
$popupContent .= '<li class="fa-triangle-exclamation"> Entries are not modifiable. Please keep this in mind. </li>';
$popupContent .= '</ul>';

$popupContent .= '<p>Feedback processing:</p>';
$popupContent .= '<ul class="fa-list">';
$popupContent .= '<li class="fa-comments"> Discussed weekly with ' . $course_short . ' staff.</li>';
$popupContent .= '<li class="fa-bolt-lightning"> Applicable solutions immediately processed.</li>';
$popupContent .= '<li class="fa-database"> Otherwise, feedback stored for later processing.</li>';
$popupContent .= '<li class="fa-code-compare"> Compared with general course feedback. </li>';
$popupContent .= '</ul>';

$popupContent .= '<span class="new-feature-icon"> new! </span><a href="changelog.php"> see changelog </a>';
$popupContent .= '</br></br>';
$popupContent .= 'If you want to read more on how I process your data and how I make sure this data is collected anonymously, please click <a href="about">here</a>.';
$popupContent .= '</div>';

echo $popupContent;
?>