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

import {
  auth,
  onAuthStateChanged,
  db,
  setDoc,
  doc,
  getDocs,
  collection,
} from "../firebase.js";
let userId;
onAuthStateChanged(auth, async (user) => {
  if (user) {
    userId = user.uid;
  } else {
    console.log("Please Login!");
  }
});

let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
let cartLength = document.getElementById("cartLength");

//Stroing user Products
let storageProductsTitle = [];

//Displaying Prdoucts in cart page
const cartProductsDisplay = () => {
  let cartProductsAppend = document.getElementById("cartProductsAppend");
  cartProductsAppend.innerHTML = "";
  if (cartItems.length === 0) {
    emptyCartDiv.style.display = "block";
    emptyCart.src = "./images/cart-img.jpg";
  } else {
    cartItems.forEach((storageData) => {
      let { image, title, id, quantity, discountPrice } = storageData;
      storageProductsTitle.push(title);
      let total = Number(quantity) * Number(discountPrice);
      cartProductsAppend.innerHTML += `
      <div class="col-6 col-sm-6 col-md-3 col-lg-3">
              <div class="card mt-5 mb-3 p-2">
              <div class=
              "cartImg">
                <img
                src="${image}"
                width="100px"
                class="card-img-top cartImg"
                alt="Loading..."
              />
              </div>
                <div class="card-body">
                  <div
                    class="titlePrice"
                    style="
                      display: flex;
                      flex-direction: column;
                      justify-content: start;
                      align-items: start;
                      margin-bottom: 10px;
                    "
                  >
                    <h5 class="card-title text-center">${title}</h5>
                    <h5 class="card-title text-center" style="color: #db4444">
                      ${total}
                    </h5>
                  </div>
                  <div
                    class="cartBtns"
                    style="
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                    "
                  >
                    <div
                    class="updownQtyBtns"
                      style="display: flex; justify-content: start; gap: 10px"
                    >
                      <div class="minus" style="cursor: pointer">
                        <svg
                        onclick="decreaseQty(${id});"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="icon icon-tabler icons-tabler-outline icon-tabler-circle-minus"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path
                            d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"
                          />
                          <path d="M9 12l6 0" />
                        </svg>
                      </div>
                      <div class="quantityProduct">
                        <h6 style="color: #db4444">${quantity}</h6>
                      </div>
                      <div class="plus" style="cursor: pointer">
                        <svg
                        onclick="increaseQty(${id});"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="icon icon-tabler icons-tabler-outline icon-tabler-circle-plus"
                        >
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                          <path d="M9 12h6" />
                          <path d="M12 9v6" />
                        </svg>
                      </div>
                    </div>
                    <div class="deleteIcon">
                      <svg
                      onclick="deleteCart(${id});"
                        style="color: #db4444; cursor: pointer;"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="icon icon-tabler icons-tabler-outline icon-tabler-trash"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M4 7l16 0" />
                        <path d="M10 11l0 6" />
                        <path d="M14 11l0 6" />
                        <path
                          d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"
                        />
                        <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
    });
  }
};
document.addEventListener("DOMContentLoaded", cartProductsDisplay);

function decreaseQty(id) {
  let product = cartItems.find((product) => product.id === id);
  if (product.quantity > 1) {
    product.quantity--;
  } else {
    deleteCart(id);
  }
  localStorage.setItem("cart", JSON.stringify(cartItems));
  updateTotalPrice();
  cartProductsDisplay();
}

function increaseQty(id) {
  let product = cartItems.find((product) => product.id === id);
  product.quantity++;
  localStorage.setItem("cart", JSON.stringify(cartItems));
  updateTotalPrice();
  cartProductsDisplay();
}

//Keep the CartProducts length
document.addEventListener("DOMContentLoaded", () => {
  CartLengthDisplay(cartItems.length);
});

//Cart length display
function CartLengthDisplay(length) {
  cartLength.innerHTML = length;
}

function deleteCart(id) {
  const index = cartItems.findIndex((product) => product.id === id);
  if (index !== -1) {
    cartItems.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cartItems));
    CartLengthDisplay(cartItems.length);
    updateTotalPrice();
    cartProductsDisplay();
    toastr.success("Product deleted!");
  }
}

let total;
async function updateTotalPrice() {
  let deilvery = 0;
  if (cartItems.length < 4) {
    deilvery = 120;
  }
  if (cartItems.length > 4) {
    deilvery = 200;
  }

  if (cartItems.length > 8) {
    deilvery = 220;
  }
  total = cartItems.reduce(
    (sum, item) => sum + item.discountPrice * item.quantity,
    0
  );
  let totalPrice = document.getElementById("totalPrice");
  let deilveryPrice = document.getElementById("deilveryPrice");
  total = total + deilvery;
  totalPrice.innerHTML = `Total Price:- ${total}`;
  deilveryPrice.innerHTML = `Delivery Price:- ${deilvery}`;
  if (cartItems.length < 1) {
    totalPrice.style.display = "none";
    placeOrderDetails.style.display = "none";
    deilveryPrice.style.display = "none";
    cartLength.innerHTML = `0`;
    cartProductsDisplay();
  }
}
updateTotalPrice();

async function placeOrder() {
  let detailsLoader = document.getElementById("detailsLoader");
  let receiverName = document.getElementById("receiverName");
  let receiverEmail = document.getElementById("receiverEmail");
  var emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
  let receiverAddress = document.getElementById("receiverAddress");
  let receiverPhoneNumber = document.getElementById("receiverPhoneNumber");
  let trackingId = Math.round(Math.random() * 100000 + 1);
  if (!userId) {
    toastr.error("Please login/Signup first to place order.");
    return;
  }

  if (receiverName.value === "") {
    toastr.error("Please Write Name.");
  } else if (receiverEmail.value === "") {
    toastr.error("Please Write email.");
  } else if (!emailRegex.test(receiverEmail.value)) {
    toastr.error("Invalid email.");
  } else if (receiverPhoneNumber.value === "") {
    toastr.error("Please Write Phone Number.");
  } else if (
    receiverPhoneNumber.value.length < 10 ||
    receiverPhoneNumber.value.length > 11
  ) {
    toastr.error("Invalid Phone Number.");
  } else if (receiverAddress.value === "") {
    toastr.error("Please Write Address.");
  } else {
    detailsLoader.style.display = "none";
    loader4.style.display = "block";
    const userOrdersRef = doc(db, "usersProducts", `${userId}`);
    const newOrderRef = doc(collection(userOrdersRef, "orders"));
    await setDoc(newOrderRef, {
      receiverName: receiverName.value,
      receiverEmail: receiverEmail.value,
      receiverPhoneNumber: receiverPhoneNumber.value,
      receiverAddress: receiverAddress.value,
      totalAmount: total,
      trackingId: `#${trackingId}`,
      cartItems: cartItems,
      userProductsTitle: storageProductsTitle,
      orderDate: new Date().toLocaleString(),
    });
    detailsLoader.style.display = "flex";
    loader4.style.display = "none";
    toastr.info(
      `Your Order placed successfully with this tracking Id #${trackingId} `
    );
    document.getElementById("receiverName").value = "";
    document.getElementById("receiverEmail").value = "";
    document.getElementById("receiverPhoneNumber").value = "";
    document.getElementById("receiverAddress").value = "";
  }
}
const placeOrderBtn = document.getElementById("placeOrderBtn");
placeOrderBtn.addEventListener("click", placeOrder);

