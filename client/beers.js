
/*
 * Beers currently available at one or more places
 */
Beers = new Meteor.Collection("beers", {
  transform: function(beer) {
    beer.votes = beer.up_votes - beer.down_votes;
    return beer;
  }
});
Meteor.subscribe("beers");

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
  // 'click .add' : function () {
  //   var name = $("input[name='name']").val();
  //   var brewery = $("input[name='brewery']").val();
  //   Meteor.call('addBeer', name, brewery, this._id);
  // },
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

// Meteor.methods({
//   newBeer: function(rawData, templateData) {
//     console.log("hi there");
//     Mesosphere.beerForm.validate(rawData, function(errors, fields){
//       console.log(errors);
//       if (!errors){
//         var beer = Meteor.call("addBeer", fields.name, fields.brewery, fields.placeId);
//         console.log(beer);
//       }
//     });
//   }
// });


Beers.attachSchema(new SimpleSchema({
  name: {
    type: String,
    label: "name",
    min: 1,
    max: 200
  },
  brewery: {
    type: String,
    label: "brewery",
    min: 1,
    max: 200
  },
  placeId: {
    type: "hidden",
    label: "placeId"
  }
}));

AutoForm.hooks({
  insertBeerForm: {
    before: {
      insert: function(error, result, template) {
        console.log("hey there!");
      }
    },
    after: {
      insert: function(error, result, template) {
        console.log("hey there!");
      }
    }
  }
})

UI.registerHelper("beerCollection", Beers);

//
//
// Mesosphere({
//     name:"beerForm",
//     template:"place",
//     method:"addBeer",
//     fields:{
//         name: {
//             required: true,
//             message: "Name of the beer",
//             transform: ["trim"],
//             rules: {
//                 minLength:1,
//                 maxLength:200
//             }
//         },
//         brewery: {
//             required: true,
//             message: "Name of the brewery",
//             rules: {
//                 minLength:1,
//                 maxLength:200
//             }
//         },
//         placeId: {
//           required: true,
//         }
//     },
//     onFailure: function(erroredFields, formHandle) {
//       console.log("oh no");
//       Mesosphere.Utils.failureCallback(erroredFields, formHandle);
//     },
//     onSuccess: function(data) {
//       console.log("yay: " + data);
//     }
// });
//
//
// Meteor.methods({
//   addBeer: function(rawData, templateData) {
//     console.log("hi");
//     Mesosphere.beerForm.validate(rawData, function(errors, fields) {
//       if (!errors) {
//         console.log("adding beer...");
//         if (!fields.placeId) {
//           console.log("Error: no placeId");
//           return null;
//         }
//         beer = Beers.findOne({"name": fields.name, "brewery": fields.brewery});
//         if (!beer){
//           beer = Beers.insert({
//             "name": fields.name,
//             "brewery": fields.brewery,
//             "places": [fields.placeId],
//             "up_votes": 0,
//             "down_votes": 0,
//             "created": new Date().getTime()});
//           console.log("Creating", fields.name, fields.brewery, fields.placeId);
//         }
//         else {
//           console.log("Adding", fields.name, fields.brewery, fields.placeId);
//           Beers.update({_id: beer._id}, {$push: {places: fields.placeId}});
//         }
//         return beer;
//       }
//       return null;
//
//
//     });
//
//
//   }
// });


/* End of beers */
