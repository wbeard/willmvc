define('classes/ClassListenable', ['classes/Base', 'modules/PubSub'], function(Base, PubSub) {
  var listenableClass = new Base();
  listenableClass.include(PubSub);
  return listenableClass;
});