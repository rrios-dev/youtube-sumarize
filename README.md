# YouTube Transcript Summarizer
[![npm version](https://badge.fury.io/js/youtube-summarize.svg)](https://www.npmjs.com/package/youtube-summarize)

Welcome to the **YouTube Transcript Summarizer**! 🎉

Discover the power of summarizing YouTube videos effortlessly with our CLI tool. Published on [npmjs.com](https://www.npmjs.com/package/youtube-summarize), this package allows you to extract and summarize transcripts from YouTube videos using Google's Generative AI (Gemini). Perfect for professionals seeking concise, actionable insights from lengthy videos without the hassle of manual review.

## Overview
The **YouTube Transcript Summarizer** is a CLI tool that extracts transcripts from YouTube videos and generates executive summaries in Spanish using Google's Generative AI (Gemini). This tool is designed for professionals who need concise, actionable insights from long videos without manually going through the entire content.

## Features
- Extracts transcripts from YouTube videos automatically
- Summarizes transcripts using **Gemini AI** (Google Generative AI)
- Provides structured, professional markdown summaries
- Supports batch processing of multiple YouTube video URLs
- Ensures redundancy elimination and highlights key points
- Saves the generated summary as a markdown (.md) file

## Prerequisites
Before using this tool, make sure you have the following installed:
- [Bun](https://bun.sh/) runtime
- A valid **Gemini API Key** from Google

## Installation
To install the required dependencies, run:

```sh
bun install
```

## Usage
### 1. Set up the Gemini API Key
Ensure your API key is set in your environment variables:

```sh
export GEMINI_API_KEY=your_google_gemini_api_key
```

Alternatively, you can add it to your `.env` file:

```sh
GEMINI_API_KEY=your_google_gemini_api_key
```

### 2. Run the CLI Tool
Execute the script and input the YouTube video URLs when prompted:

```sh
bun run src/main.ts
```

You will be asked to enter one or multiple YouTube URLs separated by commas.

### 3. Output
After processing, the script generates a markdown file with the summary:

```
✅ Resumen guardado en resumen-[video_id]-[timestamp].md
```

The file contains:
- A **descriptive title**
- **Key highlights** formatted in bold
- **Subheadings** for better readability
- A markdown structure optimized for publishing

## Code Breakdown
### `processVideo(url: string)`
This function:
1. Extracts the video transcript using `YoutubeTranscript.fetchTranscript(url)`
2. Processes the text into a clean transcript array
3. Sends the processed transcript to Gemini AI for summarization
4. Saves the AI-generated summary as a markdown file

### `main()`
- Asks the user for YouTube video URLs via `inquirer`
- Calls `processVideo(url)` for each provided URL

## Dependencies
This project relies on the following libraries:

| Dependency | Version | Description |
|------------|---------|-------------|
| `@google/generative-ai` | ^0.21.0 | Google Generative AI SDK |
| `inquirer` | ^12.4.2 | CLI prompt handler |
| `youtube-transcript` | ^1.2.1 | Fetches YouTube transcripts |
| `@types/bun` | latest | TypeScript definitions for Bun |
| `typescript` | ^5.0.0 | TypeScript support |

## Error Handling
The script includes basic error handling to:
- Validate the presence of `GEMINI_API_KEY`
- Check if the YouTube URL is valid
- Catch and log errors during transcript fetching and AI processing

## Future Improvements
- Support for **multiple languages** beyond Spanish
- Improved error handling for missing transcripts
- **Custom summary length options** (short, medium, long)
- Integration with Google Drive or Notion for automatic storage
- Web-based interface for a more user-friendly experience

## License
This project is licensed under the **MIT License**. Feel free to use, modify, and distribute it as needed.

## Author
Developed by Roberto Ríos. Contributions and feedback are welcome!
