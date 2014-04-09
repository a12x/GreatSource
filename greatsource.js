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
  chrome.storage.sync.get('my_courses', function(result) {
    if (result['my_courses'] && result['my_courses'][getKey()]) {
      callback(result['my_courses'][getKey()]['secretNumber']);
    } else {
      callback(0);
    }
  });
}

var toggleSecretNumber = function(secretNumber, callback) {
  chrome.storage.sync.get('my_courses', function(result) {
    var courses = result['my_courses'] ? result['my_courses'] : {};
    if (!(getKey() in courses) || courses[getKey()]["secretNumber"] != secretNumber) {
      courses[getKey()] = {
        key: getKey(),
        secretNumber: secretNumber,
        url: document.URL,
        name: getCourse(),
        percent: getPercent($('body'), secretNumber),
        percentile: getPercentile($('body'), secretNumber)
      };
    } else {
      delete courses[getKey()];
    }
    chrome.storage.sync.set({'my_courses': courses}, function() {
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
        click: function() { toggleSecretNumber(secretNumber.text(), update); return false; }
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
  $(".footer-link").click(function() {
    chrome.storage.sync.set({showOldHomepage: "false"}, function() {
      window.location = "http://gradesource.com/home";
    });
  });
  chrome.storage.sync.get('showOldHomepage', function(result) {
    if (result['showOldHomepage'] !== "true") {
      window.location = "http://gradesource.com/home";
    }
  });
}

// if we're on a course standings page
if (getTitle().indexOf('Standings') != -1) {
  update();
}
