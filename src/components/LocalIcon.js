import React from 'react';
import { Image } from 'react-native';

const LocalIcon = ({ name, style, size = 16, color, ...props }) => {
  // Convert the icon name to match our file naming convention
  const iconName = name.replace(/^fa-/, '').replace(/-/g, '-');
  
  // Import the SVG icon
  const iconPath = require(`../assets/icons/${iconName}.svg`);

  return (
    <Image
      source={iconPath}
      style={[
        {
          width: size,
          height: size,
          tintColor: color,
        },
        style,
      ]}
      {...props}
    />
  );
};

export default LocalIcon; 