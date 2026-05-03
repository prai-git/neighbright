import { useState, useRef, useCallback } from 'react';

const isSupported =
  typeof navigator !== 'undefined' &&
  !!navigator.mediaDevices &&
  typeof MediaRecorder !== 'undefined';

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const currentURLRef = useRef(null);

  const startRecording = useCallback(async () => {
    setError(null);
    if (!isSupported) {
      setError('unsupported');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = e => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        // Revoke previous URL to avoid memory leak
        if (currentURLRef.current) URL.revokeObjectURL(currentURLRef.current);
        const url = URL.createObjectURL(blob);
        currentURLRef.current = url;
        setAudioURL(url);
        // Stop all microphone tracks
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('permission_denied');
      } else {
        setError('unknown');
      }
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, []);

  const clearRecording = useCallback(() => {
    if (currentURLRef.current) {
      URL.revokeObjectURL(currentURLRef.current);
      currentURLRef.current = null;
    }
    setAudioURL(null);
    setError(null);
  }, []);

  return { isRecording, startRecording, stopRecording, audioURL, clearRecording, isSupported, error };
}
