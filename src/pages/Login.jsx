import React, { useState } from "react";
import logo from "../assets/chat.png";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();
  const initialState = {
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(initialState);
  const [error, setError] = useState(null);
  const updateFormData = ({ field, value }) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        formData?.email,
        formData?.password
      );
      setFormData(initialState);
      navigate("/");
    } catch (error) {
      setError(error?.message);
    }
  };

  return (
    <div className="Login-container bg-gray-900 min-h-screen grid place-items-center">
      <div>
        {error && <p className="text-center text-xs text-red-500">{error}</p>}
        <div className="Login bg-white px-10 py-5 rounded-lg">
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
            className="Login-form text-sm"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="field my-8 flex justify-between items-center">
              <label htmlFor="email" className="font-semibold">
                Email :{" "}
              </label>
              <input
                type="email"
                id="email"
                className="border-b border-black px-2 focus-visible:outline-none mx-2"
                autoComplete="email"
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
                className="border-b border-black px-2 focus-visible:outline-none mx-2"
                autoComplete="password"
                value={formData.password}
                onChange={(e) =>
                  updateFormData({
                    field: "password",
                    value: e.target.value,
                  })
                }
              />
            </div>
            <button
              type="submit"
              className="px-8 py-2 rounded text-white bg-gray-800 w-full text-center my-4"
              onClick={handleSubmit}
            >
              Login
            </button>
          </form>
          <p className="text-sm text-center">
            Don't have an account?{" "}
            <Link to="/register" className="underline font-semibold">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
