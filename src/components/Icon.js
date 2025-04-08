import React from 'react';
import { Platform, Image } from 'react-native';

// Import all SVG icons
import userShield from '../assets/icons/user-shield.svg';
import unlock from '../assets/icons/unlock.svg';
import key from '../assets/icons/key.svg';
import home from '../assets/icons/home.svg';
import bolt from '../assets/icons/bolt.svg';
import signInAlt from '../assets/icons/sign-in-alt.svg';
import infoCircle from '../assets/icons/info-circle.svg';
import userCircle from '../assets/icons/user-circle.svg';
import cog from '../assets/icons/cog.svg';
import slidersH from '../assets/icons/sliders-h.svg';
import bars from '../assets/icons/bars.svg';
import signOutAlt from '../assets/icons/sign-out-alt.svg';
import user from '../assets/icons/user.svg';
import google from '../assets/icons/google.svg';
import apple from '../assets/icons/apple.svg';
import twitter from '../assets/icons/twitter.svg';
import crown from '../assets/icons/crown.svg';
import tasks from '../assets/icons/tasks.svg';
import envelope from '../assets/icons/envelope.svg';
import envelopeOpen from '../assets/icons/envelope-open.svg';
import userFriends from '../assets/icons/user-friends.svg';
import userSlash from '../assets/icons/user-slash.svg';
import clipboardCheck from '../assets/icons/clipboard-check.svg';
import clipboardList from '../assets/icons/clipboard-list.svg';
import levelUpAlt from '../assets/icons/level-up-alt.svg';
import search from '../assets/icons/search.svg';
import checkDouble from '../assets/icons/check-double.svg';
import bell from '../assets/icons/bell.svg';
import link from '../assets/icons/link.svg';
import shieldAlt from '../assets/icons/shield-alt.svg';
import camera from '../assets/icons/camera.svg';
import handSparkles from '../assets/icons/hand-sparkles.svg';
import idBadge from '../assets/icons/id-badge.svg';
import exchangeAlt from '../assets/icons/exchange-alt.svg';
import times from '../assets/icons/times.svg';

// Map of icon names to their imported SVG files
const iconMap = {
  'user-shield': userShield,
  'unlock': unlock,
  'key': key,
  'home': home,
  'bolt': bolt,
  'sign-in-alt': signInAlt,
  'info-circle': infoCircle,
  'user-circle': userCircle,
  'cog': cog,
  'sliders-h': slidersH,
  'bars': bars,
  'sign-out-alt': signOutAlt,
  'user': user,
  'google': google,
  'apple': apple,
  'twitter': twitter,
  'crown': crown,
  'tasks': tasks,
  'envelope': envelope,
  'envelope-open': envelopeOpen,
  'user-friends': userFriends,
  'user-slash': userSlash,
  'clipboard-check': clipboardCheck,
  'clipboard-list': clipboardList,
  'level-up-alt': levelUpAlt,
  'search': search,
  'check-double': checkDouble,
  'bell': bell,
  'link': link,
  'shield-alt': shieldAlt,
  'camera': camera,
  'hand-sparkles': handSparkles,
  'id-badge': idBadge,
  'exchange-alt': exchangeAlt,
  'times': times,
};

const Icon = ({ name, style, size = 16, color = '#FFFFFF', ...props }) => {
  // Remove 'fa-' prefix and convert to our naming convention
  const iconName = name.replace(/^fa-/, '').replace(/-/g, '-');
  
  // Get the icon from our map
  const iconPath = iconMap[iconName];

  if (!iconPath) {
    console.warn(`Icon "${iconName}" not found`);
    return null;
  }

  if (Platform.OS === 'web') {
    return (
      <img
        src={iconPath}
        style={{
          width: size,
          height: size,
          filter: `brightness(0) saturate(100%) invert(1)`,
          ...style,
        }}
        {...props}
      />
    );
  }

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

export default Icon; 