export const getTest = async () => {
    try {
        const res = await fetch('http://localhost:8080/productos',{
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          }, 
        }      
        );
    } catch (error) {
        
    }
}