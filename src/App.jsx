const sections = [
  {
    title: "Trending Now",
    items: ["Arcane", "Money Heist", "Wednesday", "The Gentlemen", "Dark"]
  },
  {
    title: "Top Picks For You",
    items: ["Stranger Things", "Black Mirror", "Peaky Blinders", "Lupin", "3 Body Problem"]
  },
  {
    title: "Action & Thriller",
    items: ["Extraction", "The Night Agent", "Rebel Ridge", "Narcos", "The Witcher"]
  }
];

function MovieRow({ title, items }) {
  return (
    <section className="row">
      <h2>{title}</h2>
      <div className="cards">
        {items.map((item) => (
          <article key={item} className="card">
            <div className="card-overlay">
              <h3>{item}</h3>
              <button type="button">Play</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  return (
    <div className="page">
      <header className="top-nav">
        <div className="brand">NETFLIX</div>
        <nav>
          <a href="#">Home</a>
          <a href="#">TV Shows</a>
          <a href="#">Movies</a>
          <a href="#">My List</a>
        </nav>
      </header>

      <section className="hero">
        <p className="badge">New Release</p>
        <h1>The Last Kingdom</h1>
        <p className="hero-copy">
          A gritty historical drama where fractured kingdoms battle for power, loyalty, and survival.
        </p>
        <div className="hero-actions">
          <button type="button" className="primary">
            Play
          </button>
          <button type="button" className="ghost">
            More Info
          </button>
        </div>
      </section>

      <main>
        {sections.map((section) => (
          <MovieRow key={section.title} title={section.title} items={section.items} />
        ))}
      </main>

      <footer className="footer">Clone project for learning purposes only.</footer>
    </div>
  );
}
