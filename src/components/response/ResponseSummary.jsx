import { mockDistribution } from "../../constants/fields";
import { collectBmMeta } from "../../utils/jsonUtils";

function Skeleton() {
  return (
    <>
      <div className="summary-top">
        <div className="summary-section-label">Returned bookmaker</div>
        <div className="summary-returned">
          <div className="summary-placeholder summary-placeholder-name" />
        </div>
      </div>
      <div className="summary-dist">
        <div className="summary-section-label">
          Potential distribution <span className="summary-mock-badge">mock</span>
        </div>
        {mockDistribution.map((_, i) => (
          <div className="summary-row" key={i}>
            <div className="summary-row-info">
              <div className="summary-row-left">
                <div className="summary-placeholder summary-placeholder-dot" />
                <div className="summary-placeholder summary-placeholder-label" />
              </div>
              <div className="summary-placeholder summary-placeholder-pct" />
            </div>
            <div className="summary-bar-track">
              <div className="summary-placeholder summary-bar-fill" style={{ width: "60%" }} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function ResponseSummary({ responseJson }) {
  if (!responseJson) return (
    <div className="card">
      <h2>Response Summary</h2>
      <Skeleton />
    </div>
  );

  const bmMeta = collectBmMeta(responseJson);
  const topBmId = responseJson.Games?.[0]?.TopBookmaker ?? null;
  const returnedBm = topBmId !== null
    ? (bmMeta[topBmId] || { name: `BM #${topBmId}`, color: "#4f77ff" })
    : null;

  return (
    <div className="card">
      <h2>Response Summary</h2>

      {returnedBm && (
        <div className="summary-top">
          <div className="summary-section-label">Returned bookmaker</div>
          <div className="summary-returned">
            <div className="summary-returned-dot" style={{ background: returnedBm.color }} />
            <div className="summary-returned-name" style={{ color: returnedBm.color }}>
              {returnedBm.name}
            </div>
          </div>
        </div>
      )}

      <div className="summary-dist">
        <div className="summary-section-label">
          Potential distribution <span className="summary-mock-badge">mock</span>
        </div>
        {mockDistribution.map(({ id, name, color, pct }) => {
          const isReturned = id === topBmId;
          return (
            <div className={`summary-row${isReturned ? " summary-row-returned" : ""}`} key={id}>
              <div className="summary-row-info">
                <div className="summary-row-left">
                  <div className="summary-row-dot" style={{ background: color }} />
                  <span className="summary-row-name">{name}</span>
                  {isReturned && <span className="summary-returned-badge">returned</span>}
                </div>
                <span className="summary-row-pct">{pct}%</span>
              </div>
              <div className="summary-bar-track">
                <div className="summary-bar-fill" style={{ width: `${pct}%`, background: color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
