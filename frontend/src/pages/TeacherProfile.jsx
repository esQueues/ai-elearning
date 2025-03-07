import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const TeacherProfile = () => {
    const { teacherId } = useParams();
    const [teacher, setTeacher] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");

    useEffect(() => {
        axios
            .get(`/api/teachers/${teacherId}`, { withCredentials: true })
            .then((response) => {
                setTeacher(response.data);
                setFormData(response.data);
            })
            .catch((error) => console.error("Error fetching teacher profile:", error))
            .finally(() => setLoading(false));
    }, [teacherId]);

    const handleEdit = () => setEditing(true);
    const handleCancel = () => setEditing(false);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        axios.put(`/api/teachers/${teacherId}/update`, formData, { withCredentials: true })
            .then(response => {
                setTeacher(response.data);
                setEditing(false);
            })
            .catch(error => {
                console.error("Error updating profile:", error);
            });
    };

    const handleChangePassword = () => {
        axios.put(`/api/teachers/profile/change-password`,
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

    if (loading) return <p className="text-center mt-4 fs-4 fw-semibold">Loading...</p>;
    if (!teacher) return <p className="text-center text-danger fs-5">Teacher not found.</p>;

    return (
        <div className="container py-5" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <div className="card shadow-lg mb-4 p-4" style={{ borderRadius: "12px" }}>
                <div className="card-body d-flex align-items-center">
                    <img
                        src="https://img.freepik.com/premium-vector/girl-holding-pencil-picture-girl-holding-book_1013341-447639.jpg?semt=ais_hybrid"
                        alt="Teacher"
                        className="rounded-circle border p-2"
                        width="120"
                        height="120"
                    />
                    <div className="ms-4 w-100">
                        {editing ? (
                            <div className="bg-light p-3 rounded shadow-sm">
                                <h3 className="text-secondary">Edit Profile</h3>
                                <input className="form-control my-2" type="text" name="firstname" value={formData.firstname} onChange={handleChange} placeholder="First Name" />
                                <input className="form-control my-2" type="text" name="lastname" value={formData.lastname} onChange={handleChange} placeholder="Last Name" />
                                <textarea className="form-control my-2" name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio"></textarea>
                                <div className="mt-3">
                                    <button className="btn btn-success me-2" onClick={handleSave}>Save</button>
                                    <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h1 className="card-title fw-bold text-primary">{teacher.firstname} {teacher.lastname}</h1>
                                <p className="text-muted fs-5">{teacher.email}</p>
                                <div className="p-3 bg-light border rounded" style={{ maxWidth: "600px" }}>
                                    <h5 className="fw-bold mb-2 text-secondary">About</h5>
                                    <p className="fs-5 text-dark">{teacher.bio}</p>
                                </div>
                                <div className="mt-3">
                                    <button className="btn btn-primary me-2" onClick={handleEdit}>Edit Profile</button>
                                    <button className="btn btn-warning" onClick={() => setShowChangePassword(true)}>Change Password</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {showChangePassword && (
                <div className="mt-4 p-4 bg-light border rounded shadow-sm">
                    <h3 className="text-secondary">Change Password</h3>
                    <input className="form-control my-2" type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                    <input className="form-control my-2" type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    <div className="mt-3">
                        <button className="btn btn-danger me-2" onClick={handleChangePassword}>Change Password</button>
                        <button className="btn btn-secondary" onClick={() => setShowChangePassword(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherProfile;
