require("dotenv").config();
const { app } = require("@azure/functions");
const { vectorSearch } = require("../elastic-config")
app.http("elastic-vector-search", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);

    const keywords = request.query.get("keywords");
    if (keywords) {
      const searchResult = await vectorSearch(keywords);
      return { jsonBody: searchResult };
    }
  },
});
