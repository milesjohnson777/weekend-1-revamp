$(document).ready(function() {
    initEvents();
    getData();
});
var yearlySalaryExpense = 0;
var salaryExpense = 0;
var salaryArray = {};
var globalData;
var values = {};

function initEvents(){
    $('#submit-button').on('click', getFormData);
    $('.output-container').on('click', '.delete', deleteTask);
}
function getFormData() {
      event.preventDefault();
      $.each($('#employeeForm').serializeArray(), function(i, field){
          values[field.name] = field.value;
      });
    $('#employeeForm').find('input[type=text]').val('');
      postData(values);
      getData();
}
function postData() {
    $.ajax({
        type: 'POST',
        url: '/employees',
        data: values,
        success: function(data) {
            if(data) {
                console.log(data);
                getData();
            } else {
                console.log('error');
            }
        }
    });
}
function getData() {
    $.ajax({
        type: 'GET',
        url: '/employees',
        success: function(data) {
            appendDom(data);
        }
    });
}
function appendDom(empData){
  yearlySalaryExpense = 0;
  $('.output-container').empty();
  empData.forEach(function(employee){
    $('.output-container').append('<p>' + employee.lastname + ', ' + employee.firstname + ': ' + employee.emp_id
      + ', ' + employee.title + ', ' + employee.salary + ' <button data-id="' + employee.id + '" class="delete">Delete</button> ' + '<p>');
    yearlySalaryExpense += parseInt(employee.salary);
  });
  salaryExpense = yearlySalaryExpense/12;
  appendSalaryExpense();
}
function appendSalaryExpense(){
  $('.monthly-total-comp').empty();
  $('.monthly-total-comp').text('$' + salaryExpense + ' per month');
}
function deleteTask() {
    var deleteTask = {};
    deleteTask.id = $(this).data('id');
    $.ajax({
        type: 'DELETE',
        url: '/deleteTask',
        data: deleteTask,
        success: function(data) {
            if(data) {
                console.log(data);
                getData();
            } else {
                console.log('error');
            }
        }
    });
}
