import inquirer from "inquirer";
import processVideo from "./process-video";

async function main() {
  // Obtener argumentos de la línea de comandos
  const args = process.argv.slice(2);
  const urlArg = args.find((arg) => !arg.startsWith("-"));
  const languageIndex = args.findIndex(
    (arg) => arg === "-l" || arg === "--language"
  );
  const focusIndex = args.findIndex((arg) => arg === "-f" || arg === "--focus");

  let urls = urlArg || "";
  let language =
    languageIndex !== -1 && args[languageIndex + 1]
      ? args[languageIndex + 1]
      : "Spanish";
  let focus =
    focusIndex !== -1 && args[focusIndex + 1] ? args[focusIndex + 1] : "";

  // Si no hay URLs, preguntar al usuario
  if (!urls) {
    const urlResponse = await inquirer.prompt([
      {
        type: "input",
        name: "urls",
        message: "🔗 Enter YouTube URLs (separated by commas):",
        validate: (input) => {
          if (!input) return "❌ Por favor, ingresa al menos una URL.";
          const urls = input.split(",").map((url) => url.trim());
          const validUrls = urls.every(
            (url) =>
              url.includes("youtube.com/watch?v=") ||
              url.includes("youtu.be/") ||
              url.includes("youtube.com/shorts/") ||
              url.includes("m.youtube.com/watch?v=")
          );
          return validUrls || "❌ Enter valid YouTube URLs.";
        },
      },
    ]);
    urls = urlResponse.urls;
  }

  // Si no hay idioma, preguntar al usuario
  if (languageIndex === -1) {
    const langResponse = await inquirer.prompt([
      {
        type: "input",
        name: "language",
        message:
          "🌍 ¿In what language do you want the summary? (Ej: Spanish, English, French...)",
        default: "Spanish",
      },
    ]);
    language = langResponse.language;
  }

  // Si no hay focus, preguntar al usuario si quiere definirlo
  if (focusIndex === -1) {
    const focusResponse = await inquirer.prompt([
      {
        type: "input",
        name: "focus",
        message:
          "🎯 Do you want the summary to have a special focus? (Optional, press Enter to skip)",
      },
    ]);
    focus = focusResponse.focus;
  }

  const videoUrls = urls.split(",").map((url) => url.trim());

  console.log("\n🚀 Processing videos...");
  console.log(`📌 Selected language: ${language}`);
  console.log(
    focus ? `🔍 Summary focus: ${focus}` : "📜 Summary focus: General"
  );
  console.log("----------------------------------\n");

  const promises = videoUrls.map((url) =>
    processVideo({ url, language, focus })
  );
  await Promise.all(promises);
}

main().catch(console.error);
