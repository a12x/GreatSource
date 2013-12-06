$('body').hide();

chrome.storage.sync.get('mycourses', function(result) {
  $('.great-table').empty()
  $.each(result['mycourses'], function(k, v) {
    $('.great-table').append(
      '<tr>' +
        '<td class="course"><a href="' + v['url'] + '" class="great-link">' + v['name'] + '</a></td>' +
        '<td class="grade-b">(xx%)</td>' +
        '<td class="percentile">xxth percentile</td>' +
      '</tr>'
    );
  });
  $('body').fadeIn(500);;
});
