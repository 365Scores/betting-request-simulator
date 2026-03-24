export function collectBmMeta(obj, result = {}) {
  if (!obj || typeof obj !== "object") return result;
  if (Array.isArray(obj)) { obj.forEach((item) => collectBmMeta(item, result)); return result; }
  if (Array.isArray(obj.Bookmakers)) {
    obj.Bookmakers.forEach((bm) => {
      if (bm.ID && !result[bm.ID]) {
        result[bm.ID] = { name: bm.Name, color: bm.Color || "#4f77ff" };
      }
    });
  }
  Object.values(obj).forEach((val) => collectBmMeta(val, result));
  return result;
}
