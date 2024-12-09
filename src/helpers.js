const { differenceInSeconds } = require("date-fns");

function getSecondsSinceTime(time) {
  const secondsSinceCreated = Math.abs(differenceInSeconds(
    new Date(time),
    new Date()
  ))

  return secondsSinceCreated;
}

// descending sorting
function compare( a, b ) {
  if ( (a.totalLikes + a.totalDislikes) < (b.totalLikes + b.totalDislikes) ){
    return 1;
  }
  if ( (a.totalLikes + a.totalDislikes) > (b.totalLikes + b.totalDislikes) ){
    return -1;
  }
  return 0;
}

module.exports = {getSecondsSinceTime, compare}
