export type {
  DefaultTimeOptions,
  RestContextTypes,
  GlobalRestConextTypes,
  ViewsType,
  ViewContextTypes,
  TimeContextTypes,
};

type DefaultTimeOptions = '0' | '5' | '10' | '20' | '30' | '45' | '60' | '180';

interface RestContextTypes {
  active: boolean;
  time: DefaultTimeOptions;
  setActive: (v: boolean) => void;
  setTime: (t: DefaultTimeOptions) => void;
}

interface GlobalRestConextTypes {
  active: boolean;
  time: DefaultTimeOptions;
}

type ViewsType = 'home' | 'countdown';

interface ViewContextTypes {
  current: ViewsType;
  set: (s: ViewsType) => void;
}

interface TimeContextTypes {
  value: DefaultTimeOptions;
  setValue: (v: DefaultTimeOptions) => void;
  dependent: boolean;
}
