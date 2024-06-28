import {
  signOut,
  auth,
  onAuthStateChanged,
  sendEmailVerification,
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  doc,
  setDoc,
  db,
  onSnapshot,
  getDoc,
  updatePassword,
  updateEmail,
} from "../firebase.js";

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

//Showing user Data
var userPhoto = document.getElementById("userPhoto");
let userName = document.getElementById("userName");
let userEmail = document.getElementById("userEmail");
let userVerified = document.getElementById("userVerified");

onAuthStateChanged(auth, async (user) => {
  const userProfile = document.getElementById("userProfile");
  const profileDetails = document.getElementById("profileDetails");
  const loader1 = document.getElementById("loader1");

  // Check if user is not authenticated
  if (!user) {
    // Get the current path
    let pathArr = location.pathname.split("/");
    let path = `/${pathArr[pathArr.length - 1]}`;

    // Redirect to signup.html if the current page is profile.html
    if (path === "/profile.html") {
      location.replace("/signup.html"); // Redirect to signup.html
    }
    return; // Exit early if user is not authenticated
  }

  // Display the loader while processing user information
  loader1.style.display = "block";

  let uid = user.uid;

  // Check if display name is null and fetch the name if necessary
  if (user.displayName === null) {
    await gettingName(uid);
  }

  // Display user email
  userEmail.innerHTML = user.email;

  // Hide the loader and display profile elements
  loader1.style.display = "none";
  userProfile.style.display = "flex";
  profileDetails.style.display = "flex";

  // Check if the user's email is verified
  if (user.emailVerified === true) {
    userVerified.innerHTML = "You are verified.";
    emailVerificationBtn.style.display = "none";
    fileSelectBtn.style.display = "block";
  } else {
    userVerified.innerHTML =
      "Please verify yourself first to explore more features.";
    emailVerificationBtn.style.display = "block";
  }

  // Set user photo or default photo
  if (user.photoURL === null) {
    userPhotoUpload.src = "./images/default-img.png";
  } else if (userPhotoUpload.src === "./images/default-img.png") {
    toastr.info("Please upload your picture.");
  } else {
    userPhotoUpload.src = user.photoURL;
  }

  // Update user picture
  await picUpdate(uid);
});

//Sending Email verification
const emailVerification = () => {
  sendEmailVerification(auth.currentUser)
    .then(() => {
      toastr.success("Goto inbox and Verify your-self.");
    })
    .catch(() => {
      toastr.error("Try again.");
    });
};
const emailVerificationBtn = document.getElementById("emailVerificationBtn");
emailVerificationBtn.addEventListener("click", emailVerification);

//Logout User
const logOutUser = () => {
  signOut(auth)
    .then(() => {
      toastr.success("You have been logout successfully.");
      setTimeout(() => {
        window.location = "../index.html";
      }, 1000);
    })
    .catch((error) => {
      toastr.error("Try again.");
    });
};
const logOutBtn = document.getElementById("logOutBtn");
logOutBtn.addEventListener("click", logOutUser);

//Select Show Pic
let file;
const selectShowPic = () => {
  let userPhotoUpload = document.getElementById("userPhotoUpload");
  let inputFile = document.getElementById("inputFile");
  userPhotoUpload.addEventListener("click", function () {
    inputFile.click();
  });
  inputFile.onchange = function () {
    file = inputFile.files[0];
    userPhotoUpload.src = URL.createObjectURL(file);
  };
};
selectShowPic();

//Uploading file
let uploadTask;
const uploadFile = async () => {
  // Validating select file
  if (!file) {
    toastr.warning("Please select a picture first.");
    return;
  }
  // File size validation
  if (file.size > 1572864) {
    toastr.warning("Picture must be less than 1.5 mb.");
    return;
  }
  // File type validation
  const fileTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
  if (!fileTypes.includes(file.type)) {
    toastr.error("Invalid Format. Please select JPG, JPEG, or PNG.");
    return;
  }
  progressDiv.style.display = "block";
  cancelUploadBtn.style.display = "block";
  fileSelectBtn.style.display = "none";
  const authCurrentUserUid = auth.currentUser.uid;
  const storageRef = ref(storage, `usersImages/${authCurrentUserUid}`);
  uploadTask = uploadBytesResumable(storageRef, file);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      toastr.info("uploading...");
      document.getElementById("progressBar").style.width = progress + "%";
    },
    (error) => {
      toastr.error(
        "An error occurred while uploading the file. Please try again."
      );
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref)
        .then((downloadURL) => {
          const imageUrl = downloadURL;
          setDoc(doc(db, "usersImages", `${authCurrentUserUid}`), {
            userImageUrl: imageUrl,
          });
          toastr.success("Your picture has been uploaded successfully.");
          progressDiv.style.display = "none";
          cancelUploadBtn.style.display = "none";
        })
        .catch((error) => {
          toastr.error(
            "An error occurred while getting the download URL. Please try again."
          );
        });
    }
  );
};
const fileSelectBtn = document.getElementById("fileSelectBtn");
fileSelectBtn.addEventListener("click", uploadFile);

