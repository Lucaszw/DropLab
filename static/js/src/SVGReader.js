var ElectrodeColors = {
  off: "blue",
  active: "rgb(62, 191, 156)",
  constant: "rgb(158, 65, 75)"
};

var SVGReader = function(selector){
  var self = this;

  self.activePixels = new Array();
  self.contantPixels = new Array();

  self.activePixelsUpdatedEvent = new Event('activePixelsUpdated');
  self.selector = selector;

  self.addListeners = function(){
    // Track hover and click overtop of a polygon in the svg:
    $("polygon").hover(self.mouseIn,self.mouseOut);
    $("polygon").mousedown(self.click).mouseup(self.mouseIn);
  }

  self.click = function(e){
    var constClicked = (e.metaKey == true);

    var color = (constClicked) ? ElectrodeColors.constant : ElectrodeColors.active;

    // When clicked, update which pixels are turned on
    var elec = $(this);
    var data = elec.data();

    data.on = data.on ? undefined : "on";

    if (constClicked) data.constant = data.constant ? undefined : "constant";

    elec.data(data);

    elec.css("fill",data.on ? color : ElectrodeColors.off);

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
    var oldConstantPixels = _.clone(self.constantPixels);

    // Turn of all pixels
    self.turnOffAllPixels();

    // Turn on all input pixels:
    var selectedPixels = _.filter($("polygon"), (p) =>  _.contains(pixels, $(p).data().channels));
    var constantPixels = _.filter($("polygon"), (p) =>  _.contains(oldConstantPixels, $(p).data().channels));

    // Turn on pixels:
    _.each(selectedPixels, self.turnOnActivePixel);
    _.each(constantPixels, self.turnOnConstantPixel);

    // Update state of SVG Reader:
    self.updateActive();

    // Dispatch the new pixel states:
    self.dispatchActivePixels();
  };

  self.turnOffAllPixels = function(){
    _.each($("polygon"), function(p){
      let elec = $(p);

      let data = elec.data();
      data.on = undefined;

      elec.css("fill",ElectrodeColors.off);
      elec.data(data);

    });

    self.updateActive();
  };

  self.turnOnActivePixel = function(p){
    let elec = $(p);
    let data = elec.data();
    data.on = "on";
    elec.css("fill",ElectrodeColors.active);
    elec.data(data);
  };

  self.turnOnConstantPixel = function(p){
    let elec = $(p);
    let data = elec.data();
    console.log(data);
    data.on = "on";
    data.constant  = "constant";
    elec.css("fill",ElectrodeColors.constant);
    elec.data(data);
  };

  self.updateActive = function(){
    // Update list of active pixels to match state of SVG polygons
    var pixels = _.filter($("polygon"), function(p){return $(p).data().on == "on"});
    self.activePixels = _.map(pixels, function(p){return $(p).data().channels});

    // Also store pixels held constant (as these have different rules)
    var constantPixels = _.filter(pixels, function(p){return $(p).data().constant == "constant"});
    self.constantPixels = _.map(constantPixels, function(p){return $(p).data().channels});
  };

};

module.exports = SVGReader;
