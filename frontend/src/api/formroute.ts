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
    });
    }