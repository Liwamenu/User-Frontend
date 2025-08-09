import { Route, Routes } from "react-router-dom";
import NotFound from "./404";
import ProfilePage from "../components/profile/profilePage";

const Profile = () => {
  return (
    <Routes>
      <Route path="/" element={<ProfilePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Profile;
