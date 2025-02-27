import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "node:fs/promises";
import path from "node:path";
import { YoutubeTranscript } from "youtube-transcript";
import type { ProcessVideoOptions } from "./types";

async function processVideo({ url, language, focus }: ProcessVideoOptions) {
  try {
    const geminiAPIKey = process.env.GEMINI_API_KEY;

    if (!geminiAPIKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    const videoId = url.split("v=")[1];
    const transcript = await YoutubeTranscript.fetchTranscript(url);
    const processedTranscript = transcript.map((t) => t.text);

    const genAI = new GoogleGenerativeAI(geminiAPIKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const resume = await model.generateContent([
      `
        Act as an expert synthesizer. Analyze the video transcript and generate an executive summary in ${language} that:
        1. Captures key points and relevant data
        2. Eliminates redundancies and superfluous details
        3. Prioritizes practical and actionable information
        
        Structure the summary in professional markdown with:
        - Descriptive title
        - Organized subtitles
        - Bold key concepts
        - Format optimized for publication
  
        ${
          focus
            ? `- Focus on ${focus} and prioritize all information related to this topic above everything else. Make sure this aspect receives special attention and detailed analysis.`
            : ""
        }
        
        The summary should be concise, complete, clear, and valuable.
        `,
      processedTranscript.join("\n"),
    ]);

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `summary-${videoId}-${timestamp}.md`;

    await fs.writeFile(
      path.join(process.cwd(), filename),
      resume.response.text()
    );
    console.log(`✅ Summary saved in ${filename}`);
  } catch (error) {
    console.error(`❌ Error processing video ${url}:`, error);
  }
}

export default processVideo;
