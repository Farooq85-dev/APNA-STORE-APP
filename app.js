//Initialize Toaster
toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: false,
  progressBar: false,
  positionClass: "toast-top-full-width",
  preventDuplicates: true,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "2000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};

let elecTechProducts = [
  {
    id: 1,
    discountPercentage: "-40%",
    title: "HAVIT HV-G92 Gamepad",
    image: "./images/bx1-img.png",
    quantity: 1,
    discountPrice: 100,
    price: 160,
  },
  {
    id: 2,
    discountPercentage: "-30%",
    title: "AK-900 Wired Keyboard",
    image: "./images/bx2-img.png",
    quantity: 1,
    discountPrice: 160,
    price: 180,
  },
  {
    id: 3,
    discountPercentage: "-30%",
    title: "ASUS FHD Gaming Laptop",
    image: "./images/bx3-img.png",
    quantity: 1,
    discountPrice: 180,
    price: 200,
  },
  {
    id: 4,
    discountPercentage: "-30%",
    title: "RGB liquid CPU Cooler",
    image: "./images/bx4-img.png",
    quantity: 1,
    discountPrice: 200,
    price: 180,
  },
  {
    id: 5,
    discountPercentage: "-30%",
    title: "CANON EOS DSLR Camera",
    image: "./images/bx5-img.png",
    quantity: 1,
    discountPrice: 160,
    price: 180,
  },
  {
    id: 6,
    discountPercentage: "-30%",
    title: "Kids Electric Car",
    image: "./images/bx6-img.png",
    quantity: 1,
    discountPrice: 180,
    price: 200,
  },
  {
    id: 7,
    discountPercentage: "-70%",
    title: "IPS LCD Gaming Monitor",
    image: "./images/bx7-img.png",
    quantity: 1,
    discountPrice: 60,
    price: 160,
  },
  {
    id: 8,
    discountPercentage: "-70%",
    title: "GP11 Shooter USB Gamepad",
    image: "./images/bx8-img.png",
    quantity: 1,
    discountPrice: 200,
    price: 220,
  },
];

let homeProducts = [
  {
    id: 9,
    discountPercentage: "-30%",
    title: "Jr. Zoom Soccer Cleats",
    image: "./images/bx9-img.png",
    quantity: 1,
    discountPrice: 120,
    price: 140,
  },
  {
    id: 10,
    discountPercentage: "-30%",
    title: "Quilted Satin Jacket",
    image: "./images/bx10-img.png",
    quantity: 1,
    discountPrice: 160,
    price: 180,
  },
  {
    id: 11,
    discountPercentage: "-10%",
    title: "Breed Dry Dog Food",
    image: "./images/bx11-img.png",
    quantity: 1,
    discountPrice: 60,
    price: 70,
  },
  {
    id: 12,
    discountPercentage: "0%",
    title: "Small Chair",
    image: "./images/bx12-img.png",
    quantity: 1,
    discountPrice: 180,
    price: 180,
  },
  {
    id: 13,
    discountPercentage: "-70%",
    title: "Gucci duffle bag",
    image: "./images/bx13-img.png",
    quantity: 1,
    discountPrice: 180,
    price: 188,
  },
  {
    id: 14,
    discountPercentage: "-20%",
    title: "Small BookSelf",
    image: "./images/bx14-img.png",
    quantity: 1,
    discountPrice: 178,
    price: 180,
  },
  {
    id: 15,
    discountPercentage: "-70%",
    title: "IPS LCD Gaming Monitor",
    image: "./images/bx15-img.png",
    quantity: 1,
    discountPrice: 180,
    price: 218,
  },
  {
    id: 16,
    discountPercentage: "-50%",
    title: "Smule Perfume",
    image: "./images/bx16-img.png",
    quantity: 1,
    discountPrice: 150,
    price: 190,
  },
];

elecTechProducts.forEach((elecTechObject) => {
  let { title, image, id, discountPercentage, discountPrice, price, quantity } =
    elecTechObject;
  let elecTechAppend = document.getElementById("elecTechAppend");
  elecTechAppend.innerHTML += `
    <div class="col-12 col-sm-12 col-md-6 col-lg-3">
                        <div class="bxElecTech p-3">
                            <div class="iconCartDiscount">
                                <i onclick='addToCartElecTech(${JSON.stringify(
                                  elecTechObject
                                )});' class="fa-solid fa-cart-plus" style="cursor: pointer;"></i>
                                <span>${discountPercentage}</span>
                            </div>
                            <div class="bxElecTechimg text-center p-3">
                                <img src=${image} alt="Loading...">
                            </div>
                            <div class="description">
                                <p>${title}</p>
                                <span id="orginalPrice" class="pe-3">${discountPrice}</span><s>${price}</s>
                                <br>
                                <span><i class="fa-solid fa-star" style="color: #000000;"></i><i
                                        class="fa-solid fa-star" style="color: #000000;"></i><i class="fa-solid fa-star"
                                        style="color: #000000;"></i><i class="fa-solid fa-star"
                                        style="color: #000000;"></i><i class="fa-solid fa-star"
                                        style="color: #000000;"></i></span>
                            </div>
                        </div>
                    </div>
    
    
    `;
});