const viewOrderDetails = async () => {
  if (!userId) {
    toastr.error("Please login first to view your orders!");
    return;
  }
  let loader5 = document.getElementById("loader5");
  loader5.style.display = "block";
  const userOrdersRef = collection(db, "usersProducts", `${userId}`, "orders");

  try {
    const ordersSnapshot = await getDocs(userOrdersRef);
    const orders = [];
    ordersSnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    displayOrders(orders);
  } catch (error) {
    console.error("Error fetching orders: ", error);
    toastr.error("Failed to fetch orders. Please try again.");
  }
};

const displayOrders = (orders) => {
  let ordersContainer = document.getElementById("ordersContainer");
  ordersContainer.innerHTML = "";

  if (orders.length === 0) {
    ordersContainer.innerHTML = `<h4>You have not any placed order yet!`;
    return;
  }

  ordersContainer.style.display = "none";
  orders.forEach((orders) => {
    let {
      trackingId,
      receiverEmail,
      receiverAddress,
      receiverPhoneNumber,
      receiverName,
      totalAmount,
      orderDate,
      userProductsTitle,
    } = orders;
    ordersContainer.innerHTML += `
      <div class="order">
        <h4 class="ordersIdBg">Tracking ID: ${trackingId}</h4>
        <p  class="fw-bold">Receiver Name: ${receiverName}</p>
        <p class="fw-bold">Receiver Email: ${receiverEmail}</p>
        <p class="fw-bold">Receiver Phone Number: ${receiverPhoneNumber}</p>
        <p class="fw-bold">Receiver Address: ${receiverAddress}</p>
        <p class="fw-bold">Receiver Items: ${userProductsTitle}</p>
        <p class="fw-bold">Total Amount: ${totalAmount}</p>
        <p class="fw-bold">Order Date: ${orderDate}</p>
        <h6 class="fw-bold">${userProductsTitle.length} Products with this Id: ${trackingId}<h6/>
        <h6 class="fw-bold" style="color: #db4444">Note:Don't worry. We will provide your parcels within three working days.<h6/>
      </div>
    `;
    ordersContainer.style.display = "block";
    loader5.style.display = "none";
  });
};

// Attach the viewOrders function to the view orders button
const viewOrderBtn = document.getElementById("viewOrderBtn");
viewOrderBtn.addEventListener("click", viewOrderDetails);

//Added function to Global window object.
window.deleteCart = deleteCart;
window.updateTotalPrice = updateTotalPrice;
window.increaseQty = increaseQty;
window.decreaseQty = decreaseQty;
window.CartLengthDisplay = CartLengthDisplay;
window.placeOrder = placeOrder;
