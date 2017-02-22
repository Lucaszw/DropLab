var SVGReader = function(selector){
  var self = this;

  self.activePixels = new Array();
  self.activePixelsUpdatedEvent = new Event('activePixelsUpdated');
  self.selector = selector;

  self.addListeners = function(){
    // Track hover and click overtop of a polygon in the svg:
    $("polygon").hover(self.mouseIn,self.mouseOut);
    $("polygon").mousedown(self.click).mouseup(self.mouseIn);
  }

  self.click = function(){
    // When clicked, update which pixels are turned on
    var elec = $(this);
    var data = elec.data();
    data.on = data.on ? undefined : "on";
    elec.data(data);

    elec.css("fill",data.on ? "rgb(62, 191, 156)" : "blue");

    self.updateActive();
    self.dispatchActivePixels();
  };

  self.dispatchActivePixels = function(){
    var evnt = self.activePixelsUpdatedEvent;
    evnt.data = self.activePixels;
    $(self.selector)[0].dispatchEvent(evnt);
  };

  self.load = function(){
    // On load, draw the svg file stored in the devices folder
    // TODO : Should by dynamic

    var xhr = new XMLHttpRequest();
    xhr.open("GET","/static/devices/simple.svg",false);
    xhr.overrideMimeType("image/svg+xml");
    xhr.send("");

    $(self.selector).html(xhr.responseXML.documentElement);
    self.addListeners();
  };

  self.mouseIn = function(){$(this).css("opacity","0.5");};
  self.mouseOut = function(){$(this).css("opacity","1");}

  self.setActive = function(pixels) {
    self.turnOffAllPixels();

    let selected = _.filter($("polygon"), function(p){
      return _.contains(pixels, $(p).data().channels);
    });

    _.each(selected, function(p){
      let elec = $(p);
      let data = elec.data();
      data.on = "on";

      elec.css("fill","rgb(62, 191, 156)");
      elec.data(data);
    });

  };

  self.turnOffAllPixels = function(){
    _.each($("polygon"), function(p){
      let elec = $(p);

      let data = elec.data();
      data.on = undefined;

      elec.css("fill","blue");
      elec.data(data);

    });

    self.updateActive();
  };

  self.updateActive = function(){
    // Send an event indicating the pixels currently on need updating
    var polygons = _.filter($("polygon"), function(p){return $(p).data().on == "on"});
    self.activePixels = _.map(polygons, function(p){return $(p).data().channels});
  };

};

module.exports = SVGReader;
