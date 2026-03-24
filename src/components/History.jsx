export default function History({ entries }) {
  return (
    <section className="card">
      <h2>History</h2>
      {entries.length === 0 ? (
        <ul className="history muted"><li>No requests yet.</li></ul>
      ) : (
        <ul className="history">
          {entries.map((item, i) => (
            <li key={i}>
              <strong>{item.status}</strong> — <span className="muted">{item.time}</span>
              <br />
              <span className="muted">{item.url}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
