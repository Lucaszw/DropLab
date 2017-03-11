import io from 'socket.io-client';
import GoldenLayout from 'golden-layout';

import Layout from './Layout.jsx';
import Procedure from './Procedure.jsx';
import SVGReader from './SVGReader';

var config, myLayout;

// Socket Communication:
var url = 'http://' + document.domain + ':' + location.port;
var socket = io.connect(url);

// DMF Control:
window.mySequence = new Procedure.Sequence({});
var myLayout = new GoldenLayout( Layout(mySequence) );

var turnOnPixels = function(e){
  // Emit to python app which pixels need to be turned on
  window.mySequence.setActiveElectrodes(e.data);
  socket.emit('change pixels', {data: e.data});
};


myLayout.registerComponent( 'procedure', Procedure);
myLayout.registerComponent( 'legend', function(){
  return(
    <div>
      <b>Single Click: Add Electrode to Current Step</b>
      <br />
      <b>CMD + Click: Add electrode as constant outside of procedure</b>
    </div>
  );
}

);

myLayout.registerComponent( 'electrode control', function( container, componentState ){
    container.getElement().html( '<div id="svgContainer"></div>');
    $(document).ready(function(){
        // Ensure the DOM is loaded before initialzing a SVG Reader Object
        var selector = "#svgContainer";

        window.mySequence.setSVGReader(new SVGReader(selector));
        window.mySequence.svgReader.load();

        // Ensure SVG Reader is loaded before adding an event listener
        $(selector)[0].addEventListener('activePixelsUpdated', turnOnPixels, false);
    });
});

myLayout.init();
