import { useState } from "react";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SubscribeSection({ id, subscribe }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  function handleSubmit(event) {
    event.preventDefault();
    if (!emailPattern.test(email)) {
      setMessage("Please enter a valid email address.");
      setMessageType("error");
      return;
    }
    setMessage("Thanks. You are subscribed for updates.");
    setMessageType("success");
    setEmail("");
  }

  return (
    <section id={id} className="subscribe-panel">
      <h2>{subscribe.title}</h2>
      <p>{subscribe.description}</p>
      <form className="subscribe-actions" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder={subscribe.placeholder}
          aria-label="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <button type="submit">{subscribe.buttonLabel}</button>
      </form>
      {message ? <p className={`status ${messageType === "error" ? "error" : "success"}`}>{message}</p> : null}
    </section>
  );
}
