import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Chip } from "@mui/material";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [profileImages, setProfileImages] = useState({});
    const [teacherImages, setTeacherImages] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");

    const defaultImage = "https://sea-ac-ae.s3.me-south-1.amazonaws.com/wp-content/uploads/2024/06/19142849/Cover%402x.png";

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 1000);
        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    useEffect(() => {
        fetchCourses(debouncedQuery);
    }, [debouncedQuery]);

    useEffect(() => {
        const fetchTeacherImages = async () => {
            const teacherImagePromises = courses.map((course) =>
                axios.get(`/api/teachers/profile/image/${course.teacher.id}`, {
                    withCredentials: true,
                    responseType: "blob",
                })
                .then((response) => ({
                    id: course.teacher.id,
                    url: URL.createObjectURL(response.data),
                }))
                .catch(() => ({
                    id: course.teacher.id,
                    url: defaultImage,
                }))
            );

            Promise.all(teacherImagePromises).then((imageResults) => {
                const images = imageResults.reduce((acc, { id, url }) => {
                    acc[id] = url;
                    return acc;
                }, {});
                setTeacherImages(images);
            });
        };

        if (courses.length > 0) {
            fetchTeacherImages();
        }
    }, [courses]);

    const fetchCourses = (query) => {
        setLoading(true);
        axios.get(`/api/courses/get?query=${query}`, { withCredentials: true })
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setCourses(response.data);
                    const imagePromises = response.data.map((course) =>
                        axios.get(`/api/courses/profile/image/${course.id}`, {
                            withCredentials: true,
                            responseType: "blob",
                        })
                        .then((imageResponse) => ({
                            id: course.id,
                            url: URL.createObjectURL(imageResponse.data),
                        }))
                        .catch(() => ({
                            id: course.id,
                            url: defaultImage,
                        }))
                    );
                    Promise.all(imagePromises).then((imageResults) => {
                        const images = imageResults.reduce((acc, { id, url }) => {
                            acc[id] = url;
                            return acc;
                        }, {});
                        setProfileImages(images);
                    });
                } else {
                    setCourses([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching courses:", error);
                setCourses([]);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        return () => {
            Object.values(profileImages).forEach((url) => {
                if (url.startsWith("blob:")) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [profileImages]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    if (loading) {
        return <div className="text-center fs-4 fw-semibold mt-4">Loading...</div>;
    }

    const filteredCourses = selectedFilters.length > 0
        ? courses.filter((course) => selectedFilters.includes(course.title))
        : courses;

    return (
        <div className="container mt-4 mb-5">
            <Box sx={{ width: "90%", maxWidth: 1200, margin: "20px auto", borderRadius: "30px", boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)", overflow: "hidden" }}>
                <Box component="img" src="/dashboard.png" alt="Course List Banner" sx={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "20px" }} />
            </Box>

            <h2 className="text-center fw-semibold mt-5 mb-5" style={{ color: "#333", fontSize: "28px" }}> Discover Courses </h2>


            {/* Search Bar */}
            <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
                <Box 
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "60%",
                        border: "2px solid #ccc",
                        borderRadius: "30px",
                        padding: "6px 16px",
                        backgroundColor: "white",
                        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)",
                        position: "relative",
                    }}
                >
                    {/* 🔹 Category */}
                    <FormControl sx={{ flex: 1, minWidth: 150, pr: 2, borderRight: "1px solid #ccc" }}>
                        <InputLabel sx={{ transform: selectedFilters.length > 0 ? "translate(12px, -6px) scale(0.85)" : "translate(16px, 12px) scale(1)", color: "rgba(0, 0, 0, 0.6)", fontSize: "16px", fontWeight: "400", px: 1 }}>
                            {selectedFilters.length > 0 ? "Category" : ""}
                        </InputLabel>

                        <Select multiple displayEmpty value={selectedFilters} onChange={(event) => { 
                            setSelectedFilters(typeof event.target.value === "string" ? event.target.value.split(",") : event.target.value);
                        }}
                            renderValue={(selected) =>
                                selected.length === 0 ? "Category" : (
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} onDelete={(event) => { 
                                                event.stopPropagation();
                                                setSelectedFilters((prevFilters) => prevFilters.filter((filter) => filter !== value)); 
                                            }}
                                                onMouseDown={(event) => event.stopPropagation()} 
                                                sx={{ backgroundColor: "#f0f0f0", fontSize: "14px", "& .MuiChip-deleteIcon": { color: "rgba(0, 0, 0, 0.5)" } }} 
                                            />
                                        ))}
                                    </Box>
                                )
                            }
                            MenuProps={{ PaperProps: { style: { maxHeight: 300 } }, keepMounted: true }}
                            sx={{ minWidth: selectedFilters.length > 2 ? 200 : 150, "& .MuiOutlinedInput-notchedOutline": { border: "none" }, "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" } }}
                        >
                            {courses.map((course) => <MenuItem key={course.title} value={course.title}>{course.title}</MenuItem>)}
                        </Select>
                    </FormControl>

                    {/* 🔹 Search line */}
                    <TextField variant="standard" placeholder="Search for courses ..." value={searchQuery} 
                        onChange={(event) => setSearchQuery(event.target.value)} sx={{ flex: 2, ml: 2 }} 
                        InputProps={{ disableUnderline: true }} 
                    />

                    {/* 🔹 Search icon */}
                    <i className="fas fa-search" style={{ fontSize: "20px", color: "rgba(0, 0, 0, 0.5)", cursor: "pointer" }} 
                        onClick={() => fetchCourses(searchQuery)}> 
                    </i>
                </Box>
            </Box>


            {/* Course List */}
            <div className="row g-4 justify-content-center">
                {filteredCourses.map((course) => {
                    console.log("Course data:", course);
                    
                    return (
                        <div key={course.id} className="col-lg-4 col-md-6 col-sm-12">
                        <Link to={`/courses/${course.id}`} className="text-decoration-none">
                            <div className="card h-100 shadow-sm rounded-4"
                                style={{
                                    border: "1px solid #ccc", 
                                    borderRadius: "12px", 
                                    overflow: "hidden", 
                                    transition: "0.3s ease"
                                }}
                                onMouseOver={(e) => { 
                                    e.currentTarget.style.backgroundColor = "#E8F5E9"; 

                                    const title = e.currentTarget.querySelector(".course-title"); 
                                    if (title) {
                                        title.style.color = "#4CAF50"; 
                                    }

                                    const btn = e.currentTarget.querySelector(".view-course-btn"); 
                                    if (btn) {
                                        btn.style.backgroundColor = "#4CAF50"; 
                                        btn.style.color = "#fff"; 
                                    }
                                }}
                                onMouseOut={(e) => { 
                                    e.currentTarget.style.backgroundColor = "white"; 

                                    const title = e.currentTarget.querySelector(".course-title");
                                    if (title) {
                                        title.style.color = "#212529"; 
                                    }

                                    const btn = e.currentTarget.querySelector(".view-course-btn");
                                    if (btn) {
                                        btn.style.backgroundColor = "transparent"; 
                                        btn.style.color = "#8BC34A"; 
                                    }
                                }}
                            >
                                <div style={{ position: "relative" }}>
                                    <img src={profileImages[course.id] || defaultImage} 
                                        alt="Course Banner"
                                        className="card-img-top shadow-sm"  
                                        style={{ 
                                            width: "100%", 
                                            height: "170px", 
                                            objectFit: "cover",  
                                            margin: "0",  
                                            borderRadius: "12px 12px 0 0" 
                                        }} 
                                        onError={(e) => { e.target.src = defaultImage; }}
                                    />
                                </div>
                                <div className="card-body text-start">
                                    <h5 className="card-title course-title fw-bold">{course.title}</h5> 
                                    <p className="text-muted small mb-2">{course.title}</p>
                                    <p className="text-muted small mb-2"
                                        style={{
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            width: "100%"
                                        }}
                                    >
                                        {course.description}
                                    </p>
                                    <div className="d-flex align-items-center">
                                        <img 
                                            src={teacherImages[course.teacher.id] || defaultImage} 
                                            alt="Teacher Avatar"
                                            className="rounded-circle border shadow-sm"  
                                            style={{ width: "35px", height: "35px", objectFit: "cover", marginRight: "10px" }} 
                                            onError={(e) => { e.target.src = defaultImage; }}
                                        />
                                        <p className="card-text text-dark mb-0">
                                            {course.teacher?.firstname ?? "Unknown"} {course.teacher?.lastname ?? ""}
                                        </p>
                                    </div>

                                    {/* 🔹 Button "View Course" */}
                                    <div className="text-center mt-3">
                                        <Link to={`/courses/${course.id}`} className="text-decoration-none">
                                            <button className="btn fw-bold rounded-pill px-4 py-2 view-course-btn"
                                                style={{
                                                    border: "2px solid #8BC34A",
                                                    color: "#8BC34A",
                                                    backgroundColor: "transparent",
                                                    transition: "0.3s ease"
                                                }}
                                                onMouseOver={(e) => { e.target.style.backgroundColor = "#4CAF50"; e.target.style.color = "#fff"; }} 
                                                onMouseOut={(e) => { e.target.style.backgroundColor = "transparent"; e.target.style.color = "#8BC34A"; }}
                                            >
                                                View Course
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    );
                })}
            </div>
        </div>
    );
};

export default CourseList;
