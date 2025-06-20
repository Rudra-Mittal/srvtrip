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