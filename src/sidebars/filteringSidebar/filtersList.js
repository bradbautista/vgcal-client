import React, { Component } from 'react'
import Context from '../../Context';
import Checkbox from './checkbox'

  export default class FiltersList extends Component {
  
    constructor(props) {

      super(props);
      this.state = {
      };
  
    }

    static contextType = Context; 
 
    render() {

        // We're only going to provide checkboxes for common platforms
        // And to avoid PS4/5 XBoxOne/Series S nonsense we're just going to
        // filter for PlayStation and Xbox, since most games will be released
        // for both or be backwards-compatible
        const commonPlatforms = ['Xbox', 'PlayStation', 'PC', 'Switch', 'Mac', 'Android', 'iPhone', 'iPad']
  
        return (
            <div className="filtering-container">
                    <h2 className="filters-header">Filtering options</h2>
                    <div>Note: If you check PC and Switch, you will get games which are coming out on PC <em>and</em> Switch, not PC <em>or</em> Switch.</div>
                    {commonPlatforms.map((platform, key) => {
                        return <Checkbox key={platform} ref={ref => (this.context.checkboxes[key] = ref)} platform={platform}/>
                    })}
            </div>
        );
    }
}