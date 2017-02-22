var config = function(sequence){
  return {
    content: [{
      type: 'row',
      content: [
        {
        type: 'component',
        componentName: 'electrode control',
        componentState: {}
        },
        {
        type: 'react-component',
        component: 'procedure',
        props: {
          sequence: sequence,
          sequenceIndex: 0,
        },
        width: 30
        }
      ]
    }]
  }
}

export default config;
