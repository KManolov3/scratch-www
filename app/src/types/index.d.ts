declare module '*.svg' {
  import Svg, { SvgProps } from 'react-native-svg';

  export default Svg;
  export type SvgType = typeof Svg;
  export type SvgProps = SvgProps;
}

declare module '*.mp3';
