export default function FaqSection({ id, faq, openFaqId, setOpenFaqId }) {
  function toggleFaq(itemId) {
    setOpenFaqId((current) => (current === itemId ? null : itemId));
  }

  return (
    <section id={id} className="faq-section">
      <div className="section-heading">
        <h2>Frequently Asked Questions</h2>
      </div>
      <div className="faq-list">
        {(faq || []).map((item) => {
          const isOpen = openFaqId === item.id;
          return (
            <article key={item.id} className="faq-item">
              <button
                type="button"
                className="faq-question"
                onClick={() => toggleFaq(item.id)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${item.id}`}
              >
                <span>{item.question}</span>
                <span className="faq-symbol">{isOpen ? "-" : "+"}</span>
              </button>
              <div
                id={`faq-answer-${item.id}`}
                className={`faq-answer ${isOpen ? "open" : ""}`}
                role="region"
                aria-hidden={!isOpen}
              >
                <p>{item.answer}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
