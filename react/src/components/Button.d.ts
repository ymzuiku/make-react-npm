import React, { Component } from 'react';

interface IProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  /** 按钮边距 */
  margin: string;
}

export default class extends Component<IProps> {}
