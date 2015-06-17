Places = new Meteor.Collection("places");

Meteor.publish("places", function(){
  return Places.find();
});

Meteor.startup(function () {
  console.log("server startup");
});
