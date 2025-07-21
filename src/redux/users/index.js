import { combineReducers } from "@reduxjs/toolkit";

// Slices
import getUsersSlice from "./getUsersSlice";
import getUserByIdSlice from "./getUserByIdSlice";
import addUserSlice from "./addUserSlice";
import deleteUserSlice from "./deleteUserSlice";
import updateUserDataByIdSlice from "./updateUserDataByIdSlice";
import adduserInvoiceSlice from "./addUserInvoiceByIdSlice";
import updateUserIsActiveSlice from "./updateUserIsActiveSlice";
import updateUserIsVerifiedSlice from "./updateUserIsVerifiedSlice";
import updateUserInvoiceByIdSlice from "./updateUserInvoiceByIdSlice";
import updateUserPasswordByIdSlice from "./updateUserPasswordByIdSlice";
import updateUserIsDealerSlice from "./updateUserIsDealerSlice";
import transferDealerSlice from "./transferDealerSlice";

const usersSlice = combineReducers({
  getUsers: getUsersSlice,
  getUser: getUserByIdSlice,
  addUser: addUserSlice,
  delete: deleteUserSlice,
  updateUser: updateUserDataByIdSlice,
  addInvoice: adduserInvoiceSlice,
  updateInvoice: updateUserInvoiceByIdSlice,
  updatePassword: updateUserPasswordByIdSlice,
  updateIsActive: updateUserIsActiveSlice,
  updateIsVerified: updateUserIsVerifiedSlice,
  updateIsDealer: updateUserIsDealerSlice,
  transferDealer: transferDealerSlice,
});

export default usersSlice;
