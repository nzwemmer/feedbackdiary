$(document).ready(function () {
  $("#dateInput").daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    minYear: 2023,
    autoApply: true,
    minDate: moment().format("06/05/2023"), // Set the max date to today
    maxDate: moment().format("MM/DD/YYYY"), // Set the max date to today
  });
  $("#SWEBOKdateInput").daterangepicker({
    singleDatePicker: true,
    showDropdowns: true,
    minYear: 2023,
    autoApply: true,
    minDate: moment().format("06/14/2023"), // Set the max date to today
    maxDate: moment().format("06/15/2023"), // Set the max date to today
  });
});
