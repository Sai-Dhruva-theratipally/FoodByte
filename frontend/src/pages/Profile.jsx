import PageHeader from "../components/PageHeader";

function Profile() {
  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  return (
    <main className="page narrow-page">
      <PageHeader title="Profile" subtitle="A simple view of the currently logged in user." />

      <div className="form-card">
        <div className="profile-row">
          <span>Name</span>
          <strong>{user?.name || "Not available"}</strong>
        </div>
        <div className="profile-row">
          <span>Email</span>
          <strong>{user?.email || "Not available"}</strong>
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
