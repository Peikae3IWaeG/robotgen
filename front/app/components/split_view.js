"use client";

import React from "react";

class VerticalSplitView extends React.Component {
  render() {
    const { leftContent, rightContent } = this.props;

    const splitViewStyle = {
      display: "flex",
      width: "100%",
      height: "100%",
    };

    const leftPaneStyle = {
      flex: 1,
      overflow: "auto",
      height: "100%",
    };

    const rightPaneStyle = {
      flex: 1,
      overflow: "auto",
      height: "100%",
    };

    return (
      <div style={splitViewStyle}>
        <div style={leftPaneStyle}>{leftContent}</div>
        <div style={rightPaneStyle}>{rightContent}</div>
      </div>
    );
  }
}

export default VerticalSplitView;
