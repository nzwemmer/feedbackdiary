<?php
// Generate the dynamic content for the changelog

$changelogContent = '<h1> v1.4 (August 14th, 2023) </h1>';
$changelogContent .= '<p>Styling, feature improvements and bugfixes:</p>';
$changelogContent .= '<ul class="fa-list">';
$changelogContent .= '<li class="fa-file-circle-plus"> Updated for use with KNP course (Bachelor Psychobiologie). </li>';
$changelogContent .= '<li class="fa-file-circle-plus"> Updated for use with SSVT course (Master Software Engineering). </li>';
$changelogContent .= '<li class="fa-file-circle-plus"> Altered some database designs. </li>';
$changelogContent .= '<li class="fa-file-circle-plus"> Constructed first version of admin panel. </li>';
$changelogContent .= '<li class="fa-brush"> Even more style improvements and bugfixes based on your feedback. Thank you!</li>';
$changelogContent .= '</ul>';

$changelogContent .= '<h1> v1.3 (June 14th, 2023) </h1>';
$changelogContent .= '<p>Styling, feature improvements and bugfixes:</p>';
$changelogContent .= '<ul class="fa-list">';
$changelogContent .= '<li class="fa-face-laugh-wink"> You can now additionally convey how you felt during the day with the simple push of a button. </li>';
$changelogContent .= '<li class="fa-comments"> Log in with your group for reflecting on SWEBOK. Login credentials provided by your coach.</li>';
$changelogContent .= '<li class="fa-brush"> Style improvements and bugfixes based on your feedback. Thank you!</li>';
$changelogContent .= '</ul>';

$changelogContent .= '<h1> v1.2 (June 12th, 2023) </h1>';
$changelogContent .= '<p>Feedback history:</p>';
$changelogContent .= '<ul class="fa-list">';
$changelogContent .= '<li class="fa-filter"> Adjust your view with the fields you are interested in. </li>';
$changelogContent .= '<li class="fa-clock"> Customize your entry timestamp. You can now catch up if you missed a day (or more)!</li>';
$changelogContent .= '</ul>';

$changelogContent .= '<h1> v1.1 (June 8th, 2023) </h1>';
$changelogContent .= '<p>Feedback history:</p>';
$changelogContent .= '<ul class="fa-list">';
$changelogContent .= '<li class="fa-clock-left"> You can now view previous submissions.</li>';
$changelogContent .= '<li class="fa-book"> Use these submissions as a diary/log for final report.</li>';
$changelogContent .= '</ul>';

$changelogContent .= '<h1> v1.0 (June 5th, 2023) </h1>';
$changelogContent .= '<p> Initial launch.</p>';

echo $changelogContent;
?>