var getTitle = function() {
  return $('table:eq(2) b').text();
}

var getCourse = function() {
  return getTitle().split('-')[0].trim();
}

var getTerm = function() {
  return getTitle().split('-')[1].trim();
}

var secret = "8489";

var getSecretNumber = function() {
  return secret;
}

var setSecretNumber = function(secretNumber) {
  secret = secretNumber;
  update();
}

var update = function() {
  $('table:eq(3) tr:gt(2)').each(function() {
    var secretNumber = $(this).find('td:eq(0)');

    var link = $('<a>',{
      text: secretNumber.text(),
      href: '#',
      class: 'secretnumber',
      click: function() { setSecretNumber(secretNumber.text()); return false; }
    });
    
    secretNumber.children().replaceWith(link);
    
    if (secretNumber.text() === getSecretNumber()) {
      secretNumber.addClass('highlight');
      secretNumber.siblings().addClass('highlight');

      var viewportHeight = document.body.clientHeight;
      var secretNumberHeight = secretNumber.offset().top;
      var offset = secretNumberHeight - viewportHeight/2;

      $('html, body').animate({scrollTop:offset}, 1);
    } else {
      secretNumber.removeClass('highlight');
      secretNumber.siblings().removeClass('highlight');
    }
  });
}

update();
