export const auth=async()=>{
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/user`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        });
        const data = await response.json();
        console.log(data);
        return data;
      } catch (err) {
        console.log(err);
        return { error: "Failed to fetch user data" };
      }
}