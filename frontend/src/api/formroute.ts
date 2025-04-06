 export const genitinerary = async (data: any) => {
    return await fetch(`${import.meta.env.VITE_BACKEND_URL}`+"api/itenary", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({"prompt":data}),
    }).then((res) => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json();
    }).catch((err)=>{
        console.log(err)
        return {error: 'Failed to generate itinerary'}
    });
    }

   export  const genotp = async (email:any) => await fetch('http://localhost:4000/generate-otp',{
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
   
    export const verifyotp = async(email:string,otp:any,password:string,name:string) => await fetch('http://localhost:4000/verify-otp', {
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