import { YoutubeTranscript } from "youtube-transcript";
import { GoogleGenerativeAI } from "@google/generative-ai";
import inquirer from "inquirer";
import fs from "node:fs/promises";
import path from "node:path";

async function processVideo(url: string) {
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
      Act as an expert synthesizer. Analyze the video transcript and generate an executive summary in spanish that:
      1. Captures key points and relevant data
      2. Eliminates redundancies and superfluous details
      3. Prioritizes practical and actionable information
      
      Structure the summary in professional markdown with:
      - Descriptive title
      - Organized subtitles
      - Bold key concepts
      - Format optimized for publication
      
      The summary should be concise, complete, clear, and valuable.
      `,
      processedTranscript.join("\n"),
    ]);

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `resumen-${videoId}-${timestamp}.md`;

    await fs.writeFile(
      path.join(process.cwd(), filename),
      resume.response.text()
    );
    console.log(`✅ Resumen guardado en ${filename}`);
  } catch (error) {
    console.error(`❌ Error procesando video ${url}:`, error);
  }
}

async function main() {
  const { urls } = await inquirer.prompt([
    {
      type: "input",
      name: "urls",
      message: "Ingresa las URLs de YouTube (separadas por comas):",
      validate: (input) => {
        if (!input) return "Por favor ingresa al menos una URL";
        const urls = input.split(",").map((url) => url.trim());
        const validUrls = urls.every((url) =>
          url.includes("youtube.com/watch?v=")
        );
        return validUrls || "Por favor ingresa URLs válidas de YouTube";
      },
    },
  ]);

  const videoUrls = urls.split(",").map((url: string) => url.trim());

  console.log("\nProcesando videos...\n");

  for (const url of videoUrls) {
    await processVideo(url);
  }
}

main().catch(console.error);
