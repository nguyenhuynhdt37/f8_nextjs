// soundPlayer.ts
import { Howl } from 'howler';

interface SoundOptions {
  volume?: number; // Âm lượng (từ 0.0 đến 1.0)
}

export const playSound = (src: string, options?: SoundOptions): void => {
  const sound = new Howl({
    src: [src],
    volume: options?.volume ?? 1, // Mặc định âm lượng là 1 nếu không được cung cấp
  });
  sound.play();
};
