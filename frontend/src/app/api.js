export const fetchMessage = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/get_message");
      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error("Error fetching message:", error);
      return "Error connecting to server.";
    }
  };
