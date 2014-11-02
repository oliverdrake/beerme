/*
 * Establishments (bar, brewpub, bottlestore) list
 */
Template.places.establishments = function () {
  return Establishments.find().fetch();
};

// Template.places.selected = function () {
//   return Session.equals('selected_establishment_id', this._id) ? 'selected' : '';
// };

Template.places.events({
  'click .add' : function () {
    var name = $("input[name='bar']").val();
    if (!Establishments.findOne({"name": name})){
      Establishments.insert({
        "name": name,
        "beers": [],
      })
    }
  },
  'click .remove' : function () {
    Establishments.remove(this._id);
  },
  'click .establishment' : function () {
    Session.set('selected_establishment_id', this._id);
  }
});
/* End of establishments */
