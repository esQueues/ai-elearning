import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const TeacherProfile = () => {
    const navigate = useNavigate();
    const [teacher, setTeacher] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);

    const defaultImage =
        "https://img.freepik.com/premium-vector/girl-holding-pencil-picture-girl-holding-book_1013341-447639.jpg?semt=ais_hybrid";

    useEffect(() => {
        // Fetch teacher profile
        axios
            .get(`/api/teachers/profile`, { withCredentials: true })
            .then((response) => {
                setTeacher(response.data);
                setFormData(response.data);

                // Fetch profile image using teacher ID
                return axios.get(`/api/teachers/profile/image/${response.data.id}`, {
                    withCredentials: true,
                    responseType: "blob",
                });
            })
            .then((imageResponse) => {
                const imageUrl = URL.createObjectURL(imageResponse.data);
                setProfileImage(imageUrl);
            })
            .catch((error) => {
                console.error("Error fetching teacher profile or image:", error);
                setProfileImage(defaultImage);
                if (error.response?.status === 401) {
                    navigate("/login");
                }
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    useEffect(() => {
        return () => {
            if (profileImage && profileImage.startsWith("blob:")) {
                URL.revokeObjectURL(profileImage);
            }
        };
    }, [profileImage]);

    const handleEdit = () => setEditing(true);
    const handleCancel = () => setEditing(false);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        axios
            .put(`/api/teachers/profile/update`, formData, { withCredentials: true })
            .then((response) => {
                setTeacher(response.data);
                setEditing(false);
            })
            .catch((error) => {
                console.error("Error updating profile:", error);
            });
    };

    const handleChangePassword = () => {
        axios
            .put(
                `/api/teachers/profile/change-password`,
                { oldPassword, newPassword },
                { withCredentials: true }
            )
            .then(() => {
                alert("Password changed successfully");
                setOldPassword("");
                setNewPassword("");
                setShowChangePassword(false);
            })
            .catch((error) => {
                if (error.response && error.response.status === 500) {
                    alert("Old password isn't correct");
                } else {
                    console.error("Error changing password:", error);
                }
            });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleImageUpload = () => {
        if (!selectedFile) {
            alert("Please select an image file");
            return;
        }

        setImageUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append("file", selectedFile);

        axios
            .post("/api/teachers/profile/image", uploadFormData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then(() => {
                // Fetch the updated image using teacher ID
                return axios.get(`/api/teachers/profile/image/${teacher.id}`, {
                    withCredentials: true,
                    responseType: "blob",
                });
            })
            .then((imageResponse) => {
                const newImageUrl = URL.createObjectURL(imageResponse.data);
                setProfileImage(newImageUrl);
                setTeacher({ ...teacher, profileImagePath: newImageUrl });
                setSelectedFile(null);
                alert("Profile image uploaded successfully");
            })
            .catch((error) => {
                console.error("Error uploading image:", error);
                alert(error.response?.data || "Error uploading image");
            })
            .finally(() => setImageUploading(false));
    };

    if (loading) return <p className="text-center mt-4 fs-4 fw-semibold">Loading...</p>;
    if (!teacher && !loading)
        return <p className="text-center text-danger fs-5">Teacher profile not found. Please log in.</p>;

    return (
        <div className="container py-5" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            <div className="card shadow-lg mb-4 p-4" style={{ borderRadius: "12px" }}>
                <div className="card-body d-flex align-items-center">
                    <img
                        src={profileImage}
                        alt={`${teacher?.firstname} ${teacher?.lastname}`}
                        className="rounded-circle border p-2"
                        width="120"
                        height="120"
                        onError={(e) => {
                            e.target.src = defaultImage;
                        }}
                    />
                    <div className="ms-4 w-100">
                        {editing ? (
                            <div className="bg-light p-3 rounded shadow-sm">
                                <h3 className="text-secondary">Edit Profile</h3>
                                <input
                                    className="form-control my-2"
                                    type="text"
                                    name="firstname"
                                    value={formData.firstname || ""}
                                    onChange={handleChange}
                                    placeholder="First Name"
                                />
                                <input
                                    className="form-control my-2"
                                    type="text"
                                    name="lastname"
                                    value={formData.lastname || ""}
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                />
                                <textarea
                                    className="form-control my-2"
                                    name="bio"
                                    value={formData.bio || ""}
                                    onChange={handleChange}
                                    placeholder="Bio"
                                ></textarea>
                                <div className="mt-3">
                                    <button className="btn btn-success me-2" onClick={handleSave}>
                                        Save
                                    </button>
                                    <button className="btn btn-secondary" onClick={handleCancel}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h1 className="card-title fw-bold text-primary">
                                    {teacher.firstname} {teacher.lastname}
                                </h1>
                                <p className="text-muted fs-5">{teacher.email}</p>
                                <div className="p-3 bg-light border rounded" style={{ maxWidth: "600px" }}>
                                    <h5 className="fw-bold mb-2 text-secondary">About</h5>
                                    <p className="fs-5 text-dark">{teacher.bio || "No bio available."}</p>
                                </div>
                                <div className="mt-3">
                                    <button className="btn btn-primary me-2" onClick={handleEdit}>
                                        Edit Profile
                                    </button>
                                    <button
                                        className="btn btn-warning me-2"
                                        onClick={() => setShowChangePassword(true)}
                                    >
                                        Change Password
                                    </button>
                                </div>
                                <div className="mt-3">
                                    <input
                                        type="file"
                                        className="form-control my-2"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <button
                                        className="btn btn-info"
                                        onClick={handleImageUpload}
                                        disabled={imageUploading}
                                    >
                                        {imageUploading ? "Uploading..." : "Upload Profile Image"}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {showChangePassword && (
                <div className="mt-4 p-4 bg-light border rounded shadow-sm">
                    <h3 className="text-secondary">Change Password</h3>
                    <input
                        className="form-control my-2"
                        type="password"
                        placeholder="Old Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <input
                        className="form-control my-2"
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <div className="mt-3">
                        <button className="btn btn-danger me-2" onClick={handleChangePassword}>
                            Change Password
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowChangePassword(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherProfile;