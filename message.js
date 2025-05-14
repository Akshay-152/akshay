 
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs,
  query, where, onSnapshot, orderBy, serverTimestamp, updateDoc
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBfDB2Ca3Sb1mHuPN50i4nRzHFL_dgzpRA",
  authDomain: "message-792de.firebaseapp.com",
  projectId: "message-792de",
  storageBucket: "message-792de.appspot.com",
  messagingSenderId: "346450288358",
  appId: "1:346450288358:web:101992db1ca1de3af3e527",
  measurementId: "G-W7Q8K6B202"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let currentUser = null;
let isAdmin = false;
let selectedUserId = null;

const urlParams = new URLSearchParams(window.location.search);
const firstMessage = urlParams.get("message");

window.signup = async function () {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!username || !password) return displayError("Please enter both username and password.");

  const q = query(collection(db, "users_data"), where("username", "==", username));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) return displayError("Username already exists.");

  await addDoc(collection(db, "users_data"), { username, password, role: "you" });
  showCustomAlert("Signup successful! You can now log in.<br><b>Please remember your username and password.</b>");
};

window.login = async function () {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "Abcd₹1234567" && password === "Abcd₹1234567") {
    isAdmin = true;
    showChatPanel();
    loadAdminUsers();
    return;
  }

  const q = query(collection(db, "users_data"), where("username", "==", username), where("password", "==", password));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return displayError("Invalid username or password. Please sign up if you're new.");

  currentUser = snapshot.docs[0].id;
  showChatPanel();

  if (firstMessage) {
    const chatRef = collection(db, "chat_messages", currentUser, "chat");
    const chatSnap = await getDocs(chatRef);
    if (chatSnap.empty) {
      await addDoc(chatRef, {
        sender: "you",
        message: firstMessage,
        timestamp: serverTimestamp(),
        read: false
      });
    }
  }

  loadUserChat(currentUser);
};

function showChatPanel() {
  document.getElementById("auth").style.display = "none";
  document.getElementById("chat-panel").style.display = "flex";
}
window.logout = function () { location.reload(); };
function displayError(msg) {
  document.getElementById("auth-error").innerText = msg;
}

function formatTimestamp(ts) {
  if (!ts) return "";
  const date = ts.toDate();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${day}/${month}, ${hours}:${minutes} ${ampm}`;
}

function renderMessageContent(msg, container, userId) {
  if (msg.message === "__FEEDBACK_REQUEST__") {
    if (!isAdmin && currentUser === userId) {
      const starsDiv = document.createElement("div");
      starsDiv.className = "feedback-stars";

      for (let i = 1; i <= 5; i++) {
        const star = document.createElement("span");
        star.className = "star";
        star.innerHTML = "★";
        star.onclick = async () => {
          starsDiv.querySelectorAll(".star").forEach(s => s.classList.remove("selected"));
          for (let j = 0; j < i; j++) starsDiv.children[j].classList.add("selected");

          await addDoc(collection(db, "feedback"), {
            userId,
            rating: i,
            timestamp: serverTimestamp()
          });

          await addDoc(collection(db, "chat_messages", userId, "chat"), {
            sender: "you",
            message: `Feedback: ${i} star`,
            timestamp: serverTimestamp(),
            read: false
          });
        };
        starsDiv.appendChild(star);
      }

      container.appendChild(document.createTextNode("Please rate our service by clicking the stars:"));
      container.appendChild(starsDiv);
    } else {
      container.innerText = "Sent a feedback request.";
    }
  } else if (msg.message.startsWith("@https://")) {
    const img = document.createElement("img");
    img.src = msg.message.substring(1);
    img.style.maxWidth = "200px";
    container.appendChild(img);
  } else {
    container.innerText = msg.message;
  }

  if (msg.timestamp) {
    const timeDiv = document.createElement("div");
    timeDiv.className = "timestamp";
    timeDiv.textContent = formatTimestamp(msg.timestamp);
    container.appendChild(timeDiv);
  }
}

function loadUserChat(userId) {
  const chatRef = collection(db, "chat_messages", userId, "chat");
  const q = query(chatRef, orderBy("timestamp"));

  onSnapshot(q, snapshot => {
    const msgBox = document.getElementById("messages");
    msgBox.innerHTML = "";

    snapshot.forEach(doc => {
      const msg = doc.data();
      const div = document.createElement("div");
      const label = document.createElement("div");
      label.className = "message-sender";
      label.innerText = msg.sender === "you" ? "You" : "Admin";

      const messageDiv = document.createElement("div");
      messageDiv.className = "message " + (msg.sender === "you" ? "you" : "admin");
      renderMessageContent(msg, messageDiv, userId);

      div.appendChild(label);
      div.appendChild(messageDiv);
      msgBox.appendChild(div);
    });

    msgBox.scrollTop = msgBox.scrollHeight;
  });
}

function loadMessagesForAdmin(userId, msgBox, greenDot) {
  const chatRef = collection(db, "chat_messages", userId, "chat");
  const q = query(chatRef, orderBy("timestamp"));

  onSnapshot(q, snapshot => {
    msgBox.innerHTML = "";

    snapshot.forEach(doc => {
      const msg = doc.data();
      const messageDiv = document.createElement("div");
      messageDiv.className = "message " + (msg.sender === "you" ? "you" : "admin");
      renderMessageContent(msg, messageDiv, userId);
      msgBox.appendChild(messageDiv);
    });

    msgBox.scrollTop = msgBox.scrollHeight;
    snapshot.forEach(doc => {
      if (doc.data().sender === "you" && !doc.data().read) {
        updateDoc(doc.ref, { read: true });
      }
    });
  });
}

function loadAdminUsers() {
  const userList = document.getElementById("userList");

  onSnapshot(query(collection(db, "users_data"), where("role", "==", "you")), snapshot => {
    userList.innerHTML = "";

    snapshot.forEach(userDoc => {
      const userId = userDoc.id;
      const user = userDoc.data();

      const div = document.createElement("div");
      div.className = "user";
      div.innerText = user.username;

      const greenDot = document.createElement("span");
      greenDot.className = "green-dot";
      greenDot.style.display = "none";
      div.appendChild(greenDot);

      const chatContainer = document.createElement("div");
      chatContainer.className = "collapsible";

      const msgBox = document.createElement("div");
      msgBox.className = "messages";
      chatContainer.appendChild(msgBox);

      const inputBox = document.createElement("div");
      inputBox.className = "input-box";
      const input = document.createElement("input");
      const sendButton = document.createElement("button");
      sendButton.innerText = "Send";

      inputBox.appendChild(input);
      inputBox.appendChild(sendButton);
      chatContainer.appendChild(inputBox);

      const openButton = document.createElement("button");
      openButton.innerText = "Open Chat";
      openButton.className = "open-chat-btn";
      openButton.onclick = () => {
        chatContainer.classList.toggle("active");
        selectedUserId = userId;
        greenDot.style.display = "none";
        loadMessagesForAdmin(userId, msgBox, greenDot);

        sendButton.onclick = async () => {
          const msg = input.value.trim();
          if (!msg) return;

          const content = msg.toLowerCase() === "feedback" ? "__FEEDBACK_REQUEST__" : msg;
          await addDoc(collection(db, "chat_messages", userId, "chat"), {
            sender: "admin",
            message: content,
            timestamp: serverTimestamp(),
            read: true
          });
          input.value = "";
        };
      };

      div.appendChild(openButton);
      userList.appendChild(div);
      userList.appendChild(chatContainer);

      const chatRef = collection(db, "chat_messages", userId, "chat");
      const q = query(chatRef, where("sender", "==", "you"), where("read", "==", false));
      onSnapshot(q, unread => {
        greenDot.style.display = unread.empty ? "none" : "inline-block";
      });
    });
  });
}

window.sendMessage = async function () {
  const input = document.getElementById("messageInput");
  const msg = input.value.trim();
  if (!msg) return;

  const targetId = isAdmin ? selectedUserId : currentUser;
  if (!targetId) return;

  if (!isAdmin && msg === "¿") {
    const product = new URLSearchParams(window.location.search).get("message");
    if (product) {
      await addDoc(collection(db, "chat_messages", targetId, "chat"), {
        sender: "you",
        message: product,
        timestamp: serverTimestamp(),
        read: false
      });
    }
    input.value = "";
    return;
  }

  await addDoc(collection(db, "chat_messages", targetId, "chat"), {
    sender: isAdmin ? "admin" : "you",
    message: msg,
    timestamp: serverTimestamp(),
    read: isAdmin
  });

  input.value = "";
};

function showCustomAlert(message, autoClose = false) {
  const box = document.getElementById("custom-alert");
  document.getElementById("alert-message").innerHTML = message;
  box.style.display = "block";
  if (autoClose) setTimeout(() => hideCustomAlert(), 4000);
}
window.hideCustomAlert = function () {
  document.getElementById("custom-alert").style.display = "none";
};