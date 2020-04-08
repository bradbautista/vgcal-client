import React, { Component } from 'react'
import Context from '../../Context';

  export default class Checkbox extends Component {
  
    constructor(props) {

      super(props);
      this.state = {
        checked: false,
      };
  
    }

    static contextType = Context; 

    setChecked = (bool) => {

      this.setState({ checked: bool });

    }

    toggleCheck = (e) => {

      this.setState({ checked: !this.state.checked });

      if (e.target.checked === true) {

        this.context.filters.push(e.target.value);

        // Without setTimeout, context returns undefined
        setTimeout(() => {

          this.context.setDefaultReleases(this.context.games);

          const filteredReleases = this.context.releases.filter(release => this.context.filters.every(filter => release.platforms.includes(filter)));

          this.context.setReleases(filteredReleases);

        }, 1);

      } else if (e.target.checked === false) {

        const newFilters = this.context.filters.filter(filter => filter !== e.target.value);

        this.context.setFilters(newFilters);

        setTimeout(() => {

          if (this.context.filters.length === 0) {
          
            this.context.setDefaultReleases(this.context.games);
  
          } else {

            this.context.setDefaultReleases(this.context.games);

            const filteredReleases = this.context.releases.filter(release => this.context.filters.every(filter => release.platforms.includes(filter)));

            this.context.setReleases(filteredReleases);
            
          }

        }, 1);


      }
      
    }
  
    render() {
  
      return (
            <>
                <input type="checkbox" id={this.props.platform} checked={this.state.checked} name={this.props.platform} value={this.props.platform} onChange={(e) => this.toggleCheck(e) } />
                <label htmlFor={this.props.platform}> {this.props.platform}</label><br/> 
            </>
      );
    }
}