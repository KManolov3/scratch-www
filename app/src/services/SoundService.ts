import Sound from 'react-native-sound';
import errorSound from '@assets/sounds/error.mp3';

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

  playErrorSound() {
    this.playSoundOnce(errorSound);
  }
}

export const soundService = new SoundService();