//Cancel File Upload
const cancelUpload = () => {
  uploadTask.cancel();
  toastr.info("Upload has been cancelled.");
};
const cancelUploadBtn = document.getElementById("cancelUploadBtn");
cancelUploadBtn.addEventListener("click", cancelUpload);

// Picture Update
const picUpdate = async (uid) => {
  await onSnapshot(doc(db, `usersImages/${uid}`), (doc) => {
    let data = doc.data();
    if (data) {
      let { userImageUrl } = data;
      userPhotoUpload.src = userImageUrl;
      toastr.success("Please wait. Your Picture has been updating.");
      fileSelectBtn.style.display = "block";
    }
  });
};

//Saving user data
const saveDetails = async () => {
  let name = document.getElementById("name").value;
  let surname = document.getElementById("surname").value;
  let address = document.getElementById("address").value;
  let mobileNo = document.getElementById("mobileNo").value;
  let emailProvided = document.getElementById("emailProvided").value;
  const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
  let countryName = document.getElementById("countryName").value;
  let userStatus = document.getElementById("userStatus").value;
  let cityName = document.getElementById("cityName").value;
  const loader2 = document.getElementById("loader2");
  const editInput = document.getElementById("editInput");
  const user = auth.currentUser;
  let uid = user.uid;
  if (name === "") {
    toastr.error("Please type name.");
  } else if (surname === "") {
    toastr.error("Please type name.");
  } else if (mobileNo === "") {
    toastr.error("Please type mobile Number.");
  } else if (mobileNo.length < 11) {
    toastr.error("Invalid mobile number");
  } else if (emailProvided === "") {
    toastr.error("Please type email.");
  } else if (!emailRegex.test(emailProvided)) {
    toastr.error("Invalid email.");
  } else if (userStatus === "") {
    toastr.error("Please type your status.");
  } else if (address === "") {
    toastr.error("Please type address.");
  } else if (cityName === "") {
    toastr.error("Please type city Name.");
  } else if (countryName === "") {
    toastr.error("Please type country name.");
  } else {
    loader2.style.display = "block";
    editInput.style.display = "none";
    await setDoc(doc(db, "usersData", `${uid}`), {
      name,
      surname,
      mobileNo,
      emailProvided,
      address,
      userStatus,
      cityName,
      countryName,
    });
    toastr.success("Your data has been Saved.");
    loader2.style.display = "none";
    editInput.style.display = "block";
    document.getElementById("name").value = "";
    document.getElementById("surname").value = "";
    document.getElementById("address").value = "";
    document.getElementById("mobileNo").value = "";
    document.getElementById("emailProvided").value = "";
    document.getElementById("countryName").value = "";
    document.getElementById("cityName").value = "";
    document.getElementById("userStatus").value = "";
  }
};
const saveDataBtn = document.getElementById("saveDataBtn");
saveDataBtn.addEventListener("click", saveDetails);

//Getting user Name
const gettingName = async () => {
  const userNameSaved = document.getElementById("userNameSaved");
  const user = auth.currentUser;
  let uid = user.uid;
  const docRef = doc(db, "usersData", `${uid}`);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    let { name } = docSnap.data();
    userName.innerHTML = `Hy! ${name}`;
  }
};

//Edit & View Data
const editViewDetails = async () => {
  let viewname = document.getElementById("viewname");
  let viewsurname = document.getElementById("viewsurname");
  let viewaddress = document.getElementById("viewaddress");
  let viewmobileNo = document.getElementById("viewmobileNo");
  let viewemailProvided = document.getElementById("viewemailProvided");
  let viewcountryName = document.getElementById("viewcountryName");
  let viewuserStatus = document.getElementById("viewuserStatus");
  let viewcityName = document.getElementById("viewcityName");
  let loader3 = document.getElementById("loader3");
  let viewProfileModalBody = document.getElementById("viewProfileModalBody");
  loader3.style.display = "block";
  viewProfileModalBody.style.display = "none";
  const user = auth.currentUser;
  let uid = user.uid;
  const docRef = doc(db, "usersData", `${uid}`);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    let {
      name,
      surname,
      mobileNo,
      emailProvided,
      address,
      userStatus,
      countryName,
      cityName,
    } = docSnap.data();
    await editViewProfilePic(uid);
    viewname.value = `${name}`;
    viewsurname.value = `${surname}`;
    viewaddress.value = `${address}`;
    viewmobileNo.value = `${mobileNo}`;
    viewemailProvided.value = `${emailProvided}`;
    viewcountryName.value = `${countryName}`;
    viewcityName.value = `${cityName}`;
    viewuserStatus.value = `${userStatus}`;
    loader3.style.display = "none";
    viewProfileModalBody.style.display = "block";
  } else {
    loader3.style.display = "none";
    notifyEditViewModal.src = "./images/nodata.gif";
  }
};
const editDetailsBtn = document.getElementById("editDetailsBtn");
editDetailsBtn.addEventListener("click", editViewDetails);

