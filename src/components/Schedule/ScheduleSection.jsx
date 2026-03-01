export default function ScheduleSection({ id, schedule }) {
  return (
    <section id={id} className="schedule-section">
      <div className="section-heading">
        <h2>Program Schedule</h2>
      </div>
      <div className="schedule-grid">
        {(schedule || []).map((block) => (
          <article key={block.id} className="schedule-card">
            <h3>{block.title}</h3>
            <ul>
              {(block.items || []).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
