export default function NavBar({ brand, nav }) {
  return (
    <header className="top-nav">
      <div className="brand-wrap">
        <div className="brand">{brand?.title}</div>
        <p className="brand-subtitle">{brand?.subtitle}</p>
      </div>
      <nav aria-label="Primary">
        {(nav || []).map((item) => (
          <a key={`${item.label}-${item.href}`} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