//Edit & View Profile Pic
const editViewProfilePic = async (uid) => {
  const editViewProfileImg = document.getElementById("editViewProfileImg");
  const docRef = doc(db, "usersImages", `${uid}`);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    let { userImageUrl } = docSnap.data();
    editViewProfileImg.src = userImageUrl;
  }
};

//Update Details
const updateDetails = async () => {
  let viewProfileModalBody = document.getElementById("viewProfileModalBody");
  let loader3 = document.getElementById("loader3");
  loader3.style.display = "block";
  viewProfileModalBody.style.display = "none";
  const uid = auth.currentUser.uid;
  const updateFields = doc(db, "usersData", uid);
  const updatedData = {};
  const viewname = document.getElementById("viewname").value.trim();
  const viewsurname = document.getElementById("viewsurname").value.trim();
  const viewaddress = document.getElementById("viewaddress").value.trim();
  const viewmobileNo = document.getElementById("viewmobileNo").value.trim();
  const viewemailProvided = document
    .getElementById("viewemailProvided")
    .value.trim();
  const viewcountryName = document
    .getElementById("viewcountryName")
    .value.trim();
  const viewuserStatus = document.getElementById("viewuserStatus").value.trim();
  const viewcityName = document.getElementById("viewcityName").value.trim();
  if (viewname) updatedData.name = viewname;
  if (viewsurname) updatedData.surname = viewsurname;
  if (viewaddress) updatedData.address = viewaddress;
  if (viewmobileNo) updatedData.mobileNo = viewmobileNo;
  if (viewemailProvided) updatedData.emailProvided = viewemailProvided;
  if (viewcountryName) updatedData.countryName = viewcountryName;
  if (viewuserStatus) updatedData.userStatus = viewuserStatus;
  if (viewcityName) updatedData.cityName = viewcityName;
  await setDoc(updateFields, updatedData, { merge: true });
  toastr.success("Details updated successfully.");
  loader3.style.display = "none";
  viewProfileModalBody.style.display = "block";
  viewProfileModalCloseBtn.click();
};
const updateDetailsBtn = document.getElementById("updateDetailsBtn");
updateDetailsBtn.addEventListener("click", updateDetails);

//Privacy Profile
const privacyProfile = async () => {
  let oldEmail = document.getElementById("oldEmail");
  const user = auth.currentUser;
  const uid = user.uid;
  const docRef = doc(db, "usersImages", `${uid}`);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    let { userImageUrl } = docSnap.data();
    userPhotoprivacy.src = userImageUrl;
  }
  oldEmail.value = user.email;
};
const privacySettingsBtn = document.getElementById("privacySettingsBtn");
privacySettingsBtn.addEventListener("click", privacyProfile);

//Update Password
const editPassword = async () => {
  const newPassword = document.getElementById("newPassword").value;
  let passwordRegex = /^(?=.*[!@#$%^&*()-_+=])[0-9!@#$%^&*()-_+=]{6,10}$/;
  const user = auth.currentUser;
  if (newPassword === "") {
    toastr.error("Please provide new password.");
  } else if (!passwordRegex.test(newPassword)) {
    toastr.error(
      "Password minmum 6 characters and only digits and at least one special character. Maximum length is 10 characters."
    );
  } else {
    await updatePassword(user, newPassword)
      .then(() => {
        toastr.success("Password updated successfully.");
        privacySettingsModalCloseBtn.click();
      })
      .catch((error) => {
        toastr.error("Try again.");
      });
  }
};
const updatePasswordBtn = document.getElementById("updatePasswordBtn");
updatePasswordBtn.addEventListener("click", editPassword);

//Update email
const editEmail = async () => {
  const newEmail = document.getElementById("newEmail").value;
  let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const user = auth.currentUser;
  if (newEmail === "") {
    toastr.error("Please provide email.");
  } else if (!emailRegex.test(newEmail)) {
    toastr.error("Invalid email.");
  } else {
    await updateEmail(user, newEmail)
      .then(() => {
        toastr.success("Email updated successfully.");
        privacySettingsModalCloseBtn.click();
      })
      .catch((error) => {
        toastr.error("Please try again. An error occured.");
      });
  }
};
const updatEmailBtn = document.getElementById("updateEmailBtn");
updatEmailBtn.addEventListener("click", editEmail);

let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
let cartLength = document.getElementById("cartLength");

cartLength.innerHTML = `${cartItems.length}`;
