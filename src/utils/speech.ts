// Voice Guidance Speech Synthesis Engine for SafeSite AI

let isSpeechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

export const speakMessage = (text: string) => {
  if (!isSpeechSupported) return;

  try {
    // Cancel active speech to avoid overlaps
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice properties
    utterance.volume = 0.9;
    utterance.rate = 1.0; // Normal rate
    utterance.pitch = 0.95; // Muted, professional tone

    // Try to get a professional, standard English voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.name.includes('Google US English') ||
        v.name.includes('Microsoft David') ||
        v.name.includes('Natural') ||
        v.lang === 'en-US'
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.warn('Speech synthesis failed:', error);
  }
};

export const cancelAllSpeech = () => {
  if (isSpeechSupported) {
    window.speechSynthesis.cancel();
  }
};
