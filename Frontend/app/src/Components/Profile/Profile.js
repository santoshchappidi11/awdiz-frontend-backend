import React, { useContext, useEffect, useState } from "react";
import "./Profile.css";
import AuthProtected from "../Common/AuthProtected";
import { AuthContexts } from "../../Context/AuthContext";
// import axios from "axios";
import { toast } from "react-hot-toast";
import api from "../ApiConfig";

const Profile = () => {
  const { state } = useContext(AuthContexts);
  console.log(state);

  const [number, setNumber] = useState("ex: 123456789");
  const [isNumberVerified, setIsNumberVerified] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpNumber, setOtpNumber] = useState();

  useEffect(() => {
    const getCurrentUserNumber = async () => {
      try {
        const response = await api.post("/get-user-number", {
          userId: state?.currentUser?._id,
        });

        if (response.data.success) {
          setNumber(response.data.number);
          setIsNumberVerified(response.data.isNumberVerified);
        } else {
          setNumber("ex: 123456789");
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (state?.currentUser?._id) {
      getCurrentUserNumber();
    }
  }, [state]);

  const sendOtp = async () => {
    try {
      const response = await api.post("/send-otp", {
        userId: state?.currentUser?._id,
      });
      if (response.data.success) {
        setIsOtpSent(true);
        toast.success("OTP sent to your registered number!");
      } else {
        setIsOtpSent(false);
        // toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otpNumber) {
      try {
        const response = await api.post("/verify-otp", {
          userId: state?.currentUser?._id,
          otpNumber,
        });

        if (response.data.success) {
          console.log(response.data);
          setIsOtpSent(false);
          setIsNumberVerified(response.data.isNumberVerified);
          toast.success("OTP is verified!");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      toast.error("Please fill the details!");
    }
  };

  return (
    <AuthProtected>
      <div id="profile-screen">
        <div id="profile">
          <h2>Profile</h2>
          <h3>Complete Your Phone Verification</h3>
          <h4>Your Number: {number && <span>91+ {number}</span>}</h4>

          <div id="verify-number">
            {isNumberVerified ? (
              <h3>Your Number has been Verified!</h3>
            ) : (
              <button onClick={sendOtp}>Verify Your Number</button>
            )}

            {isOtpSent && (
              <form onSubmit={handleVerifyOtp}>
                <input
                  type="text"
                  placeholder="Enter Your OTP"
                  onChange={(e) => setOtpNumber(e.target.value)}
                />
                <button type="submit">Verify</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </AuthProtected>
  );
};

export default Profile;
