export const NOTIFICATION_SOUNDS = {
    gentle: 'Gentle Chime',
    bell: 'Bell Ring',
    ding: 'Ding',
    pop: 'Pop',
    chirp: 'Chirp',
    beep: 'Beep',
    chime: 'Chime',
    ping: 'Ping',
    tone: 'Tone',
    alert: 'Alert'
  } as const;
  
  export type NotificationSoundType = keyof typeof NOTIFICATION_SOUNDS;
  
  // Notification sound configurations
  const SOUND_CONFIGS = {
    gentle: { frequency: 880, type: 'sine' as OscillatorType },
    bell: { frequency: 784, type: 'triangle' as OscillatorType },
    ding: { frequency: 987.77, type: 'sine' as OscillatorType },
    pop: { frequency: 523.25, type: 'square' as OscillatorType },
    chirp: { frequency: 1396.91, type: 'sine' as OscillatorType },
    beep: { frequency: 659.25, type: 'square' as OscillatorType },
    chime: { frequency: 1046.50, type: 'triangle' as OscillatorType },
    ping: { frequency: 880, type: 'triangle' as OscillatorType },
    tone: { frequency: 440, type: 'sine' as OscillatorType },
    alert: { frequency: 587.33, type: 'square' as OscillatorType }
  };
  
  let audioContext: AudioContext | null = null;
  
  export async function playNotificationSound(soundType: NotificationSoundType = 'gentle') {
    try {
      if (!audioContext) {
        audioContext = new AudioContext();
      }
  
      const config = SOUND_CONFIGS[soundType];
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
  
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
  
      oscillator.type = config.type;
      oscillator.frequency.setValueAtTime(config.frequency, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
  
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.error('Failed to play notification sound:', error);
    }
  }