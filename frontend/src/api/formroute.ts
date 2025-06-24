export const genitinerary = async (data: any) => {
    // console.log("response reached in genitinerary")
    return await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/itenary`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({"prompt":data}),
    }).then(async (res) => {
        //if not a valid place it is gibberish or not a place so backend will return res.status(403).json({ "error": "Invalid destination" });
        if (res.status === 403) {
            throw new Error('Invalid destination');
        }
        if (res.status === 429) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Rate limit exceeded');
        }
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json();
    }).catch((err)=>{
        console.log(err)
        throw err; // Re-throw to allow proper error handling in components
    });
}

// SSE version of itinerary generation for handling long-running requests
export const genitinerarySSE = (data: any, onProgress: (step: number, totalSteps: number, message: string) => void): Promise<any> => {
    return new Promise((resolve, reject) => {
        // First, send the POST request with the data
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/itenary`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream', // Request SSE response
            },
            credentials: 'include',
            body: JSON.stringify({ prompt: data })
        }).then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('Failed to get response reader');
            }

            const decoder = new TextDecoder();
            
            function readStream(): Promise<void> {
                return reader!.read().then(({ done, value }) => {
                    if (done) {
                        return;
                    }

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const eventData = JSON.parse(line.slice(6));
                                console.log('SSE message received:', eventData);

                                switch (eventData.type) {
                                    case 'connected':
                                        console.log('Connected to stream:', eventData.message);
                                        break;

                                    case 'progress':
                                        onProgress(
                                            eventData.step || 0,
                                            eventData.totalSteps || 8,
                                            eventData.message || 'Processing...'
                                        );
                                        break;

                                    case 'success':
                                        resolve(eventData.data);
                                        return;

                                    case 'error':
                                        if (eventData.message === 'Invalid destination') {
                                            reject(new Error('Invalid destination'));
                                        } else if (eventData.message.includes('Rate limit') || eventData.message.includes('Too many')) {
                                            reject(new Error(eventData.message));
                                        } else {
                                            reject(new Error(eventData.message || 'Failed to generate itinerary'));
                                        }
                                        return;
                                }
                            } catch (parseError) {
                                console.error('Error parsing SSE data:', parseError);
                                // Continue reading, don't reject for parse errors
                            }
                        }
                    }

                    return readStream();
                });
            }

            return readStream();
        }).catch(error => {
            console.error('SSE fetch error:', error);
            reject(new Error('Connection error occurred during itinerary generation'));
        });

        // Optional: Add timeout for the entire process
        setTimeout(() => {
            reject(new Error('Itinerary generation timeout'));
        }, 5 * 60 * 1000); // 5 minutes timeout
    });
};

export const genotp = async (email:any) => 
  await fetch(`${import.meta.env.VITE_BACKEND_URL}/generate-otp`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to send OTP');
    }
    return data;
  }).catch((err)=>{
    console.log(err);
    throw err;
  });
   
    export const verifyotp = async(email:string,otp:any,password:string,name:string) => 
  await fetch(`${import.meta.env.VITE_BACKEND_URL}/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      otp,
      password,
      name,
    }),
    credentials:'include'
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Invalid or expired OTP');
    }
    return { ...data, user: { email, name } }; // Include user data in response
  }).catch((err) => {
    console.log(err);
    throw err;
  });

    export const sendForgotPasswordOtp = async (email: string) => 
  await fetch(`${import.meta.env.VITE_BACKEND_URL}/forgot-password/send-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to send OTP');
    }
    return data;
  }).catch((err) => {
    console.log(err);
    throw err;
  });

export const verifyForgotPasswordOtp = async (email: string, otp: string) => 
  await fetch(`${import.meta.env.VITE_BACKEND_URL}/forgot-password/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp }),
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Invalid or expired OTP');
    }
    return data;
  }).catch((err) => {
    console.log(err);
    throw err;
  });

export const resetPassword = async (email: string, otp: string, newPassword: string) => 
  await fetch(`${import.meta.env.VITE_BACKEND_URL}/forgot-password/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp, newPassword }),
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to reset password');
    }
    return data;
  }).catch((err) => {
    console.log(err);
    throw err;
  });