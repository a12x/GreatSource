var getTitle = function() {
  return $('table:eq(2) b').text();
}

var getCourse = function() {
  return getTitle().split('-')[0].trim();
}

var getTerm = function() {
  return getTitle().split('-')[1].trim();
}

var getID = function() {
  return getCourse() + getTerm();
}

var getKey = function() {
  return getID();
}

var getSecretNumber = function(callback) {
  chrome.storage.sync.get('mycourses', function(result) {
    if (result['mycourses'] && result['mycourses'][getKey()]) {
      callback(result['mycourses'][getKey()]['secretNumber']);
    } else {
      callback(0);
    }
  });
}

var setSecretNumber = function(secretNumber, callback) {
  chrome.storage.sync.get('mycourses', function(result) {
    var courses = result['mycourses'] ? result['mycourses'] : {};
    courses[getKey()] = {
      secretNumber: secretNumber,
      url: document.URL,
      name: getCourse(),
      percent: getPercent($('body'), secretNumber),
      percentile: getPercentile($('body'), secretNumber)
    };
    chrome.storage.sync.set({'mycourses': courses}, function() {
      callback();
    });
  });
}

// update the highlighted row and scroll to it
var update = function() {
  getSecretNumber(function(mySecretNumber) {
    $('table:eq(3) tr:gt(2)').each(function() {
      var secretNumber = $(this).find('td:eq(0)');

      var link = $('<a>',{
        text: secretNumber.text(),
        href: '#',
        class: 'secretnumber',
        click: function() { setSecretNumber(secretNumber.text(), update); return false; }
      });
      
      secretNumber.children().replaceWith(link);
      
      if (secretNumber.text() === mySecretNumber) {
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
  });
}

if (window.location.pathname === "/") {
  $('body').append(' \
    <div class="footer-right"> \
      <a href="/home" class="footer-link">New Home</a> \
    </div>'
  );
}

// if we're on a course standings page
if (getTitle().indexOf('Standings') != -1) {
  update();
}
