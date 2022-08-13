import React from 'react';

type DefaultTimeOptions = '0' | '5' | '10' | '20' | '30' | '45' | '60' | '180';
interface TimeContextTypes {
  value: DefaultTimeOptions;
  setValue: (v: DefaultTimeOptions) => void;
  dependent: boolean;
}

export const TimeContext = React.createContext<TimeContextTypes>({
  value: '0',
  setValue: (v: DefaultTimeOptions) => {},
  dependent: false,
});
