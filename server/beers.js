Beers = new Meteor.Collection("beers");

function hot(ups, downs, timestamp_ms) {
  // Algorithm borrowed from reddit
  // http://amix.dk/blog/post/19588
  var score = ups - downs;
  var order = Math.log(Math.max(Math.abs(score), 1), 10);
  var sign = score?score<0?-1:1:0
  var seconds = timestamp_ms * 1000;
  return order + sign * seconds / 45000;
}

Meteor.publish("beers", function () {
  var handle = Beers.find().observeChanges({
    changed: function (id, fields) {
      // Update the rank of this beer
      beer = Beers.findOne({_id: id});
      Beers.update(
        {_id: id},
        {$set: {rank: hot(beer.up_votes, beer.down_votes, beer.created)}},
        function (err) {
          if (err){
            console.log(err);
          }
        });
    }
  });
  return Beers.find();
});


Meteor.methods({
  addBeer: function(rawData, templateData) {
    console.log("Skipping addBeer() server side");
  }
})
