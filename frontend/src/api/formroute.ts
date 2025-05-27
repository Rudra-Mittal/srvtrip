 export const genitinerary = async (data: any) => {
    console.log("response reached in genitinerary")
    return await fetch(`${import.meta.env.VITE_BACKEND_URL}`+"api/itenary", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({"prompt":data}),
    }).then((res) => {
        //if not a valid place it is gibberish or not a place so backend will return res.status(403).json({ "error": "Invalid destination" });
        if (res.status === 403) {
            throw new Error('Invalid destination');
        }
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json();
    }).catch((err)=>{
        console.log(err)
        return {error: 'Failed to generate itinerary'}
    });
    }

   export  const genotp = async (email:any) => await fetch(`${import.meta.env.VITE_BACKEND_URL}/generate-otp`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),

      }
    ).then((res) => {
        if (!res.ok) {
            throw new Error('Failed to send OTP');
        }
        return res.json();
    }
    ).catch((err)=>{
        console.log(err)
        return {error: 'Failed to send OTP'}
    }
    );
   
    export const verifyotp = async(email:string,otp:any,password:string,name:string) => await fetch(`${import.meta.env.VITE_BACKEND_URL}/verify-otp`, {
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
      }
    ).then(async (res) => {
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Invalid or expired OTP');
        }
        return res.json();
    }).catch((err) => {
        console.log(err);
        return { error: 'Failed to verify OTP' };
    });