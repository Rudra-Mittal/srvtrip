 export const genitinerary = async (data: any) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then((res) => {
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        return res.json();
    });
    }