# AI-Powered Knowledge Hub

A full-stack application for managing, summarizing, and exploring articles using Google Gemini LLM.

## Prerequisites
- Node.js (v18 or higher recommended)
- npm

## Project Structure
- `Backend/` — Node.js/Express API
- `Frontend/` — React + TypeScript client

## Setup Instructions

### 1. Clone the Repository
```sh
git clone <your-repo-url>
cd AiPowered
```

### 2. Backend Setup
```sh
cd Backend
npm install
```

#### Environment Variables
- Copy `.env.example` to `.env` and fill in your values:
  ```sh
  cp .env.example .env
  ```
- Required variables:
  - `GEMINI_API_KEY` — Your Google Gemini API key (see below)
  - `MONGODB_URI` — Your MongoDB connection string
  - `SECRET_KEY` — JWT secret for authentication

#### Running the Backend
```sh
node server.js
# or
npm start
```

### 3. Frontend Setup
```sh
cd ../Frontend
npm install
npm run dev
```

#### Environment Variables (Optional)
- If you need to configure the frontend, copy `.env.example` to `.env` and adjust as needed.

### 4. LLM Provider: Google Gemini
- This project uses **Google Gemini** for article summarization.
- Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey) and set it as `GEMINI_API_KEY` in your backend `.env`.

#### Mocking or Disabling LLM
- If you do not want to use Gemini, you can mock the summarization in `Backend/llm/index.js`:
  ```js
  async function summarizeWithLLM(content) {
    return "[Mock summary] This is a placeholder summary.";
  }
  ```
- Or, leave `GEMINI_API_KEY` blank to disable summarization (the app will show a message).

## Sample .env.example
See `.env.example` in the Backend folder for required variables.

## License
MIT 