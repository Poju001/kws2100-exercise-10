import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import pg from "pg";

const postgresql = new pg.Pool({
  connectionString:
    process.env.DATABASE_URL || "postgresql://postgres:@localhost",
});

const app = new Hono();

app.get("/api/skoler", async (c) => {
  const result = await postgresql.query(
    "select organisasjonsnummer, skolenavn, st_transform(posisjon, 4326)::json as geometry from grunnskole",
  );

  return c.json({
    type: "FeatureCollection",
    crs: { type: "name", properties: { name: "ESPG:4326" } },
    features: result.rows.map(
      ({ geometry: { coordinates, type }, ...properties }) => ({
        type: "Feature",
        geometry: { type, coordinates },
        properties,
      }),
    ),
  });
});

app.use("*", serveStatic({ root: "../dist" }));

serve(app);
