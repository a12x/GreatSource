$('body').hide();

chrome.storage.sync.get('mycourses', function(result) {
  if ($.isEmptyObject(result)) {
    $('body').fadeIn(0);
    $('#add-another').hide();
    return;
  }

  $('.great-table').empty();

  var keys = Object.keys(result['mycourses']);

  var sorted = keys.sort(function(a, b) {
    var aName = result['mycourses'][a]['name'];
    var bName = result['mycourses'][b]['name'];
    return aName.match(/\d+/)[0] - bName.match(/\d+/)[0];
  });

  $.each(sorted, function(i, k) {
    var v = result['mycourses'][k];
    $('.great-table').append(
      '<tr>' +
        '<td class="course"><a href="' + v['url'] + '" class="great-link">' + v['name'] + '</a></td>' +
        '<td class="' + getClassForPercentile(v['percent']) + '">(' + v['percent'] + ')</td>' +
        '<td class="percentile">' + v['percentile'] + '</td>' +
      '</tr>'
    );
  });

  $('body').fadeIn(0);
});

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
