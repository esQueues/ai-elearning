import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
    const [student, setStudent] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");

    useEffect(() => {
        axios.get("/api/student/profile", { withCredentials: true })
            .then(response => {
                setStudent(response.data);
                setFormData(response.data);
            })
            .catch(error => {
                console.error("Error fetching student profile:", error);
            });
    }, []);

    const handleEdit = () => setEditing(true);
    const handleCancel = () => setEditing(false);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        axios.put("/api/student/profile/update", formData, { withCredentials: true })
            .then(response => {
                setStudent(response.data);
                setEditing(false);
            })
            .catch(error => {
                console.error("Error updating profile:", error);
            });
    };

    const handleChangePassword = () => {
        axios.put("/api/student/profile/change-password",
            { oldPassword, newPassword },
            { withCredentials: true })
            .then(() => {
                alert("Password changed successfully");
                setOldPassword("");
                setNewPassword("");
                setShowChangePassword(false);
            })
            .catch(error => {
                if (error.response && error.response.status === 500) {
                    alert("Old password isn't correct");
                } else {
                    console.error("Error changing password:", error);
                }
            });
    };

    if (!student) return <p className="text-center fs-4 mt-4">Loading...</p>;

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-center">Student Profile</h1>
            <div className="card shadow-sm p-4 d-flex flex-row align-items-center">
                <div className="p-3">
                    <div style={{
                        width: "150px",
                        height: "150px",
                        backgroundColor: "#d1d1d1",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "10px"
                    }}>
                        <i className="fas fa-user text-secondary" style={{ fontSize: "80px" }}></i>
                    </div>
                </div>

                <div className="p-3">
                    {editing ? (
                        <>
                            <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} />
                            <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} />
                            <input type="text" name="gradeLevel" value={formData.gradeLevel} onChange={handleChange} />
                            <input type="text" name="schoolInfo" value={formData.schoolInfo} onChange={handleChange} />
                            <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} />
                            <button onClick={handleSave}>Save</button>
                            <button onClick={handleCancel}>Cancel</button>
                        </>
                    ) : (
                        <>
                            <h2 className="mt-3">{student.firstname} {student.lastname}</h2>
                            <p className="text-muted"><strong>Email:</strong> {student.email}</p>
                            <p className="text-muted"><strong>Grade:</strong> {student.gradeLevel}</p>
                            <p className="text-muted"><strong>School:</strong> {student.schoolInfo}</p>
                            <p className="text-muted"><strong>Birthday:</strong> {student.birthday}</p>
                            <button onClick={handleEdit}>Edit Profile</button>
                            <button onClick={() => setShowChangePassword(true)}>Change Password</button>
                        </>
                    )}
                </div>
            </div>

            {showChangePassword && (
                <div className="mt-4">
                    <h2>Change Password</h2>
                    <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                    <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    <button onClick={handleChangePassword}>Change Password</button>
                    <button onClick={() => setShowChangePassword(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default Profile;
