// Import Bootstrap JS and dependencies
import "bootstrap";

// Import custom modules
import { initializeNavbar } from "./modules/navbar";
import { initializeHero } from "./modules/hero";
import { initializeFloorPlan } from "./modules/floor-plan";
import { initializeGallery } from "./modules/gallery";
import { initializeContactForm } from "./modules/contact";
import { initializeMortgageCalculator } from "./modules/calculator";

// 立即初始化房贷计算器
try {
  const calculatorForm = document.getElementById("mortgageCalculator");
  if (calculatorForm) {
    console.log("main.js: 找到计算器表单，尝试初始化计算器...");
    initializeMortgageCalculator();
  }
} catch (error) {
  console.error("main.js: 初始化计算器时出错:", error);
}

// Initialize components when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM完全加载，初始化所有组件");

  // Initialize Bootstrap components
  initializeNavbar();
  initializeHero();
  initializeFloorPlan();
  initializeGallery();
  initializeContactForm();

  // 再次尝试初始化计算器以确保它加载
  try {
    initializeMortgageCalculator();
  } catch (error) {
    console.error("DOM加载后初始化计算器失败:", error);
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Add scroll event listener for navbar background
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("navbar-scrolled");
      } else {
        navbar.classList.remove("navbar-scrolled");
      }
    });
  }
});

const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessage = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancelButton = fileUploadWrapper.querySelector("#file-cancel");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");
// API setup
// Initialize user message and file data
const userData = {
  message: null,
  file: {
    data: null,
    mime_type: null,
  },
};
// Store chat history
const chatHistory = [];
const initialInputHeight = messageInput.scrollHeight;
// Create message element with dynamic classes and return it
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};
// Generate bot response using API
import { askGithubModel } from "./modules/github-api.js";

const generateBotResponse = async (incomingMessageDiv) => {
  const messageElement = incomingMessageDiv.querySelector(".message-text");

  try {
    const userQuestion = userData.message;

    // 1. 先发送用户问题到本地 RAG 模型
    const ragResponse = await fetch("http://localhost:5000/rag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: userQuestion }),
    });

    const ragData = await ragResponse.json(); // 假设返回 { context: "...", question: "..." }

    // 2. 把 RAG 的内容加上用户问题，一起传给 GitHub 模型
    const combinedPrompt = `
You are an estate assistant. Based on the context provided below, you should answer the user's question related to Sole Estate residential, keeping the tone friendly and approachable.

Knowledge trained:
${ragData.context}

Question: ${ragData.question}

### Instructions:
1. Answer the question based on the knowledge trained and the chat history. Treat them as what you already know, not externally given to you.
2. If the question is unrelated to Sole Estate residential, politely guide the user back to topics relevant to Sole Estate residential.
3. Keep responses clear, concise, and tailored to the user's needs.
4. Answer directly without additional phrases.
5. Don't introduce yourself unless asked to do so.
6. Please provide a response without using bold formatting or double asterisks. Avoid any text formatting like **this** and ensure the output is plain text.
`;

    const reply = await askGithubModel(combinedPrompt);
    messageElement.innerText = reply;
    chatHistory.push({
      role: "model",
      parts: [{ text: reply }],
    });
  } catch (error) {
    console.error(error);
    messageElement.innerText = error.message;
    messageElement.style.color = "#ff0000";
  } finally {
    incomingMessageDiv.classList.remove("thinking");
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
  }
};

// Handle outgoing user messages
const handleOutgoingMessage = (e) => {
  e.preventDefault();
  userData.message = messageInput.value.trim();
  messageInput.value = "";
  messageInput.dispatchEvent(new Event("input"));
  fileUploadWrapper.classList.remove("file-uploaded");
  // Create and display user message
  const messageContent = `<div class="message-text"></div>
                          ${
                            userData.file.data
                              ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />`
                              : ""
                          }`;
  const outgoingMessageDiv = createMessageElement(
    messageContent,
    "user-message"
  );
  outgoingMessageDiv.querySelector(".message-text").innerText =
    userData.message;
  chatBody.appendChild(outgoingMessageDiv);
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
  // Simulate bot response with thinking indicator after a delay
  setTimeout(() => {
    const messageContent = `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
            <path
              d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z"/></svg>
          <div class="message-text">
            <div class="thinking-indicator">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          </div>`;
    const incomingMessageDiv = createMessageElement(
      messageContent,
      "bot-message",
      "thinking"
    );
    chatBody.appendChild(incomingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    generateBotResponse(incomingMessageDiv);
  }, 600);
};
// Adjust input field height dynamically
messageInput.addEventListener("input", () => {
  messageInput.style.height = `${initialInputHeight}px`;
  messageInput.style.height = `${messageInput.scrollHeight}px`;
  document.querySelector(".chat-form").style.borderRadius =
    messageInput.scrollHeight > initialInputHeight ? "15px" : "32px";
});
// Handle Enter key press for sending messages
messageInput.addEventListener("keydown", (e) => {
  const userMessage = e.target.value.trim();
  if (
    e.key === "Enter" &&
    !e.shiftKey &&
    userMessage &&
    window.innerWidth > 768
  ) {
    handleOutgoingMessage(e);
  }
});
// Handle file input change and preview the selected file
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    fileInput.value = "";
    fileUploadWrapper.querySelector("img").src = e.target.result;
    fileUploadWrapper.classList.add("file-uploaded");
    const base64String = e.target.result.split(",")[1];
    // Store file data in userData
    userData.file = {
      data: base64String,
      mime_type: file.type,
    };
  };
  reader.readAsDataURL(file);
});
// Cancel file upload
fileCancelButton.addEventListener("click", () => {
  userData.file = {};
  fileUploadWrapper.classList.remove("file-uploaded");
});
// Initialize emoji picker and handle emoji selection
const picker = new EmojiMart.Picker({
  theme: "light",
  skinTonePosition: "none",
  previewPosition: "none",
  onEmojiSelect: (emoji) => {
    const { selectionStart: start, selectionEnd: end } = messageInput;
    messageInput.setRangeText(emoji.native, start, end, "end");
    messageInput.focus();
  },
  onClickOutside: (e) => {
    if (e.target.id === "emoji-picker") {
      document.body.classList.toggle("show-emoji-picker");
    } else {
      document.body.classList.remove("show-emoji-picker");
    }
  },
});
document.querySelector(".chat-form").appendChild(picker);
sendMessage.addEventListener("click", (e) => handleOutgoingMessage(e));
document
  .querySelector("#file-upload")
  .addEventListener("click", () => fileInput.click());
closeChatbot.addEventListener("click", () =>
  document.body.classList.remove("show-chatbot")
);
chatbotToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);
