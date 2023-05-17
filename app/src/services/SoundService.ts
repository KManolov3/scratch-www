import Sound from 'react-native-sound';
import ding from '@assets/sounds/ding.mp3';

class SoundService {
  private playSoundOnce(mp3: string) {
    const sound = new Sound(mp3, error => {
      if (error) {
        return;
      }

      // Play the sound
      sound.play();
    });

    // Clean up the sound when the component unmounts
    sound.release();
  }

  ding() {
    this.playSoundOnce(ding);
  }
}

export const soundService = new SoundService();