//Add to Cart for elechTech
let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
let cartLength = document.getElementById("cartLength");

const addToCartElecTech = (elecTechObject) => {
  let productExists = cartItems.find(
    (storageProducts) => storageProducts.id === elecTechObject.id
  );

  //Checking the if products are already existing
  if (productExists) {
    toastr.error("Product already exists!");
    return;
  }

  cartItems.push(elecTechObject);
  localStorage.setItem("cart", JSON.stringify(cartItems));
  CartLengthDisplay(cartItems.length);
  toastr.success("Product added to cart!");
};

homeProducts.forEach((homeProductsObject) => {
  let { title, image, id, discountPercentage, discountPrice, price, quantity } =
    homeProductsObject;
  let homeAppend = document.getElementById("homeAppend");
  homeAppend.innerHTML += `
  <div class="col-12 col-sm-12 col-md-6 col-lg-3">
                        <div class="bxHome p-3">
                            <div class="iconCartDiscount">
                                <i onclick='addToCartHome(${JSON.stringify(
                                  homeProductsObject
                                )})' class="fa-solid fa-cart-plus" style="cursor: pointer;"></i>
                                <span>${discountPercentage}</span>
                            </div>
                            <div class="homeimg text-center p-3">
                                <img src=${image} alt="Loading...">
                            </div>
                            <div class="description">
                                <p>${title}</p>
                                <span id="orginalPrice" class="pe-3">${discountPrice}</span><s>${price}</s>
                                <br>
                                <span><i class="fa-solid fa-star" style="color: #000000;"></i><i
                                        class="fa-solid fa-star" style="color: #000000;"></i><i class="fa-solid fa-star"
                                        style="color: #000000;"></i><i class="fa-solid fa-star"
                                        style="color: #000000;"></i><i class="fa-solid fa-star"
                                        style="color: #000000;"></i></span>
                            </div>
                        </div>
                    </div>
  `;
});

// Home Prducts addToCart
const addToCartHome = (homeProductsObject) => {
  let productExists = cartItems.find(
    (storageProducts) => storageProducts.id === homeProductsObject.id
  );

  //Checking the if products are already existing
  if (productExists) {
    toastr.error("Product already exists!");
    return;
  }
  cartItems.push(homeProductsObject);
  localStorage.setItem("cart", JSON.stringify(cartItems));
  CartLengthDisplay(cartItems.length);
  toastr.success("Product added to cart!");
};

//Keep the CartProducts length
document.addEventListener("DOMContentLoaded", () => {
  CartLengthDisplay(cartItems.length);
});

//Cart length display
const CartLengthDisplay = (length) => {
  cartLength.innerHTML = length;
};

//Scroling Js
document.addEventListener("DOMContentLoaded", function () {
  const exploreLink = document.querySelector(
    '.navbar a[href="#Electronics&Technology"]'
  );
  if (exploreLink) {
    exploreLink.addEventListener("click", function (event) {
      event.preventDefault();
      const exploreSection = document.getElementById("Electronics&Technology");
      if (exploreSection) {
        // Scroll to the explore section smoothly
        exploreSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
});

// Registered Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then((res) => console.log("service worker registered"))
      .catch((err) => console.log("service worker not registered", err));
  });

  // Listen for the beforeinstallprompt event
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault(); // Prevent the default behavior
    const installButton = document.getElementById("installButton");
    installButton.style.display = "block"; // Show the install button

    // When the install button is clicked, prompt the user to install the app
    installButton.addEventListener("click", () => {
      event.prompt(); // Trigger the installation prompt
      // Wait for the user to respond to the prompt
      event.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        installButton.style.display = "none"; // Hide the install button
      });
    });
  });
}

window.addToCartHome = addToCartHome;
window.addToCartElecTech = addToCartElecTech;
window.CartLengthDisplay = CartLengthDisplay;
