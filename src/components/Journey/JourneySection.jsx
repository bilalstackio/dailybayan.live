export default function JourneySection({ id, tracks }) {
  return (
    <section id={id} className="journey-grid">
      {(tracks || []).map((track) => (
        <article key={track.id} className="journey-card">
          <h3>{track.title}</h3>
          <p>{track.description}</p>
          <button type="button">{track.cta}</button>
        </article>
      ))}
    </section>
  );
}
