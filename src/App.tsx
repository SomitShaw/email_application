import React, { useState } from "react";
import axios from "axios";

const App: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");
    try {
      const response = await axios.post("http://localhost:5000/send-email", {
        email,
        message,
      });
      if (response.data.success) {
        setStatus("Email sent successfully!");
      } else {
        setStatus("Failed to send email.");
      }
    } catch (error) {
      setStatus("Failed to send email.");
    }
  };

  return (
    <div>
      <h1>Send Email</h1>
      <form onSubmit={sendEmail}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Email</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
};

export default App;
