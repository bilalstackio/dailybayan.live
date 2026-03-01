export default function HighlightsStrip({ items }) {
  return (
    <section className="highlight-strip" aria-label="Program highlights">
      {(items || []).map((item) => (
        <div key={item.id} className="highlight-item">
          <p className="highlight-value">{item.value}</p>
          <p className="highlight-label">{item.label}</p>
        </div>
      ))}
    </section>
  );
}
