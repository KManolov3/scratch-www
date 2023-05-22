import Sound from 'react-native-sound';
import errorSound from '@assets/sounds/error.mp3';

const sounds = { error: errorSound };
export type SoundKey = keyof typeof sounds;

class SoundService {
  private soundInstances: Map<SoundKey, Promise<Sound>> = new Map();

  private loadSound(soundKey: SoundKey): Promise<Sound> {
    return new Promise((resolve, reject) => {
      const sound = new Sound(sounds[soundKey], error => {
        if (error) {
          reject(error);
        }
        resolve(sound);
      });
    });
  }

  async playSound(soundKey: SoundKey) {
    if (!this.soundInstances.has(soundKey)) {
      this.soundInstances.set(soundKey, this.loadSound(soundKey));
    }
    const sound = await this.soundInstances.get(soundKey);

    if (sound) {
      sound.play();
    }
  }
}

export const soundService = new SoundService();
