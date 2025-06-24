import { useState, useRef, useCallback } from 'react';

interface SSEMessage {
  type: 'connected' | 'progress' | 'success' | 'error';
  message: string;
  step?: number;
  totalSteps?: number;
  data?: any;
  error?: any;
  itineraryId?: string;
}

interface UseItinerarySSEReturn {
  isConnected: boolean;
  isGenerating: boolean;
  progress: {
    step: number;
    totalSteps: number;
    message: string;
  };
  result: any;
  error: string | null;
  generateItinerary: (formData: any) => void;
  closeConnection: () => void;
}

export const useItinerarySSE = (): UseItinerarySSEReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({
    step: 0,
    totalSteps: 8,
    message: ''
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const closeConnection = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsConnected(false);
    setIsGenerating(false);
  }, []);

  const generateItinerary = useCallback((formData: any) => {
    // Reset states
    setError(null);
    setResult(null);
    setProgress({ step: 0, totalSteps: 8, message: '' });
    setIsGenerating(true);

    // Close any existing connection
    closeConnection();

    // Create new EventSource connection
    const eventSource = new EventSource(
      `${import.meta.env.VITE_BACKEND_URL}/api/itenary-stream`,
      {
        withCredentials: true
      }
    );

    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('SSE connection opened');
      setIsConnected(true);
      
      // Send the form data via fetch POST
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/itenary-stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ prompt: formData })
      }).catch(err => {
        console.error('Error sending form data:', err);
        setError('Failed to send form data');
        closeConnection();
      });
    };

    eventSource.onmessage = (event) => {
      try {
        const data: SSEMessage = JSON.parse(event.data);
        console.log('SSE message received:', data);

        switch (data.type) {
          case 'connected':
            console.log('Connected to stream:', data.message);
            break;

          case 'progress':
            setProgress({
              step: data.step || 0,
              totalSteps: data.totalSteps || 8,
              message: data.message
            });
            break;

          case 'success':
            setResult(data.data);
            setProgress({
              step: data.totalSteps || 8,
              totalSteps: data.totalSteps || 8,
              message: data.message
            });
            setIsGenerating(false);
            closeConnection();
            break;

          case 'error':
            setError(data.message);
            setIsGenerating(false);
            closeConnection();
            break;
        }
      } catch (err) {
        console.error('Error parsing SSE message:', err);
        setError('Error parsing server response');
      }
    };

    eventSource.onerror = (event) => {
      console.error('SSE error:', event);
      setError('Connection error occurred');
      setIsGenerating(false);
      closeConnection();
    };

  }, [closeConnection]);

  return {
    isConnected,
    isGenerating,
    progress,
    result,
    error,
    generateItinerary,
    closeConnection
  };
};
