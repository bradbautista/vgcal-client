import React from 'react';
import { components } from 'react-select'

export default class CustomOption extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const {innerProps, isFocused, ...otherProps} = this.props;
        const {onMouseMove, onMouseOver, ...otherInnerProps} = innerProps;
        const newProps = {innerProps: {...otherInnerProps}, ...otherProps};
        return (
            <components.Option {...newProps} className="your-option-css-class">{this.props.children}
            </components.Option>
        );
    }
}