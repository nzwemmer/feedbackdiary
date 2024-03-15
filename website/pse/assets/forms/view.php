<div style="max-height: 100vh;" class="form-inner">
<?php if (isset($_SESSION['admin'])) { ?>
    <h1>Submissions</h1>
<?php } else { ?>
    <h1>History</h1>
<?php } ?>
    <button type="submit" class="neutral fetch_status_button"><i class="fa-solid fa-eye"></i> show</button>
    <h1 id="fetch_status" class="fetch_status_class" style="overflow-y: scroll; max-height: 500px; width: 100%;"></h1>
    <div id="fetch_buttons" class="fetch_buttons_class" style="display: none;">
    <button id="showAll" class="all_button" style="display: inline-block; margin-right: 10px; width: 10%">
      <i class="fa-solid fa-eye"></i> <i class="fa-solid fa-reply-all"></i>
    </button>
    <?php if (isset($_SESSION['admin'])) { 
      echo '<button id="showToken" class="token_button" style="display: inline-block; margin-right: 10px; width: 10%">
      <i class="fa-solid fa-eye-slash"></i> <i class="fa-solid fa-user"></i>
    </button>'; 
    echo '<button id="showGroups" class="group_button" style="display: inline-block; margin-right: 10px; width: 10%">
    <i class="fa-solid fa-eye-slash"></i> <i class="fa-solid fa-users"></i>
  </button>';
      }
    ?>
    <button id="showTime" class="time_button" style="display: inline-block; margin-right: 10px; width: 10%">
      <i class="fa-solid fa-eye-slash"></i> <i class="fa-solid fa-clock"></i>
    </button>
    <button id="showPositive" class="pos_button" style="display: inline-block; margin-right: 10px; width: 10%">
      <i class="fa-solid fa-eye-slash"></i> <i class="fa-solid fa-thumbs-up positive"></i>
    </button>
    <button id="showNegative" class="neg_button" style="display: inline-block; margin-right: 10px; width: 10%">
      <i class="fa-solid fa-eye-slash"></i> <i class="fa-solid fa-thumbs-down negative"></i>
    </button>
    <button id="showAdditional" class="add_button" style="display: inline-block; margin-right: 10px; width: 10%">
      <i class="fa-solid fa-eye-slash"></i> <i class="fa-solid fa-circle-question additional"></i>
    </button>
    <button id="showEmotion" class="emotion_button" style="display: inline-block; margin-right: 10px; width: 10%">
      <i class="fa-solid fa-eye-slash"></i> <i class="fa-regular fa-face-laugh-wink emotion"></i>
    </button>
    </div>
  </div>

