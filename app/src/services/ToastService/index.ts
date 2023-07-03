import { StyleProp, ViewStyle } from 'react-native';
import Toast, { ToastShowParams } from 'react-native-toast-message';
import { InfoToast } from './InfoToast';

export const TOAST_DEFAULT_DURATION = 5000;

export const toastConfig = {
  info: InfoToast,
};

export interface ToastProps extends ToastShowParams {
  props?: { containerStyle: StyleProp<ViewStyle> };
}

class ToastService {
  private hideToast() {
    Toast.hide();
  }

  showInfoToast(text: string, configuration: ToastProps = {}) {
    this.hideToast();
    Toast.show({
      text1: text,
      type: 'info',
      position: 'bottom',
      visibilityTime: TOAST_DEFAULT_DURATION,
      autoHide: true,
      ...configuration,
    });
  }
}

export const toastService = new ToastService();
