import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

class Button extends React.PureComponent {
  static defaultProps = {
    margin: '0em',
  };

  render() {
    const { margin, ...rest } = this.props;
    return <StyButton margin={margin} type="button" {...rest} />;
  }
}

Button.propTypes = {
  /** 按钮边距 */
  margin: PropTypes.string,
};

const StyButton = styled.button`
  outline: none;
  margin: ${p => p.margin};
  padding: 0.7em;
  background-color: #f3f3f3;
  border-radius: 0.2em;
  :active {
    background-color: #f99;
    color: #fff;
  }
`;

export default Button;
