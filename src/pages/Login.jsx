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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const updateFormData = ({ field, value }) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(
        auth,
        formData?.email,
        formData?.password
      );
      navigate("/");
      setFormData(initialState);
      setIsLoading(false);
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
                "Login"
              )}
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
