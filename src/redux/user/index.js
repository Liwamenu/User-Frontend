import { combineReducers } from "@reduxjs/toolkit";

// Slices
import getUserSlice from "./getUserSlice";
import updateUserDataSlice from "./updateUserDataSlice";
import updateUserInvoiceSlice from "./updateUserInvoiceSlice";
import addUserInvoiceSlice from "./addUserInvoiceSlice";
import updateUserPasswordSlice from "./updateUserPasswordSlice";
import getUserLockSlice from "./getUserLockSlice";
import updateUserLockSlice from "./updateUserLockSlice";
import updateUserLangSlice from "./updateUserLangSlice";

const userSlice = combineReducers({
  getUser: getUserSlice,
  updateUserData: updateUserDataSlice,
  updateUserLang: updateUserLangSlice,
  updateInvoice: updateUserInvoiceSlice,
  addInvoice: addUserInvoiceSlice,
  updatePassword: updateUserPasswordSlice,
  getUserLock: getUserLockSlice,
  updateUserLock: updateUserLockSlice,
});

export default userSlice;
