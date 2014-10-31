Router.map(function() {
  this.route('home', {path: "/", layoutTemplate: 'layout'});
  this.route('places', {path: "places", layoutTemplate: 'layout'});
  // this.route('score/:_id', {
  //   template: 'scoresheet',
  //   layoutTemplate: 'layout',
  //   data: function() { return Beers.findOne(this.params._id); }
  // });
  // this.route('reviews', {layoutTemplate: 'layout'});
  // this.route('review/:_id', {
  //   template: 'review',
  //   layoutTemplate: 'layout',
  //   data: function() {
  //     return Reviews.findOne(this.params._id);
  //   }});
});
