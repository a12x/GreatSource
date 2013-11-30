var getTitle = function() {
	return $('table:eq(2) b').text();
}

var getCourse = function() {
  return getTitle().split('-')[0].trim();
}

var getTerm = function() {
  return getTitle().split('-')[1].trim();
}

console.log(getCourse());
console.log(getTerm());