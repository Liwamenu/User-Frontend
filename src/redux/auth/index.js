import { combineReducers } from "@reduxjs/toolkit";

// Slices
import loginSlice from "./loginSlice";
import verifyCodeSlice from "./verifyCodeSlice";
import logoutSlice from "./logoutSlice";
import registerSlice from "./registerSlice";
import forgotPasswordSlice from "./forgotPasswordSlice";
import changePasswordSlice from "./changePasswordSlice";
import sendVerificationSlice from "./sendVerificationSlice";
import verifyEmailSlice from "./verifyEmailSlice";

const authSlice = combineReducers({
  login: loginSlice,
  logout: logoutSlice,
  register: registerSlice,
  forgotPassword: forgotPasswordSlice,
  changePassword: changePasswordSlice,
  sendVerification: sendVerificationSlice,
  verifyCode: verifyCodeSlice,
  verifyEmail: verifyEmailSlice,
});

export default authSlice;
