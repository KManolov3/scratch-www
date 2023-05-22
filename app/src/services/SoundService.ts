import Sound from 'react-native-sound';
import errorSound from '@assets/sounds/error.mp3';

const sounds = { error: errorSound };
export type SoundKey = keyof typeof sounds;

class SoundService {
  private soundInstances: Map<SoundKey, Sound> = new Map();

  private loadSound = (soundKey: SoundKey) => {
    const sound = new Sound(sounds[soundKey], error => {
      if (error) {
        // eslint-disable-next-line no-console
        console.log(`Error loading sound '${soundKey}':`, error);
      }
    });
    this.soundInstances.set(soundKey, sound);
  };

  playSound = (soundKey: SoundKey) => {
    if (!this.soundInstances.has(soundKey)) {
      this.loadSound(soundKey);
    }
    const sound = this.soundInstances.get(soundKey);

    if (sound) {
      sound.play();
    }
  };
}

export const soundService = new SoundService();
