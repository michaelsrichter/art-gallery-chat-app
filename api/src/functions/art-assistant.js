require("dotenv").config();
const { Readable } = require("node:stream");
const { app } = require("@azure/functions");
const { processQuery } = require("../assistant");

app.setup({ enableHttpStream: true });
app.http("art-assistant", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request) => {
    console.log(`Http function processed request for url "${request.url}"`);
    const threadId = request.query.get("threadId") || "";
    const query = await request.text();
    return {
      headers: {
        "Content-Type": "application/octet-stream",
        "Transfer-Encoding": "chunked",
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: Readable.from(processQuery(query, threadId)),
    };
  },
});
