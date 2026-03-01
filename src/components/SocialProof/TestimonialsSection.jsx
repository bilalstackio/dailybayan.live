export default function TestimonialsSection({ id, testimonials }) {
  return (
    <section id={id} className="testimonials-section">
      <div className="section-heading">
        <h2>Community Impact</h2>
      </div>
      <div className="testimonials-grid">
        {(testimonials || []).map((item) => (
          <article key={item.id} className="testimonial-card">
            <p className="testimonial-quote">"{item.quote}"</p>
            <p className="testimonial-meta">
              {item.name} {item.location ? `- ${item.location}` : ""}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
