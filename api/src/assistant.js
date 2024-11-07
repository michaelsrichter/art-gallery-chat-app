require("dotenv/config");
const { AzureOpenAI } = require("openai");
const { vectorSearch } = require("./elastic-config");

const { ASSISTANT_ID, AZURE_COMPLETION_DEPLOYMENT_ID } = process.env;

async function initAzureOpenAI(context) {
  return new AzureOpenAI({
    endpoint: process.env.ENDPOINT_BASE,
    apiKey: process.env.AZURE_API_KEY,
    apiVersion: process.env.AZURE_COMPLETION_API_VERSION,
  });
}

const assistantDefinition = {
  name: "Art Assistant",
  instructions:
    "You are a New York City tour guide focused on the art galleries and you will help people find the right art galleries based on their preferences. " +
    "You will be able to call a function that searches over 900 art galleries in New York City to help you respond to the user's query. " + 
    "Only use the functions you have been provideded with. Feel free to ask the user for more information if needed and suggested similar art or exhibits they might be interested in. " +
    "Do not respond to any requets that are not related to art, museums or art galleries in New York City. Kindly tell the user that you cannot help with that function. ",
  tools: [
    {
      type: "function",
      function: {
        name: "artGallerySearch",
        description:
          "Searches over 900 art galleries in New York City to help you respond to the user's query",
        parameters: {
          type: "object",
          properties: {
            keywords: {
              type: "string",
              description: "The user's query",
            },
          },
          required: ["keywords"],
        },
      },
    },
  ],
  model: AZURE_COMPLETION_DEPLOYMENT_ID,
};

async function* processQuery(userQuery, threadId = null) {
  console.log("Processing Query", { userQuery, threadId });
  console.log("Step 0: Connect and acquire an OpenAI instance");
  const openai = await initAzureOpenAI();

  console.log("Step 1: Retrieve or Create an Assistant");
  let assistant;
  if (ASSISTANT_ID) {
    console.log("Retrieving existing assistant with ID:", ASSISTANT_ID);
    assistant = await openai.beta.assistants.retrieve(ASSISTANT_ID);
  } else {
    console.log("Creating a new assistant with the provided definition.");
    assistant = await openai.beta.assistants.create(assistantDefinition);
  }

  console.log("Step 2: Retrieve or Create a Thread");
  const thread = threadId
    ? await openai.beta.threads.retrieve(threadId)
    : await openai.beta.threads.create();
  console.log("thread id is ", thread.id);

  console.log("Step 3: Add a Message to the Thread");
  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: userQuery,
  });

  console.log("Step 4: Create a Run (and stream the response)");
  const run = openai.beta.threads.runs.stream(thread.id, {
    assistant_id: assistant.id,
    stream: true,
  });

  console.log("Step 5: Read streamed response", { run });
  for await (const chunk of run) {
    const { event, data } = chunk;

    //only log if the event is not thread.run.step.delta
    if (event !== "thread.run.step.delta") {
      console.log("processing event", { event, data });
    }

    if (event === "thread.run.created") {
      yield thread.id;
      console.log("Processed thread.run.created");
    } else if (event === "thread.run.queued") {
      //yield "@queued";
      console.log("Processed thread.run.queued");
    } else if (event === "thread.run.in_progress") {
      yield "@";
      console.log("Processed thread.run.in_progress");
    } else if (event === "thread.message.delta") {
      const delta = data.delta;
      if (delta) {
        const value = delta.content[0]?.text?.value || "";
        yield value;
        //console.log("Processed thread.message.delta", { value });
      }
    } else if (event === "thread.run.failed") {
      const value = data.last_error.message;
      yield value;
      console.log("Processed thread.run.failed", { value });
    } else if (event === "thread.run.requires_action") {
      yield* handleRequiresAction(openai, data, data.id, data.thread_id);
    } 
    // else if ... handle the other events as needed
  }

  console.log("Done!");

}

async function* handleRequiresAction(openai, run, runId, threadId) {
  console.log("Handle Function Calling", {
    required_action: run.required_action.submit_tool_outputs.tool_calls,
  });
  try {
    const toolOutputs = await Promise.all(
      run.required_action.submit_tool_outputs.tool_calls.map(
        async (toolCall) => {
          console.log("Processing tool call:", JSON.stringify(toolCall));
          if (toolCall.function.name === "artGallerySearch") {
            return {
              tool_call_id: toolCall.id,
              output: await artGallerySearch(
                JSON.parse(toolCall.function.arguments).keywords
              ),
            };
          }
          return toolCall;
        }
      )
    );

    async function artGallerySearch(keywords) {
      return await vectorSearch(keywords);
    }

    // Submit all the tool outputs at the same time
    yield* submitToolOutputs(openai, toolOutputs, runId, threadId);
  } catch (error) {
    console.error("Error processing required action:", error);
  }
}

async function* submitToolOutputs(openai, toolOutputs, runId, threadId) {
  try {
    // Use the submitToolOutputsStream helper
    const asyncStream = openai.beta.threads.runs.submitToolOutputsStream(
      threadId,
      runId,
      { tool_outputs: toolOutputs }
    );
    for await (const chunk of asyncStream) {
      const { event, data } = chunk;
      if (event === "thread.message.delta") {
        // stream message back to UI
        const { delta } = data;

        if (delta) {
          const value = delta.content[0]?.text?.value || "";
          yield value;
        }
      }
      // else if ... handle the other events as needed
    }
  } catch (error) {
    console.error("Error submitting tool outputs:", error);
  }
}

module.exports = { processQuery };
