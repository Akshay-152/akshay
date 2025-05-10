const firebaseConfig = {
  apiKey: "AIzaSyBqMZ-UBOVmyVa1m9mJpBsAZI7ojCGGk2w",
  authDomain: "akshay-be458.firebaseapp.com",
  projectId: "akshay-be458",
  storageBucket: "akshay-be458.appspot.com",
  messagingSenderId: "49554097790",
  appId: "1:49554097790:web:f2800055f7be2f01d2ba2f"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function authenticate() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  if (username === "usname" && password === "12346") {
    document.getElementById("auth-form").classList.add("hidden");
    document.getElementById("upload-form").classList.remove("hidden");
  } else {
    alert("Invalid credentials");
  }
}

function uploadProduct() {
  const name = document.getElementById("name").value;
  const price = parseFloat(document.getElementById("price").value);
  const images = [
    document.getElementById("image1").value,
    document.getElementById("image2").value,
    document.getElementById("image3").value
  ];
  const link = document.getElementById("link").value;

  if (!name || !price || !link || images.some(img => img === "")) {
    alert("Please fill all fields.");
    return;
  }

  db.collection("product2").add({ name, price, images, link })
    .then(() => {
      alert("Product uploaded successfully to product2!");
      location.reload();
    })
    .catch(error => {
      console.error("Error uploading product:", error);
      alert("Upload failed.");
    });
}