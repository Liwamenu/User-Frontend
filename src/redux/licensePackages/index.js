import { combineReducers } from "@reduxjs/toolkit";
import getLicensePackagesSlice from "./getLicensePackagesSlice";
import addLicensePackageSlice from "./addLicensePackageSlice";
import deleteLicensePackageSlice from "./deleteLicensePackageSlice";
import updateLicensePackageSlice from "./updateLicensePackageSlice";

const licensePackagesSlice = combineReducers({
  getLicensePackages: getLicensePackagesSlice,
  addLicensePackage: addLicensePackageSlice,
  deleteLicensePackage: deleteLicensePackageSlice,
  updateLicensePackage: updateLicensePackageSlice,
});

export default licensePackagesSlice;
