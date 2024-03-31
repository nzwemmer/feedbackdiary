$(document).ready(function () {
  var element = "";
  var hide = "";
  var show = "";

  // Show/hide the forms based on selection
  $("input[name='form_selection']").on("change", function () {
    var selectedForm = $("input[name='form_selection']:checked").val();

    if (selectedForm === "download") {
      $("#downloadForm").removeClass("hidden");
      $("#viewForm, #logoutForm").addClass("hidden");
    } else if (selectedForm === "view") {
      $("#viewForm").removeClass("hidden");
      $("#downloadForm, #logoutForm").addClass("hidden");
    } else if (selectedForm === "logout") {
      $("#logoutForm").removeClass("hidden");
      $("#viewForm, #downloadForm").addClass("hidden");
    }
  });

  // Trigger the change event initially to hide the forms and messages
  $("input[name='form_selection']:checked").trigger("change");

  // Show all fields
  $("#showAll").on("click", function (event) {
    event.preventDefault();
    toggleButtonAll(
      ".token_button",
      '<i class="fa-solid fa-eye-slash"></i> <i class="fa-solid fa-user"></i>'
    );
    toggleButtonAll(
      ".group_button",
      '<i class="fa-solid fa-eye-slash"></i> <i class="fa-solid fa-users"></i>'
    );
    toggleButtonAll(
      ".time_button",
      '<i class="fa-solid fa-eye-slash"></i> <i class="fa-solid fa-clock"></i>'
    );
    toggleButtonAll(
      ".pos_button",
      '<i class="fa-solid fa-eye-slash"></i> <i class="fa-solid fa-thumbs-up positive"></i>'
    );
    toggleButtonAll(
      ".neg_button",
      '<i class="fa-solid fa-eye-slash"></i> <i class="fa-solid fa-thumbs-down negative"></i>'
    );
    toggleButtonAll(
      ".add_button",
      '<i class="fa-solid fa-eye-slash"></i> <i class="fa-solid fa-circle-question"></i>'
    );
    toggleButtonAll(
      ".emotion_button",
      '<i class="fa-solid fa-eye-slash"></i> <i class="fa-regular fa-face-laugh-wink"></i>'
    );
    $(".token_entry").removeClass("hidden");
    $(".token_divider").removeClass("hidden");
    $(".time_entry").removeClass("hidden");
    $(".time_divider").removeClass("hidden");
    $(".pos_entry").removeClass("hidden");
    $(".pos_divider").removeClass("hidden");
    $(".neg_entry").removeClass("hidden");
    $(".neg_divider").removeClass("hidden");
    $(".add_entry").removeClass("hidden");
    $(".add_divider").removeClass("hidden");
    $(".emotion_entry").removeClass("hidden");
    $(".emotion_divider").removeClass("hidden");
  });

  // Show/hide personal token
  $("#showToken").on("click", function (event) {
    event.preventDefault();
    element = ".token_button";
    hide =
      '<i class="fa-solid fa-eye-slash"></i> <i class="fa-solid fa-user"></i>';
    show = '<i class="fa-solid fa-eye"></i> <i class="fa-solid fa-user"></i>';
    toggleButton(element, hide, show);
    $(".token_entry").toggleClass("hidden");
    $(".token_divider").toggleClass("hidden");
  });

  // Show/hide personal token
  $("#showGroups").on("click", function (event) {
    event.preventDefault();
    element = ".group_button";
    hide =
      '<i class="fa-solid fa-eye-slash"></i> <i class="fa-solid fa-users"></i>';
    show = '<i class="fa-solid fa-eye"></i> <i class="fa-solid fa-users"></i>';
    toggleButton(element, hide, show);
    $(".personal_entry").toggleClass("hidden");
    // $(".token_divider").toggleClass("hidden");
  });

  // Show/hide time
  $("#showTime").on("click", function (event) {
    event.preventDefault();
    element = ".time_button";
    hide =
      '<i class="fa-solid fa-eye-slash"></i> <i class="fa-solid fa-clock"></i>';
    show = '<i class="fa-solid fa-eye"></i> <i class="fa-solid fa-clock"></i>';
    toggleButton(element, hide, show);
    $(".time_entry").toggleClass("hidden");
    $(".time_divider").toggleClass("hidden");
  });

  // Show/hide positive messages
  $("#showPositive").on("click", function (event) {
    event.preventDefault();
    element = ".pos_button";
    hide =
      '<i class="fa-solid fa-eye-slash"></i> <i class="fa-solid fa-thumbs-up positive"></i>';
    show =
      '<i class="fa-solid fa-eye"></i> <i class="fa-solid fa-thumbs-up positive"></i>';
    toggleButton(element, hide, show);
    $(".pos_entry").toggleClass("hidden");
    $(".pos_divider").toggleClass("hidden");
  });

  // Show/hide negative messages
  $("#showNegative").on("click", function (event) {
    event.preventDefault();
    element = ".neg_button";
    hide =
      '<i class="fa-solid fa-eye-slash"></i> <i class="fa-solid fa-thumbs-down negative"></i>';
    show =
      '<i class="fa-solid fa-eye"></i> <i class="fa-solid fa-thumbs-down negative"></i>';
    toggleButton(element, hide, show);
    $(".neg_entry").toggleClass("hidden");
    $(".neg_divider").toggleClass("hidden");
  });

  // Show/hide additional messages
  $("#showAdditional").on("click", function (event) {
    event.preventDefault();
    element = ".add_button";
    hide =
      '<i class="fa-solid fa-eye-slash"></i> <i class="fa-solid fa-circle-question additional"></i>';
    show =
      '<i class="fa-solid fa-eye"></i> <i class="fa-solid fa-circle-question additional"></i>';
    toggleButton(element, hide, show);
    $(".add_entry").toggleClass("hidden");
    $(".add_divider").toggleClass("hidden");
  });

  // Show/hide emotion
  $("#showEmotion").on("click", function (event) {
    event.preventDefault();
    element = ".emotion_button";
    hide =
      '<i class="fa-solid fa-eye-slash"></i> <i class="fa-regular fa-face-laugh-wink"></i>';
    show =
      '<i class="fa-solid fa-eye"></i> <i class="fa-regular fa-face-laugh-wink"></i>';
    toggleButton(element, hide, show);
    $(".emotion_entry").toggleClass("hidden");
    $(".emotion_divider").toggleClass("hidden");
  });

  function toggleButton(element, hide, show) {
    var fetchButton = $("#viewForm").find(element);
    var currentContent = fetchButton.html().trim();
    var newContent = currentContent === show ? hide : show;
    fetchButton.html(newContent);
  }

  function toggleButtonAll(element, content) {
    var fetchButton = $("#viewForm").find(element);
    fetchButton.html(content);
  }
});
