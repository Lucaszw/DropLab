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
          type: 'column',
          content:[{
            type: 'react-component',
            component: 'procedure',
            props: {
              sequence: sequence,
              sequenceIndex: 0,
            },
            title: 'Procedure'
          },
          {
            type: 'react-component',
            component: 'legend',
            title: 'Legend',
            height: 20
          }
          ],
          width: 40
        }
      ]
    }]
  }
}

export default config;
