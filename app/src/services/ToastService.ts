import Toast, { ToastOptions } from 'react-native-root-toast';

export const TOAST_DEFAULT_DURATION = 5000;

interface ToastInstance {
  id: string;
}

class ToastService {
  private activeToast?: ToastInstance = undefined;

  private hideToast = (toast: ToastInstance) => {
    Toast.hide(toast);
  };

  private setActiveToast = (toast: ToastInstance | undefined) => {
    if (this.activeToast) {
      this.hideToast(this.activeToast);
    }
    this.activeToast = toast;
  };

  showToast(text: string, configuration: ToastOptions = {}) {
    const newActiveToast = Toast.show(text, {
      duration: TOAST_DEFAULT_DURATION,
      position: Toast.positions.BOTTOM,
      onShow: () => this.setActiveToast(newActiveToast),
      onHidden: () => this.setActiveToast(undefined),
      ...configuration,
    });

    return newActiveToast;
  }
}

export const toastService = new ToastService();
