import { collectBmMeta } from "../../utils/jsonUtils";
import { mockDistribution } from "../../constants/fields";

const PALETTE = ["#4f77ff","#e03232","#f8c555","#00a651","#9ecbff","#f97583","#c8922a","#79b8ff","#4caf87","#ff9d3a"];
function paletteColor(i) { return PALETTE[i % PALETTE.length]; }

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

function DistributionGroup({ title, rows, returnedBmId, bmMeta }) {
  return (
    <div className="summary-dist">
      <div className="summary-section-label">{title}</div>
      {rows.map(({ bookmaker, bookmakerId, sov }, i) => {
        const meta   = bmMeta[bookmakerId];
        const color  = meta?.color || paletteColor(i);
        const isReturned = bookmakerId === returnedBmId;
        return (
          <div className={`summary-row${isReturned ? " summary-row-returned" : ""}`} key={bookmaker + i}>
            <div className="summary-row-info">
              <div className="summary-row-left">
                <div className="summary-row-dot" style={{ background: color }} />
                <span className="summary-row-name">{bookmaker}</span>
                {isReturned && <span className="summary-returned-badge">returned</span>}
              </div>
              <span className="summary-row-pct">{sov}%</span>
            </div>
            <div className="summary-bar-track">
              <div className="summary-bar-fill" style={{ width: `${sov}%`, background: color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function ResponseSummary({ responseJson, distribution }) {
  if (!responseJson) return (
    <div className="card">
      <h2>Response Summary</h2>
      <Skeleton />
    </div>
  );

  const bmMeta     = collectBmMeta(responseJson);
  const topBmId    = responseJson.Games?.[0]?.TopBookmaker ?? null;
  const returnedBm = topBmId !== null
    ? (bmMeta[topBmId] || { name: `BM #${topBmId}`, color: "#4f77ff" })
    : null;

  // Group distribution by platform
  const platforms = {};
  (distribution || []).forEach((row) => {
    if (!platforms[row.platform]) platforms[row.platform] = [];
    platforms[row.platform].push(row);
  });
  const platformKeys   = Object.keys(platforms);
  const hasRealDist    = platformKeys.length > 0;
  const multiPlatform  = platformKeys.length > 1;

  return (
    <div className="card">
      <h2>Response Summary</h2>

      <div className="summary-top">
        <div className="summary-section-label">Returned bookmaker</div>
        {returnedBm ? (
          <div className="summary-returned">
            <div className="summary-returned-dot" style={{ background: returnedBm.color }} />
            <div className="summary-returned-name" style={{ color: returnedBm.color }}>
              {returnedBm.name}
            </div>
          </div>
        ) : (
          <div className="summary-returned-name" style={{ color: "#6b7585" }}>
            No bookies for this type of user
          </div>
        )}
      </div>

      {hasRealDist ? (
        platformKeys.map((platform) => (
          <DistributionGroup
            key={platform}
            title={multiPlatform ? `Distribution — ${platform}` : "Potential distribution"}
            rows={platforms[platform]}
            returnedBmId={topBmId}
            bmMeta={bmMeta}
          />
        ))
      ) : (
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
      )}
    </div>
  );
}
