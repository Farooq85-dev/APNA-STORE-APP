import { auth, createUserWithEmailAndPassword } from "../firebase.js";

//Initialize Toastr;
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

//Registering email and password to fireabse;
const addData = () => {
  const signUpEmail = document.getElementById("signUpEmail").value;
  const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  const signUpPassword = document.getElementById("signUpPassword").value;
  let passwordRegex = /^(?=.*[!@#$%^&*()-_+=])[0-9!@#$%^&*()-_+=]{6,10}$/;
  if (signUpEmail === "") {
    toastr.error("Please Enter email.");
  } else if (!emailRegex.test(signUpEmail)) {
    toastr.error("invalid Email");
  } else if (signUpPassword === "") {
    toastr.error("Please enter Password.");
  } else if (!passwordRegex.test(signUpPassword)) {
    toastr.error(
      "Minmium 6,maximum 10 characters, only numbers and at least one special character."
    );
  } else {
    createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        toastr.success("Successfully Registered.");
        setTimeout(() => {
          window.location = "./signin.html";
        }, 1000);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === "auth/email-already-in-use") {
          toastr.error("Email already registered.Please Login.");
          location.pathname === "./signin.html";
        }
      });
  }
};
signUpBtn.addEventListener("click", addData);
