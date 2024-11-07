# NYC Art Gallery Chatbot

See the live demo at [https://art.richtercloud.com](https://art.richtercloud.com/)

## Introduction

This project is a demo web app designed to highlight the benefits of Elasticsearch's integration with Azure AI services. The app is a bot assistant that helps users find art galleries in New York City. It leverages the power of Azure OpenAI and Elasticsearch to provide intelligent search capabilities and interactive chatbot functionalities.

## Solution Overview
Read the [Solution Overview](/Solution.md) here.

## Features

- **Interactive Chatbot**: A chatbot interface built with `react-chatbot-kit` that helps users find art galleries based on their preferences.
- **Elasticsearch Integration**: Utilizes Elasticsearch for indexing and searching over 900 art galleries.
- **Azure OpenAI**: Integrates with Azure OpenAI for natural language processing and generating responses.
- **Azure OpenAI Assistants API**: Captures chat history, state, and function calling to provide a seamless user experience.


## Project Structure

The project is divided into several key directories and files:

- **api/**: Contains the backend code for interacting with Elasticsearch and OpenAI.
  - **src/**: Source files for the backend.
    - **assistant.js**: Handles the interaction with OpenAI, including processing user queries and streaming responses.
    - **elastic-config.js**: Manages the configuration and requests to Elasticsearch.
- **build/**: Contains the build artifacts for the frontend.
- **public/**: Public assets for the frontend.
- **src/**: Source files for the frontend.
  - **App.js**: Main entry point for the React application.
  - **chatbot/**: Contains the configuration and logic for the chatbot.
- **.github/**: GitHub workflows for CI/CD.
- **package.json**: Project dependencies and scripts.
- **README.md**: Project documentation.

## Getting Started

### Prerequisites

- Node.js
- npm
- Azure account
   - An Azure OpenAI instance with a Chat Completion model deployed
   - A Static Web App (if deploying to the cloud)
- Elasticsearch cluster

### Installation

> Note that this sample code does not automate the deployment of any of the services (Azure OpenAI, Static Web App, ElasticSearch). The services need to be pre-existing and you will need the relevant API keys for the configuration.

1. Clone the repository:
   ```sh
   git https://github.com/michaelsrichter/art-gallery-chat-app.git
   cd art-gallery-chat-app
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the api directory with the following variables:
   ```sh
   # URL to download the CSV file containing art gallery data
   ARTGALLERYCSV=https://data.cityofnewyork.us/api/views/43hw-uvdj/rows.csv?date=20241016&accessType=DOWNLOAD

   # URL of your Elasticsearch cluster
   ELASTIC_CLUSTER=https://your-elastic-cluster-url

   # API key for accessing your Elasticsearch cluster
   ELASTIC_API_KEY=your-elastic-api-key

   # Name of the Elasticsearch index to use
   ELASTIC_SEARCH_INDEX=nyc-art-galleries

   # Field in Elasticsearch to store vector embeddings
   ELASTIC_VECTOR_FIELD=embedding

   # Model ID for the embedding model in Elasticsearch
   ELASTIC_EMBEDDING_MODEL_ID=azure_openai_embeddings

   # Model ID for the completion model in Elasticsearch
   ELASTIC_COMPLETION_MODEL_ID=azure_openai_completions

   # Model ID for the inference pipeline in Elasticsearch
   ELASTIC_INFERENCE_PIPELINE_MODEL_ID=inferences_pipeline

   # Base URL for your Azure OpenAI endpoint
   ENDPOINT_BASE=https://your-azure-openai-endpoint

   # Full URL for your Azure OpenAI deployment
   ENDPOINT=https://your-azure-openai-endpoint/openai/deployments/your-deployment-id/chat/completions?api-version=your-api-version

   # API key for accessing Azure OpenAI
   AZURE_API_KEY=your-azure-api-key

   # Resource name for the Azure embedding model
   AZURE_EMBEDDING_RESOURCE_NAME=your-embedding-resource-name

   # Deployment ID for the Azure embedding model
   AZURE_EMBEDDING_DEPLOYMENT_ID=your-embedding-deployment-id

   # Resource name for the Azure completion model
   AZURE_COMPLETION_RESOURCE_NAME=your-completion-resource-name

   # Deployment ID for the Azure completion model
   AZURE_COMPLETION_DEPLOYMENT_ID=your-completion-deployment-id

   # API version for the Azure embedding model
   AZURE_EMBEDDING_API_VERSION=2023-05-15

   # API version for the Azure completion model
   AZURE_COMPLETION_API_VERSION=2024-08-01-preview

   # Assistant ID for Azure OpenAI Assistants API
   ASSISTANT_ID=your-assistant-id
   ```

### Running the Application

1. Start the backend server:
   ```sh
   cd api
   npm start
   ```

2. Start the frontend development server:
   ```sh
   cd ../
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Running with Azure Static Web Apps CLI
To run the application using the Azure Static Web Apps CLI, follow these steps:

1. Install the Static Web Apps CLI tool from [here](https://azure.github.io/static-web-apps-cli/docs/use/install/).
2. Run 
   ```sh
   npm run build && swa start build --api-location api
   ```
3. Open [http://localhost:4280](http://localhost:4280) in your browser.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.