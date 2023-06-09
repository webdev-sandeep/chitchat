import React, { useState } from "react";
import logo from "../assets/chat.png";
import addAvatar from "../assets/avatar.png";
import { Link } from "react-router-dom";
import {
  createUserWithEmailAndPassword, // Firebase method that creates a new user with email and password
  updateProfile, // Firebase method that updates a user profile
} from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage, database } from "../firebase"; // Import firebase instance
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore"; // Firebase method that creates a new document in the Firestore

const Register = () => {
  const initialState = {
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    file: null,
  };
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const updateFormData = ({ field, value }) => {
    setFormData({ ...formData, [field]: value });
  };

  // Display the default image or the selected image
  const imageURL = formData?.file
    ? URL.createObjectURL(formData?.file)
    : addAvatar;

  const handleFormSubmit = async () => {
    setError(null); // Clear any previous errors
    if (formData?.password !== formData.confirmPassword) {
      return setError("Passwords do not match!");
    }
    try {
      // Create a new user account with email and password
      setIsLoading(true);
      const response = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Upload user avatar image to firebase storage
      const storageRef = ref(storage, `images/${formData?.file?.name}`);
      const uploadTask = uploadBytesResumable(storageRef, formData?.file);

      // Handle the upload task state changes
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          setError(error.message);
        },
        () => {
          // Get the download URL of the uploaded image
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            // Update user profile with display name and avatar image URL
            await updateProfile(response?.user, {
              displayName: formData?.displayName,
              photoURL: downloadURL,
            });
            // Add user data to the users Firestore collection
            await setDoc(doc(database, "users", response?.user?.uid), {
              uid: response?.user?.uid,
              displayName: formData?.displayName,
              email: formData?.email,
              photoURL: downloadURL,
            });
            await setDoc(doc(database, "userChats", response?.user?.uid), {});
            // Navigate to the home page after successful sign up
            navigate("/");
            setFormData(initialState); // Clear the form data after submission
            setIsLoading(false);
          });
        }
      );
    } catch (error) {
      setError(error.message); // Set error message if any
    }
  };

  // Render the register form
  return (
    <div className="register-container bg-gray-900 min-h-screen grid place-items-center">
      <div className="register bg-white px-10 py-5 rounded-lg">
        <div className="brand flex items-center justify-center">
          <h1 className="font-rampart text-4xl text-center py-4 inline-block capitalize">
            chitchat
          </h1>
          <div className="logo h-24 w-24 mx-2 inline-block">
            <img
              src={logo}
              alt="brand-logo"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <form
          className="register-form text-sm"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="field my-8 flex justify-between items-center">
            <label htmlFor="display-name" className="font-semibold">
              Display Name :{" "}
            </label>
            <input
              type="text"
              id="display-name"
              autoComplete="display name"
              className="border-b border-black px-2 focus-visible:outline-none mx-2"
              value={formData.displayName}
              onChange={(e) =>
                updateFormData({
                  field: "displayName",
                  value: e.target.value,
                })
              }
            />
          </div>
          <div className="field my-8 flex justify-between items-center">
            <label htmlFor="email" className="font-semibold">
              Email :{" "}
            </label>
            <input
              type="email"
              id="email"
              autoComplete="email"
              className="border-b border-black px-2 focus-visible:outline-none mx-2"
              value={formData.email}
              onChange={(e) =>
                updateFormData({
                  field: "email",
                  value: e.target.value,
                })
              }
            />
          </div>
          <div className="field my-8 flex justify-between items-center">
            <label htmlFor="password" className="font-semibold">
              Password :{" "}
            </label>
            <input
              type="password"
              id="password"
              autoComplete="password"
              className="border-b border-black px-2 focus-visible:outline-none mx-2"
              value={formData.password}
              onChange={(e) =>
                updateFormData({
                  field: "password",
                  value: e.target.value,
                })
              }
            />
          </div>
          <div className="field my-8 flex justify-between items-center">
            <label htmlFor="confirm-password" className="font-semibold">
              Confirm Password :{" "}
            </label>
            <input
              type="password"
              id="confirm-password"
              autoComplete="password"
              className="border-b border-black px-2 focus-visible:outline-none mx-2"
              value={formData.confirmPassword}
              onChange={(e) =>
                updateFormData({
                  field: "confirmPassword",
                  value: e.target.value,
                })
              }
            />
          </div>
          <div className="field my-8 flex items-center">
            <label htmlFor="avatar" className="h-12 w-12 me-2 cursor-pointer">
              {}
              <img
                src={imageURL}
                alt="brand-logo"
                htmlFor="avatar"
                className="h-full w-full object-cover rounded-full"
              />
            </label>
            <input
              type="file"
              id="avatar"
              autoComplete="image"
              className="hidden"
              onChange={(e) =>
                updateFormData({ field: "file", value: e.target.files[0] })
              }
            />
            <span className="font-semibold">
              {formData?.file?.name || "Add an image."}
            </span>
          </div>
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          <button
            type="submit"
            className="px-8 py-2 rounded text-white bg-gray-800 w-full text-center my-4"
            onClick={handleFormSubmit}
          >
            {isLoading ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="mx-auto"
              >
                <circle cx="12" cy="3" r="0" fill="currentColor">
                  <animate
                    id="svgSpinners6DotsScale0"
                    fill="freeze"
                    attributeName="r"
                    begin="0;svgSpinners6DotsScale2.end-0.5s"
                    calcMode="spline"
                    dur="0.6s"
                    keySplines="0,1,0,1;.53,0,.61,.73"
                    keyTimes="0;.2;1"
                    values="0;2;0"
                  />
                </circle>
                <circle cx="16.5" cy="4.21" r="0" fill="currentColor">
                  <animate
                    id="svgSpinners6DotsScale1"
                    fill="freeze"
                    attributeName="r"
                    begin="svgSpinners6DotsScale0.begin+0.1s"
                    calcMode="spline"
                    dur="0.6s"
                    keySplines="0,1,0,1;.53,0,.61,.73"
                    keyTimes="0;.2;1"
                    values="0;2;0"
                  />
                </circle>
                <circle cx="7.5" cy="4.21" r="0" fill="currentColor">
                  <animate
                    id="svgSpinners6DotsScale2"
                    fill="freeze"
                    attributeName="r"
                    begin="svgSpinners6DotsScale4.begin+0.1s"
                    calcMode="spline"
                    dur="0.6s"
                    keySplines="0,1,0,1;.53,0,.61,.73"
                    keyTimes="0;.2;1"
                    values="0;2;0"
                  />
                </circle>
                <circle cx="19.79" cy="7.5" r="0" fill="currentColor">
                  <animate
                    id="svgSpinners6DotsScale3"
                    fill="freeze"
                    attributeName="r"
                    begin="svgSpinners6DotsScale1.begin+0.1s"
                    calcMode="spline"
                    dur="0.6s"
                    keySplines="0,1,0,1;.53,0,.61,.73"
                    keyTimes="0;.2;1"
                    values="0;2;0"
                  />
                </circle>
                <circle cx="4.21" cy="7.5" r="0" fill="currentColor">
                  <animate
                    id="svgSpinners6DotsScale4"
                    fill="freeze"
                    attributeName="r"
                    begin="svgSpinners6DotsScale6.begin+0.1s"
                    calcMode="spline"
                    dur="0.6s"
                    keySplines="0,1,0,1;.53,0,.61,.73"
                    keyTimes="0;.2;1"
                    values="0;2;0"
                  />
                </circle>
                <circle cx="21" cy="12" r="0" fill="currentColor">
                  <animate
                    id="svgSpinners6DotsScale5"
                    fill="freeze"
                    attributeName="r"
                    begin="svgSpinners6DotsScale3.begin+0.1s"
                    calcMode="spline"
                    dur="0.6s"
                    keySplines="0,1,0,1;.53,0,.61,.73"
                    keyTimes="0;.2;1"
                    values="0;2;0"
                  />
                </circle>
                <circle cx="3" cy="12" r="0" fill="currentColor">
                  <animate
                    id="svgSpinners6DotsScale6"
                    fill="freeze"
                    attributeName="r"
                    begin="svgSpinners6DotsScale8.begin+0.1s"
                    calcMode="spline"
                    dur="0.6s"
                    keySplines="0,1,0,1;.53,0,.61,.73"
                    keyTimes="0;.2;1"
                    values="0;2;0"
                  />
                </circle>
                <circle cx="19.79" cy="16.5" r="0" fill="currentColor">
                  <animate
                    id="svgSpinners6DotsScale7"
                    fill="freeze"
                    attributeName="r"
                    begin="svgSpinners6DotsScale5.begin+0.1s"
                    calcMode="spline"
                    dur="0.6s"
                    keySplines="0,1,0,1;.53,0,.61,.73"
                    keyTimes="0;.2;1"
                    values="0;2;0"
                  />
                </circle>
                <circle cx="4.21" cy="16.5" r="0" fill="currentColor">
                  <animate
                    id="svgSpinners6DotsScale8"
                    fill="freeze"
                    attributeName="r"
                    begin="svgSpinners6DotsScalea.begin+0.1s"
                    calcMode="spline"
                    dur="0.6s"
                    keySplines="0,1,0,1;.53,0,.61,.73"
                    keyTimes="0;.2;1"
                    values="0;2;0"
                  />
                </circle>
                <circle cx="16.5" cy="19.79" r="0" fill="currentColor">
                  <animate
                    id="svgSpinners6DotsScale9"
                    fill="freeze"
                    attributeName="r"
                    begin="svgSpinners6DotsScale7.begin+0.1s"
                    calcMode="spline"
                    dur="0.6s"
                    keySplines="0,1,0,1;.53,0,.61,.73"
                    keyTimes="0;.2;1"
                    values="0;2;0"
                  />
                </circle>
                <circle cx="7.5" cy="19.79" r="0" fill="currentColor">
                  <animate
                    id="svgSpinners6DotsScalea"
                    fill="freeze"
                    attributeName="r"
                    begin="svgSpinners6DotsScaleb.begin+0.1s"
                    calcMode="spline"
                    dur="0.6s"
                    keySplines="0,1,0,1;.53,0,.61,.73"
                    keyTimes="0;.2;1"
                    values="0;2;0"
                  />
                </circle>
                <circle cx="12" cy="21" r="0" fill="currentColor">
                  <animate
                    id="svgSpinners6DotsScaleb"
                    fill="freeze"
                    attributeName="r"
                    begin="svgSpinners6DotsScale9.begin+0.1s"
                    calcMode="spline"
                    dur="0.6s"
                    keySplines="0,1,0,1;.53,0,.61,.73"
                    keyTimes="0;.2;1"
                    values="0;2;0"
                  />
                </circle>
              </svg>
            ) : (
              "Register"
            )}
          </button>
        </form>
        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="underline font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
