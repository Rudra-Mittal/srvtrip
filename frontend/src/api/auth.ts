export const auth=async()=>{
    try {
        const response = await fetch("http://localhost:4000/api/auth/user", {
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
      }
}