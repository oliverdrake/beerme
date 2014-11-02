Meteor.methods({
  addBeer: function(name, brewery, place_id) {
    beer = Beers.findOne({"name": name, "brewery": brewery});
    if (!place_id) {
      console.log("Error: no place_id");
      return null;
    }
    if (!beer){
      Beers.insert({
        "name": name,
        "brewery": brewery,
        "places": [place_id],
        "up_votes": 0,
        "down_votes": 0,
        "created": new Date().getTime()});
      console.log("Creating", name, brewery, place_id);
    }
    else {
      console.log("Adding", name, brewery, place_id);
      Beers.update({_id: beer._id}, {$push: {places: place_id}});
    }
    return beer;
  }
})
