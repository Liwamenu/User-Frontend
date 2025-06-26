import { combineReducers } from "@reduxjs/toolkit";

// Slices
import loginSlice from "./loginSlice";
import verifyCodeSlice from "./verifyCodeSlice";
import logoutSlice from "./logoutSlice";
import registerSlice from "./registerSlice";
import forgotPasswordSlice from "./forgotPasswordSlice";
import changePasswordSlice from "./changePasswordSlice";
import userVerificationSlice from "./userVerificationSlice";

const authSlice = combineReducers({
  login: loginSlice,
  logout: logoutSlice,
  register: registerSlice,
  forgotPassword: forgotPasswordSlice,
  changePassword: changePasswordSlice,
  verifyUser: userVerificationSlice,
  verifyCode: verifyCodeSlice,
});

export default authSlice;
