import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/Redux/userSlice";
import { BASE_URL } from "../utils/constants";

const EditProfile = ({ user: propUser }) => {
    const dispatch = useDispatch();
    const reduxUser = useSelector((store) => store.user);
    const user = propUser || reduxUser;

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        gender: "",
        age: "",
        about: "",
        photoUrl: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                gender: user.gender || "",
                age: user.age || "",
                about: user.about || "",
                photoUrl: user.photoUrl || "",
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleUpdate = async () => {
        setError("");
        setSuccess("");
        setIsLoading(true);
        try {
            const res = await axios.patch(
                `${BASE_URL}/profile/update`, // Replace with your exact URL
                formData, // The payload object
                {
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': `Bearer ${token}` // Include if your route is protected
                    },
                    withCredentials: true
                }
            );
            dispatch(addUser(res?.data?.data || res?.data));
            setSuccess("Profile updated successfully!");
            setTimeout(() => {
                const modal = document.getElementById("my_modal_1");
                modal?.close();
            }, 800);
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                err?.response?.data ||
                err?.message ||
                "Failed to update profile";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center grow">
            <div className="card bg-base-200 w-96 max-h-[85vh] overflow-y-auto shadow-sm">
                <div className="card-body">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="card-title text-xl font-bold">Edit Profile</h2>
                        <button
                            type="button"
                            className="btn btn-sm btn-circle btn-ghost"
                            onClick={() => {
                                const modal = document.getElementById("my_modal_1");
                                modal?.close();
                                setError("");
                                setSuccess("");
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    <div className="flex flex-col gap-4">
                        <fieldset className="fieldset">
                            <label className="label" htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                className="input input-bordered w-full"
                                placeholder="Enter first name"
                                onChange={handleChange}
                            />
                        </fieldset>

                        <fieldset className="fieldset">
                            <label className="label" htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                className="input input-bordered w-full"
                                placeholder="Enter last name"
                                onChange={handleChange}
                            />
                        </fieldset>

                        <fieldset className="fieldset">
                            <label className="label" htmlFor="gender">Gender</label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                className="select select-bordered w-full"
                                onChange={handleChange}
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="others">Others</option>
                            </select>
                        </fieldset>

                        <fieldset className="fieldset">
                            <label className="label" htmlFor="age">Age</label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={formData.age}
                                className="input input-bordered w-full"
                                placeholder="Enter age"
                                onChange={handleChange}
                            />
                        </fieldset>

                        <fieldset className="fieldset">
                            <label className="label" htmlFor="photoUrl">Photo URL</label>
                            <input
                                type="text"
                                id="photoUrl"
                                name="photoUrl"
                                value={formData.photoUrl}
                                className="input input-bordered w-full"
                                placeholder="Enter photo URL"
                                onChange={handleChange}
                            />
                        </fieldset>

                        <fieldset className="fieldset">
                            <label className="label" htmlFor="about">About</label>
                            <textarea
                                id="about"
                                name="about"
                                value={formData.about}
                                className="textarea textarea-bordered w-full"
                                placeholder="Enter about / bio"
                                rows={3}
                                onChange={handleChange}
                            />
                        </fieldset>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        {success && <p className="text-green-500 text-sm text-center">{success}</p>}

                        <div className="card-actions pt-2">
                            <button
                                className="btn text-white bg-blue-500 border border-blue-500 hover:bg-blue-400 w-full"
                                onClick={handleUpdate}
                                disabled={isLoading}
                            >
                                {isLoading && <span className="loading loading-spinner loading-xs"></span>}
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;

