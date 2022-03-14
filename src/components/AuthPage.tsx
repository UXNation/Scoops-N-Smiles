import React, { useState } from "react";
import { changeAuthPageState } from "../AppSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { changeUserAuthState } from "../AppSlice";
import axios from "axios";
import { GoogleLogin } from "react-google-login";
import { useNavigate } from "react-router";
import loginUser from "../functions/loginUser";
import registerUser from "../functions/registerUser";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const nav = useNavigate();
  const [cp, setcp] = useState("hidden");
  const [authTitle, setAuthTitle] = useState("Login to your account");
  const [submitButton, setSubmitText] = useState("Sign in");
  const [authSwitch, setAuthSwitch] = useState(
    "Dont have an account? Create one",
  );
  const [num, setNum] = useState(0);

  const authPageState = useSelector((state: RootState) => {
    return state.appReducer.authPageState;
  });
  const dispatch = useDispatch();
  const clientId: string | undefined = process.env.REACT_APP_GOOGLE_CLOUD_API!;
  const secretKey: string | undefined = process.env.REACT_APP_JWT_SECRET_KEY!;
  // console.log(secretKey+" "+clientId)
  // console.log(process.env.REACT_APP_SECRET_NAME);

  const googleSignInSuccess = async (res: any) => {
    console.log(res.profileObj.email);
    console.log(res.profileObj.givenName + " " + res.profileObj.familyName);
    // console.log(res.tokenId);
    //calling google login api---------
    await axios
      .post("http://localhost:3000/google-login", { token: res.tokenId })
      .then((response) => {
        console.log(response.data);
        if (response.data.user) {
          loginUser(res.profileObj.email, secretKey);
        } else {
          registerUser(res.profileObj.email, secretKey);
        }
      });
  };

  const googleSignInError = function (res) {
    console.log(res);
  };

  function switchAuthStates() {
    if (num === 1) {
      //login
      setcp("hidden");
      setAuthTitle("Login to your account");
      setSubmitText("Sign in");
      setAuthSwitch("Dont have an account? Create one");
      setNum(0);
    } else if (num === 0) {
      //signup
      setcp("block");
      setAuthTitle("Create new account");
      setSubmitText("create account");
      setAuthSwitch("Already have an account? Sign in");
      setNum(1);
    }
  }
  //REGISTER METHOD ----------------

  //LOGIN METHOD -----------

  return (
    <div
      className={`w-full fixed z-50 ${authPageState} bg-black h-fit top-[-45em]`}
    >
      <div className="w-fit h-fit mx-auto my-8 pb-1 flex flex-row">
        {/* logo section   */}
        <section className="flex flex-col justify-center text-center">
          <h1 className="w-fit text-white logo text-center text-5xl">
            Scoops N <br />
            <span className="mt-2">Smiles</span>
          </h1>
          <p className="text-[#AFAFAF] font-semibold w-56 ml-[-1.4em] mt-10">
            "Without ice cream, there would be darkness and chaos."
          </p>
          <p className="text-[#afafaf] font-semibold ml-[-1.4em] mt-5">
            -Don Cardong
          </p>
        </section>
        <div className="w-1 rounded-lg mx-20 bg-[#afafaf]"></div>
        {/* auth section */}
        <section className="w-fit flex flex-col text-left">
          <h2 className="w-fit text-white font-bold text-2xl text-center">
            {authTitle}
          </h2>
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="text"
            className="w-64 bg-[#414141] text-white font-semibold text-sm rounded-md pl-4 py-4 my-6 mb-0"
            placeholder="email"
          />
          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            className="w-64 bg-[#414141] text-white font-semibold text-sm rounded-md pl-4 py-4 my-6"
            placeholder="password"
          />
          <input
            onChange={(e) => {
              setConfirmPass(e.target.value);
            }}
            type="password"
            className={`w-64 bg-[#414141] text-white font-semibold text-sm rounded-md pl-4 py-4 mb-6 ${cp}`}
            placeholder="confirm password"
          />
          <button
            onClick={() => {
              if (num === 0) {
                //login is showed
                if (email !== "" && password !== "") {
                  loginUser(email, password);
                } else {
                  alert("email or password should not be left empty");
                }
              } else if (num === 1) {
                //sign up is showed
                if (email !== "" && password !== "" && confirmPass !== "") {
                  if (password === confirmPass) {
                    registerUser(email, password);
                  } else {
                    alert("Enter passwords don't match");
                  }
                } else {
                  alert("Please enter the correct email and password");
                }
              }
            }}
            className="w-fit bg-[#6c69f9] text-white px-9 py-4 ml-0 mr-auto rounded-md text-sm font-semibold"
          >
            {submitButton}
          </button>
          <p
            onClick={() => {
              switchAuthStates();
            }}
            className="text-[#bcbaba] underline font-semibold mt-7 cursor-pointer"
          >
            {authSwitch}
          </p>
          <GoogleLogin
            clientId={clientId}
            render={(renderProps) => (
              <div
                onClick={renderProps.onClick}
                className="w-fit cursor-pointer text-black ml-0 mr-auto px-4 py-2 my-6 rounded-md bg-white flex font-sm font-semibold"
              >
                <span className="my-auto h-fit text-sm w-fit">
                  Sign in with google
                </span>
                <img className="w-10 flex" alt="" src="./assets/google.png" />
              </div>
            )}
            buttonText="Sign In"
            onSuccess={googleSignInSuccess}
            onFailure={googleSignInError}
            cookiePolicy={"single_host_origin"}
            isSignedIn={false}
          />
        </section>
      </div>
      <img
        src="./assets/close.png"
        alt=""
        className="w-10 absolute right-10 top-5 cursor-pointer"
        onClick={() => {
          dispatch(changeAuthPageState("animate-slideUp"));
        }}
      />
    </div>
  );
}
