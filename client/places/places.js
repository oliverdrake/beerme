/*
 * Places (bar, brewpub, bottlestore) list
 */
Places = new Meteor.Collection("places");
Meteor.subscribe("places");

Template.places.places = function () {
  return Places.find().fetch();
};

Template.places.events({
  'click .add' : function () {
    var name = $("input[name='bar']").val();
    if (!Places.findOne({"name": name})){
      Places.insert({
        "name": name,
        "beers": [],
      })
    }
  },
  'click .remove' : function () {
    Places.remove(this._id);
  }
});
/* End of places */
