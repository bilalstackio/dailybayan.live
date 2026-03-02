import { useState } from "react";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SubscribeSection({ id, subscribe }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!emailPattern.test(email)) {
      setMessage("Please enter a valid email address.");
      setMessageType("error");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(payload?.error || "Could not subscribe right now. Please try again.");
        setMessageType("error");
        return;
      }

      setMessage(payload?.message || "Thanks. You are subscribed for updates.");
      setMessageType("success");
      setEmail("");
    } catch {
      setMessage("Could not subscribe right now. Please try again.");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
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
        <button type="submit" disabled={submitting}>
          {submitting ? "Subscribing..." : subscribe.buttonLabel}
        </button>
      </form>
      {message ? <p className={`status ${messageType === "error" ? "error" : "success"}`}>{message}</p> : null}
    </section>
  );
}
