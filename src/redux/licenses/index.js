import { combineReducers } from "@reduxjs/toolkit";

// Slices
import addLicenseSlice from "./addLicenseSlice";
import getLicensesSlice from "./getLicensesSlice";
import deleteLicenseSlice from "./deleteLicenseSlice";
import getUserLicensesSlice from "./getUserLicensesSlice";
import updateLicenseDateSlice from "./updateLicenseDateSlice";
import addByBankPaySlice from "./addLicense/addByBankPaySlice";
import addByOnlinePaySlice from "./addLicense/addByOnlinePaySlice";
import updateLicenseIsActiveSlice from "./updateLicenseIsActiveSlice";
import getRestaurantLicensesSlice from "./getRestaurantLicensesSlice";
import extendByBankPaySlice from "./extendLicense/extendByBankPaySlice";
import extendByOnlinePaySlice from "./extendLicense/extendByOnlinePaySlice";
import getWaitingYemekSepetiLicensesSlice from "./getWaitingYemekSepetiLicensesSlice";
import licenseTransferSlice from "./licenseTransferSlice";

const licensesSlice = combineReducers({
  getLicenses: getLicensesSlice,
  getUserLicenses: getUserLicensesSlice,
  getRestaurantLicenses: getRestaurantLicensesSlice,
  addLicense: addLicenseSlice,
  updateLicenseDate: updateLicenseDateSlice,
  updateLicenseIsActive: updateLicenseIsActiveSlice,
  deleteLicense: deleteLicenseSlice,
  extendByPay: extendByOnlinePaySlice,
  addByPay: addByOnlinePaySlice,
  addByBank: addByBankPaySlice,
  extendByBank: extendByBankPaySlice,
  getYsMailWaiters: getWaitingYemekSepetiLicensesSlice,
  licenseTransfer: licenseTransferSlice,
});

export default licensesSlice;
