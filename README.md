# NYC Art Gallery Chat App

## Introduction

This project is a comprehensive web application designed to assist users in finding art galleries in New York City. It leverages the power of Azure OpenAI and Elasticsearch to provide intelligent search capabilities and interactive chatbot functionalities.

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
- Elasticsearch cluster

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/project-name.git
   cd project-name
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the api directory with the following variables:
   ```env
   ELASTIC_CLUSTER=your_elastic_cluster_url
   ELASTIC_SEARCH_INDEX=your_index_name
   ELASTIC_API_KEY=your_elastic_api_key
   AZURE_API_KEY=your_azure_api_key
   AZURE_EMBEDDING_RESOURCE_NAME=your_embedding_resource_name
   AZURE_EMBEDDING_DEPLOYMENT_ID=your_embedding_deployment_id
   AZURE_EMBEDDING_API_VERSION=your_embedding_api_version
   AZURE_COMPLETION_RESOURCE_NAME=your_completion_resource_name
   AZURE_COMPLETION_DEPLOYMENT_ID=your_completion_deployment_id
   AZURE_COMPLETION_API_VERSION=your_completion_api_version
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

## Available Scripts

### [`npm start`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fhome%2Fmike%2Fprojects%2Felastic%2Fart%2Fchat-app%2FREADME.md%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A8%2C%22character%22%3A5%7D%7D%5D%2C%22381933db-54ad-4481-8270-11e4caa67333%22%5D "Go to definition")

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### [`npm test`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fhome%2Fmike%2Fprojects%2Felastic%2Fart%2Fchat-app%2FREADME.md%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A16%2C%22character%22%3A5%7D%7D%5D%2C%22381933db-54ad-4481-8270-11e4caa67333%22%5D "Go to definition")

Launches the test runner in interactive watch mode.

### [`npm run build`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fhome%2Fmike%2Fprojects%2Felastic%2Fart%2Fchat-app%2FREADME.md%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A21%2C%22character%22%3A5%7D%7D%5D%2C%22381933db-54ad-4481-8270-11e4caa67333%22%5D "Go to definition")

Builds the app for production to the build folder.

### [`npm run eject`](command:_github.copilot.openSymbolFromReferences?%5B%22%22%2C%5B%7B%22uri%22%3A%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fhome%2Fmike%2Fprojects%2Felastic%2Fart%2Fchat-app%2FREADME.md%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%2C%22pos%22%3A%7B%22line%22%3A31%2C%22character%22%3A5%7D%7D%5D%2C%22381933db-54ad-4481-8270-11e4caa67333%22%5D "Go to definition")

Ejects the configuration files and dependencies for customization.

## Learn More

To learn more about the tools and technologies used in this project, check out the following resources:

- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Documentation](https://reactjs.org/)
- [Azure OpenAI Documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/openai/)
- [Elasticsearch Documentation](https://www.elastic.co/guide/index.html)

## License

This project is licensed under the MIT License. See the LICENSE file for details.