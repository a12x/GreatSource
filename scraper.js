var getGradeTable = function(html) {
  return html.find('table:contains("Secret Number") tr:gt(2)');
}

var getEnrolledCount = function(html) {
  return getGradeTable(html).length;
}

var getRank = function(html, mySecretNumber) {
  var rank = 0;
  var lastScore = -1;

  getGradeTable(html).each(function(index, elem) {
    var secretNumber = $(elem).find('td:eq(0)').text();
    var score = $(elem).find('td:eq(-1)').text();

    if (lastScore !== score) {
      lastScore = score;
      rank = index+1;
    }

    if (secretNumber == mySecretNumber)
      return false;
  });

  return rank;
}

var getPercent = function(html, mySecretNumber) {
  var score = -1;

  getGradeTable(html).each(function(index, elem) {
    var secretNumber = $(elem).find('td:eq(0)').text();
    score = $(elem).find('td:eq(-1)').text();

    if (secretNumber == mySecretNumber)
      return false;
  });

  return parseInt(score) + '%';
}

var getPercentile = function(html, mySecretNumber) {
  var percent = 1-getRank(html, mySecretNumber)/getEnrolledCount(html);
  percent = percent * 100;
  percent = parseInt(percent)
  switch (percent % 10) {
    case 3:
      percent += 'rd';
      break;
    case 2:
      percent += 'nd';
      break;
    case 1:
      percent += 'st';
      break;
    default:
      percent += 'th';
      break;
  }
  return percent + ' percentile';
}
