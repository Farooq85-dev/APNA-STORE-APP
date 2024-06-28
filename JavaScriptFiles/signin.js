import {
  auth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "../firebase.js";

//Initialize
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
  timeOut: "1000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};

const authenticateUser = () => {
  const signInEmail = document.getElementById("signInEmail").value;
  const signInPassword = document.getElementById("signInPassword").value;
  if (signInEmail === "") {
    toastr.error("Please Enter email.");
  } else if (signInPassword === "") {
    toastr.error("Please enter Password.");
  } else {
    signInWithEmailAndPassword(auth, signInEmail, signInPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        toastr.success("LogIn Succcessfully.");
        setTimeout(() => {
          window.location = "./profile.html";
        }, 1000);
        document.getElementById("signInEmail").value = "";
        document.getElementById("signInPassword").value = "";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toastr.error("Invalid Email or Passowrd.");
      });
  }
};
const signInBtn = document.getElementById("signInBtn");
signInBtn.addEventListener("click", authenticateUser);

//Password Reset Request
const passwordReset = () => {
  let resetEmail = document.getElementById("resetEmail").value;
  const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  if (resetEmail === "") {
    toastr.error("Please provide email");
  } else if (!emailRegex.test(resetEmail)) {
    toastr.error("Invalid email.");
  } else {
    sendPasswordResetEmail(auth, resetEmail)
      .then(() => {
        toastr.info("Please go to your provided email inbox.");
        resetPasswordModaCloseBtn.click();
        document.getElementById("resetEmail").value = "";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toastr.error("Try again.");
      });
    console.log(resetEmail);
  }
};
const resetPasswordBtn = document.getElementById("resetPasswordBtn");
resetPasswordBtn.addEventListener("click", passwordReset);
