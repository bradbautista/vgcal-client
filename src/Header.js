import React, { Component } from 'react'
import { Link } from "react-router-dom";
import Select from 'react-select';
import Context from './Context';
import './Header.css'

  export default class Header extends Component {
  
    constructor(props) {

      super(props);
      this.state = {
      };
  
    }

    static contextType = Context; 
  
    render() {
  
      return (
        <header className="header">
          <Link to="/"><h1 className="logotype">vgCal</h1></Link>
          <Select
            className="search"
            // value={this.context.game}
            onChange={this.context.handleChange}
            placeholder="Select a game or type to search for one"
            options={this.context.releases.map(release => {
              
              const tempObj = {}

              tempObj.value = release;
              tempObj.label = release.title;

              return tempObj;
            })}
          />
          <span></span>
        </header>
      );
    }
  }