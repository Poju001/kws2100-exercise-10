import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();
// `serveStatic` makes Hono serve the output from `vite build`
app.get("*", serveStatic({ root: "../dist" }));
app.get("/", (c) => c.text("hello world"));
serve(app);
