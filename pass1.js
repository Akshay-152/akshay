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
    let products = [];

    function showAuthForm() {
      document.getElementById("upload-form").classList.add("hidden");
      document.getElementById("auth-form").classList.remove("hidden");
    }

    function closeAuthForm() {
      document.getElementById("auth-form").classList.add("hidden");
    }

    function authenticate() {
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();
      if (username === "1234" && password === "1234") {
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
      db.collection("products").add({ name, price, images, link })
        .then(() => {
          alert("Product uploaded successfully!");
          location.reload();
        })
        .catch(error => {
          console.error("Error uploading product:", error);
          alert("Upload failed.");
        });
    }

    function renderProducts(container, productList) {
      container.innerHTML = "";
      productList.forEach((product, index) => {
        const waMessage = encodeURIComponent(`Hi! I'm interested in "${product.name}" priced at ₹${product.price}, id = ${product.link}.`);
        const waLink = `https://wa.me/916235718185?text=${waMessage}`;

        const card = document.createElement("div");
        card.classList.add("product-card");
        card.innerHTML = `
          <img id="mainImage${index}" class="product-img" src="${product.images[0]}" alt="${product.name}">
          <h2>${product.name}</h2>
          <p class="price">₹${product.price.toFixed(2)}</p>
          <div class="thumbnail-container">
            ${product.images.map((img, i) =>
              `<img class="thumbnail" src="${img}" onclick="changeImage(${index}, '${img}')">`).join('')}
          </div>
          <a href="${waLink}" class="shop-now-btn" target="_blank">Shop Now</a>
        `;
        container.appendChild(card);
      });
    }
    


    function changeImage(index, newSrc) {
      document.getElementById(`mainImage${index}`).src = newSrc;
    }
    
    
    

    document.getElementById('search-input').addEventListener('input', function () {
      const query = this.value.trim().toLowerCase();
      const noResults = document.getElementById("noResults");
      const otherProductsContainer = document.getElementById("otherProducts");
      let filtered = [], others = [];

      if (query === "") {
        renderProducts(document.getElementById("productGrid"), products);
        noResults.style.display = "none";
        otherProductsContainer.style.display = "none";
        return;
      }

      if (query.includes("<=")) {
        const priceLimit = parseFloat(query.split("<=")[1]);
        filtered = products.filter(p => p.price <= priceLimit);
        others = products.filter(p => p.price > priceLimit);
      } else if (!isNaN(query)) {
        const exact = parseFloat(query);
        filtered = products.filter(p => p.price === exact);
        others = products.filter(p => p.price !== exact);
      } else {
        filtered = products.filter(p => p.name.toLowerCase().includes(query));
        others = products.filter(p => !p.name.toLowerCase().includes(query));
      }

      renderProducts(document.getElementById("productGrid"), filtered);
      renderProducts(document.getElementById("otherProductGrid"), others);
      noResults.style.display = filtered.length ? "none" : "block";
      otherProductsContainer.style.display = "block";
    });

    db.collection("products").get().then(snapshot => {
      products = snapshot.docs.map(doc => doc.data());
      renderProducts(document.getElementById("productGrid"), products);
    });