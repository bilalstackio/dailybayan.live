export default function Footer({ footer }) {
  return (
    <footer className="footer">
      <p>{footer.note}</p>
      <div className="footer-links">
        {(footer.links || []).map((link) => (
          <a key={`${link.label}-${link.href}`} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
