var getTitle = function() {
  return $('table:eq(2) b').text();
}

var getCourse = function() {
  return getTitle().split('-')[0].trim();
}

var getTerm = function() {
  return getTitle().split('-')[1].trim();
}

var getSecretNumber = function() {
  return "8811";
}

$('table:eq(3) tr:gt(2)').each(function() {
  var secretNumber = $(this).find('td:eq(0)');
  if (secretNumber.text() === getSecretNumber()) {
    secretNumber.addClass('highlight');
    secretNumber.siblings().addClass('highlight');
  }
});
