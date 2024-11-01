
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function run(pdfContent) {
    let question = document.getElementById("question").innerText;
    const code = document.getElementById("codeEditor").value;

    const criteria = `Summariz the pdf connent in a short and simple language and frame 5 question at the last 
    follow this format
    
    
    1.Summary
    2.Question based on the summary`;

    const prompt = `${criteria}\n\n ${pdfContent}`;

    try {
        console.log(prompt);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        let blurback = document.getElementById("blurback");
        let popup = document.getElementById("popupContainer");

        blurback.style.display = "block";
        popup.style.display = "block";

        let popupContent = document.getElementById("popup-content");
        let popupTitle = document.getElementById("popup-title");

        if (text.includes("1")) {
            popupTitle.innerText = "Code is Correct";
            popupContent.innerText = text.replace("1", "");
            document.getElementById("popup-title").style.color = "Lime";
        } else {
            popupTitle.innerText = "Code has Error";
            popupContent.innerText = text;
            document.getElementById("popup-title").style.color = "Red";
        }

        console.log(text); 
    } catch (error) {
        console.error("Error generating content:", error);
    }
}
export { run };

