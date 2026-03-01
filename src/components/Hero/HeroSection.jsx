export default function HeroSection({ hero }) {
  return (
    <section className="hero">
      <p className="badge">{hero.badge}</p>
      <h1>{hero.title}</h1>
      <p className="hero-copy">{hero.description}</p>
      <p className="hero-verse">{hero.verse}</p>
      <div className="hero-actions">
        <a className="hero-link primary" href={hero.primaryCta.href}>
          {hero.primaryCta.label}
        </a>
        <a className="hero-link secondary" href={hero.secondaryCta.href}>
          {hero.secondaryCta.label}
        </a>
      </div>
    </section>
  );
}
