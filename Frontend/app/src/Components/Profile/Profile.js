import React, { useContext, useEffect, useState } from "react";
import "./Profile.css";
import AuthProtected from "../Common/AuthProtected";
import { AuthContexts } from "../../Context/AuthContext";
import axios from "axios";
import { toast } from "react-hot-toast";

const Profile = () => {
  const { state } = useContext(AuthContexts);
  const [number, setNumber] = useState(0);
  const [isNumberVerified, setIsNumberVerified] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpNumber, setOtpNumber] = useState();

  useEffect(() => {
    const getCurrentUserNumber = async () => {
      try {
        if (state.currentUser.name) {
          const response = await axios.post(
            "http://localhost:8002/get-user-number",
            {
              userId: state?.currentUser?._id,
            }
          );

          if (response.data.success) {
            setNumber(response.data.number);
            setIsNumberVerified(response.data.isNumberVerified);
          } else {
            setNumber(0);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    getCurrentUserNumber();
  }, [state]);

  const sendOtp = async () => {
    //     try {
    //       const response = await axios.post("http://localhost:8002/send-otp", {
    //         userId: state?.currentUser?._id,
    //       });
    //       if (response.data.success) {
    //         setIsOtpSent(true);
    //         toast.success("OTP sent to your registered number!");
    //       } else {
    //         setIsOtpSent(false);
    //         // toast.error(response.data.message);
    //       }
    //     } catch (error) {
    //       console.log(error);
    //     }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8002/verify-otp", {
        userId: state?.currentUser?._id,
        otpNumber,
      });

      if (response.data.success) {
        setIsOtpSent(false);
        setIsNumberVerified(response.data.isNumberVerified);
        toast.success("OTP is verified!");
      }
    } catch (error) {
      console.log(error);
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
              <h3>Your Number Verified</h3>
            ) : (
              <button onClick={sendOtp}>Verify Your Number</button>
            )}

            {isOtpSent && (
              <form onSubmit={handleVerifyOtp}>
                <input
                  type="number"
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
