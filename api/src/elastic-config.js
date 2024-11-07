require("dotenv").config();
const axios = require("axios");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

async function downloadAndParseCSV(url) {
  const filePath = path.join(__dirname, "art_gallery.csv");

  // Download the CSV file
  const response = await axios({
    method: "get",
    url: url,
    responseType: "stream",
  });

  // Save the CSV file locally
  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);

  // Wait for the file to be fully written
  await new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });

  // Parse the CSV file
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        // Sort the values of the object
        const sortedValues = Object.values(data).sort().join("");

        // Create a hash of the sorted values
        const hash = crypto
          .createHash("sha256")
          .update(sortedValues)
          .digest("hex");

        // Add the hash as a new property
        data.hash = hash;
        data.contact = `${data.NAME}\n${data.ADDRESS1}\n${data.ADDRESS2}\n${data.CITY}\n${data.ZIP}\n${data.URL}`;
        data.prompt =
          "In 500 words, tell me about everything you know about the art gallery mentioned below. Tell me what kind of art they exhibit, what kind of artists they represent, and what kind of events they host. Also, tell me about the location of the gallery, the history of the gallery, and any other interesting facts you know about the gallery. If you know the name of specific artists or art pieces that have been exhibited here, please include that. If you know the proprietors of this art gallery, please include that as well. The gallery is called " +
          data.contact +
          ".";
        results.push(data);
      })
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

async function addGalleriesToIndex(url) {
  try {
    const galleries = await downloadAndParseCSV(url);
    const ndjson = galleries
      .map((gallery) => {
        return `{ "index": { "_index": "${
          process.env.ELASTIC_SEARCH_INDEX
        }", "_id": "${gallery.hash}" } }\n${JSON.stringify({
          name: gallery.NAME,
          prompt: gallery.prompt,
          contact: gallery.contact,
        })}`;
      })
      .join("\n");

    //use elastic bulk api to add data to index
    console.log("Adding data to index");
    axios.request({
      method: "post",
      maxBodyLength: Infinity,
      url: `${process.env.ELASTIC_CLUSTER}/_bulk?pipeline=${process.env.ELASTIC_INFERENCE_PIPELINE_MODEL_ID}`,
      headers: {
        Authorization: `ApiKey ${process.env.ELASTIC_API_KEY}`,
        "Content-Type": "application/x-ndjson",
      },
      data: ndjson + "\n",
    });
    console.log("Data added to index");
  } catch (error) {
    console.error("Error adding data to index");
    console.error(error);
  }
}

function makeAxiosRequest(config) {
  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
}

// Array of data and config paired objects
const requests = [
  {
    // Request to create or update the Elasticsearch index
    data: {},
    config: {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.ELASTIC_CLUSTER}/${process.env.ELASTIC_SEARCH_INDEX}`,
      headers: {
        Authorization: `ApiKey ${process.env.ELASTIC_API_KEY}`,
      },
    },
  },
  {
    // Request to configure the text embedding model in Elasticsearch
    data: JSON.stringify({
      service: "azureopenai",
      service_settings: {
        api_key: process.env.AZURE_API_KEY,
        resource_name: process.env.AZURE_EMBEDDING_RESOURCE_NAME,
        deployment_id: process.env.AZURE_EMBEDDING_DEPLOYMENT_ID,
        api_version: process.env.AZURE_EMBEDDING_API_VERSION,
      },
    }),
    config: {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.ELASTIC_CLUSTER}/_inference/text_embedding/${process.env.ELASTIC_EMBEDDING_MODEL_ID}`,
      headers: {
        Authorization: `ApiKey ${process.env.ELASTIC_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  },
  {
    // Request to configure the completion model in Elasticsearch
    data: JSON.stringify({
      service: "azureopenai",
      service_settings: {
        api_key: process.env.AZURE_API_KEY,
        resource_name: process.env.AZURE_COMPLETION_RESOURCE_NAME,
        deployment_id: process.env.AZURE_COMPLETION_DEPLOYMENT_ID,
        api_version: process.env.AZURE_COMPLETION_API_VERSION,
      },
    }),
    config: {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.ELASTIC_CLUSTER}/_inference/completion/${process.env.ELASTIC_COMPLETION_MODEL_ID}`,
      headers: {
        Authorization: `ApiKey ${process.env.ELASTIC_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  },
  {
    // Request to configure the inference pipeline in Elasticsearch
    data: JSON.stringify({
      processors: [
        {
          inference: {
            model_id: process.env.ELASTIC_COMPLETION_MODEL_ID,
            input_output: {
              input_field: "prompt",
              output_field: "content",
            },
          },
        },
        {
          inference: {
            model_id: process.env.ELASTIC_EMBEDDING_MODEL_ID,
            input_output: {
              input_field: "content",
              output_field: "embedding",
            },
          },
        },
      ],
    }),
    config: {
      method: "put",
      maxBodyLength: Infinity,
      url: `${process.env.ELASTIC_CLUSTER}/_ingest/pipeline/${process.env.ELASTIC_INFERENCE_PIPELINE_MODEL_ID}`,
      headers: {
        Authorization: `ApiKey ${process.env.ELASTIC_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  },
];
async function vectorSearch(keywords) {
  let data = JSON.stringify({
    knn: {
      field: process.env.ELASTIC_VECTOR_FIELD,
      k: 10,
      num_candidates: 100,
      query_vector_builder: {
        text_embedding: {
          model_id: process.env.ELASTIC_EMBEDDING_MODEL_ID,
          model_text: keywords,
        },
      },
    },
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${process.env.ELASTIC_CLUSTER}/${process.env.ELASTIC_SEARCH_INDEX}/_search?pretty`,
    headers: {
      Authorization: `ApiKey ${process.env.ELASTIC_API_KEY}`,
      "Content-Type": "application/json",
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    const hits = response.data.hits.hits
      .map((hit) => `score: ${hit._score}\ncontent: ${hit._source.content}`)
      .join("\n\n");
    return hits;
  } catch (error) {
    console.error("Error conducting vector search:", error);
    return { error: "Vector search failed" };
  }
}


async function init()
{
  requests.forEach((request) => {
    request.config.data = request.data; // Assign data to config
    console.log("submitting to " + request.config.url);
    makeAxiosRequest(request.config);
  });
  addGalleriesToIndex(process.env.ARTGALLERYCSV);
}


module.exports = { vectorSearch, init };
