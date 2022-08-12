import React from 'react';

export const TimeContext = React.createContext({
  value: '',
  setValue: (s: string) => {},
  dependent: false,
});
