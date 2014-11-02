


if (Meteor.isClient) {
  Beers = new Meteor.Collection("beers", {
    transform: function(beer) {
      beer.votes = beer.up_votes - beer.down_votes;
      return beer;
    }
  });
  Meteor.subscribe("beers");

  Establishments = new Meteor.Collection("establishments");
  Meteor.subscribe("establishments");

  Session.setDefault('selected_establishment_id', null);

  function get_current_establishment () {
    if (Session.get('selected_establishment_id')){
      var id = Session.get('selected_establishment_id');
      return Establishments.findOne({_id: id});
    }
    return null;
  }

  /*
   * Beers list
   */
  Template.beers.beers = function () {
    var beers = [];
    if (this._id){
      beers = Beers.find(
        {"places": {$in: [this._id]}},
        {sort: {rank: "desc"}}).fetch();
    }
    return beers;
  };

  Template.beers.humanize = function (timestamp){
    // var time = new moment(timestamp);
    return "???";
  };

  Template.beers.events({
    'click .add' : function () {
      var name = $("input[name='name']").val();
      var brewery = $("input[name='brewery']").val();
      Meteor.call('addBeer', name, brewery, this._id);

      // var beer = Beers.findOne({"name": name, "brewery": brewery});
      // // var current_establishment = get_current_establishment();
      // if (this._id) {
      //   if (!beer){
      //     beer = {
      //       "name": name,
      //       "brewery": brewery,
      //       "place": this._id,
      //       "up_votes": 0,
      //       "down_votes": 0}
      //     // beer._id = Beers.insert(beer);
      //   }
      //   Establishments.update(
      //     {_id: this._id},
      //     {$push: {beers: beer._id}});
      // }
      // else {
      //   console.log("Warning: no current establishment");
      // }
    },
    'click .remove' : function () {
      Beers.remove(this._id);
    },
    'click .vote-up' : function (e) {
      Beers.update(this._id, {$inc: {"up_votes": 1}});
      e.stopPropagation();
    },
    'click .vote-down' : function (e) {
      Beers.update(this._id, {$inc: {"down_votes": 1}});
      e.stopPropagation();
    },
  });
  /* End of beers list */

}

if (Meteor.isServer) {

  function hot(ups, downs, timestamp_ms) {
    // Algorithm borrowed from reddit
    // http://amix.dk/blog/post/19588
    var score = ups - downs;
    var order = Math.log(Math.max(Math.abs(score), 1), 10);
    var sign = score?score<0?-1:1:0
    var seconds = timestamp_ms * 1000;
    return order + sign * seconds / 45000;
  }

  Beers = new Meteor.Collection("beers");
  Establishments = new Meteor.Collection("establishments");

  Meteor.publish("beers", function () {
    var handle = Beers.find().observeChanges({
      // added: function (id) {
      //   // Add the created timestamp field if needed
      //   // ToDo: make this more efficient!
      //   var date = new Date();
      //   Beers.update(
      //     {_id: id, created: {$exists: false}},
      //     {$set: {created: date.getTime()}},
      //     function (err) {
      //       if (err){
      //         console.log(err);
      //       }
      //     });
      // },
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

  Meteor.publish("establishments", function(){
    return Establishments.find();
  });

  Meteor.startup(function () {
    console.log("server startup");
  });
}
