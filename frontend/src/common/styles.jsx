import React from 'react';

export const stylesWrapper = (target, hook) => (props) => {
  const classes = hook();
  return React.createElement(target, { ...props, ...{ classes: classes } })
}