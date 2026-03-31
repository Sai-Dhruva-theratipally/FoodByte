import PageHeader from "../components/PageHeader";
import { getStoredUser } from "../services/api";

function Profile() {
  const user = getStoredUser();

  return (
    <main className="page narrow-page">
      <PageHeader title="Profile" subtitle="A simple view of the currently logged in user." />

      <div className="form-card">
        <div className="profile-row">
          <span>User ID</span>
          <strong>{user?.userId || "Not available"}</strong>
        </div>
        <div className="profile-row">
          <span>Name</span>
          <strong>{user?.name || "Not available"}</strong>
        </div>
        <div className="profile-row">
          <span>Email</span>
          <strong>{user?.email || "Not available"}</strong>
        </div>
        <div className="profile-row">
          <span>Role</span>
          <strong>{user?.role || "Not available"}</strong>
        </div>
        <div className="profile-row">
          <span>Token Status</span>
          <strong>{localStorage.getItem("token") ? "Logged in" : "Logged out"}</strong>
        </div>
      </div>
    </main>
  );
}

export default Profile;
