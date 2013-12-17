if (document.title === 'GreatSource') {
  $('body').hide();

  chrome.storage.sync.get('my_courses', function(result) {
    if ($.isEmptyObject(result)) {
      $('body').fadeIn(0);
      $('#add-another').hide();
      return;
    }

    var data = result['my_courses'];

    updateTable(data);

    $('body').fadeIn(0);

    updateCourses(data);
  });
}

var updateCourses = function(data) {
  var done = Object.keys(data).length;

  $.each(data, function(i, course) {

    $.get(course['url'], function(settings) {
      html = $($.parseHTML(settings));

      data[course['key']] = {
        key: course['key'],
        secretNumber: course['secretNumber'],
        url: course['url'],
        name: course['name'],
        percent: getPercent(html, course['secretNumber']),
        percentile: getPercentile(html, course['secretNumber'])
      };

      done--;
      if (done === 0) {
        // save and update the table
        chrome.storage.sync.set({'my_courses': data}, function() {
          updateTable(data);
        });
      }
    });
  });
}

var updateTable = function(data) {
  $('.great-table').empty();

  var keys = Object.keys(data);

  var sorted = keys.sort(function(a, b) {
    var aName = data[a]['name'];
    var bName = data[b]['name'];
    return aName.match(/\d+/)[0] - bName.match(/\d+/)[0];
  });

  $.each(sorted, function(i, k) {
    var course = data[k];
    $('.great-table').append(
      '<tr>' +
        '<td class="course"><a href="' + course['url'] + '" class="great-link">' + course['name'] + '</a></td>' +
        '<td class="' + getClassForPercentile(course['percent']) + '">(' + course['percent'] + ')</td>' +
        '<td class="percentile">' + course['percentile'] + '</td>' +
      '</tr>'
    );
  });
}

var getClassForPercentile = function(percentile) {
  var number = percentile.substring(0, percentile.length - 1);
  if (number >= 90) {
    return 'grade-a';
  } else if (number >= 80) {
    return 'grade-b';
  } else if (number >= 70) {
    return 'grade-c';
  }
  return 'grade-d';
}

$('.footer-link').click(function(e) {
  chrome.storage.sync.set({showOldHomepage: "true"}, function() {
    window.location = "http://gradesource.com/";
  });
});
