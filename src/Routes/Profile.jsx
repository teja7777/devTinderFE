import React, { useState } from "react";
import { useSelector } from "react-redux";
import EditProfile from "../components/EditProfile";

const Profile = () => {
    const profileData = useSelector((store) => store.user);
    const [imgError, setImgError] = useState(false);

    if (!profileData) return null;

    const { firstName, lastName, age, gender, about, photoUrl, emailId, email, skills } = profileData;
    const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Developer";
    const userEmail = emailId || email;
    const avatarUrl = (!imgError && photoUrl)
        ? photoUrl
        : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

    return (
        <div className="min-h-[85vh] bg-base-200 py-10 px-4 flex justify-center items-center">
            <div className="card w-full max-w-2xl bg-base-100 shadow-2xl border border-base-300 overflow-hidden">
                {/* Header Cover Banner */}
                <div className="h-36 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 relative">
                    <div className="absolute right-4 top-4">
                        <button
                            className="btn btn-sm btn-ghost bg-base-100/30 backdrop-blur-md text-white hover:bg-base-100/50 border-none flex items-center gap-1.5 shadow-sm"
                            onClick={() => document.getElementById("my_modal_1").showModal()}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Edit
                        </button>
                    </div>
                </div>

                <div className="card-body pt-0 px-6 sm:px-10 pb-8">
                    {/* Avatar & Header Details */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 mb-6 text-center sm:text-left">
                        {/* Only the avatar overlaps the banner */}
                        <div className="avatar -mt-16 sm:-mt-20 shrink-0 z-10">
                            <div className="w-28 sm:w-32 h-28 sm:h-32 rounded-2xl ring-4 ring-base-100 shadow-xl bg-base-200 overflow-hidden">
                                <img
                                    src={avatarUrl}
                                    alt={fullName}
                                    className="w-full h-full object-cover object-top"
                                    onError={() => setImgError(true)}
                                />
                            </div>
                        </div>

                        {/* Name and Email sit safely below the banner */}
                        <div className="flex-1 pt-2 sm:pt-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-base-content">
                                        {fullName}
                                    </h1>
                                    {userEmail && (
                                        <p className="text-sm text-base-content/70 flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-70 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                            </svg>
                                            <span className="truncate">{userEmail}</span>
                                        </p>
                                    )}
                                </div>
                                <div className="flex justify-center sm:justify-end gap-2 flex-wrap">
                                    {age && (
                                        <span className="badge badge-lg bg-base-200 border-base-300 font-semibold text-xs py-3 px-3 shadow-xs">
                                            🎂 {age} yrs
                                        </span>
                                    )}
                                    {gender && (
                                        <span className="badge badge-lg badge-primary badge-outline font-semibold text-xs py-3 px-3 capitalize shadow-xs">
                                            {gender.toLowerCase() === "male"
                                                ? "♂ Male"
                                                : gender.toLowerCase() === "female"
                                                    ? "♀ Female"
                                                    : `⚧ ${gender}`}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="divider my-1"></div>

                    {/* About Section */}
                    <div className="my-3">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-base-content/60 mb-2">
                            About Me
                        </h2>
                        <div className="bg-base-200/70 p-4 rounded-xl border border-base-300/60 leading-relaxed text-base-content/90">
                            {about ? (
                                <p className="whitespace-pre-line">{about}</p>
                            ) : (
                                <p className="italic text-base-content/50">
                                    No bio added yet. Tell other developers about your background, interests, and what you're working on!
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Quick Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
                        <div className="flex items-center gap-3 p-3.5 bg-base-200/50 rounded-xl border border-base-300/50">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs text-base-content/60 font-medium">Gender</p>
                                <p className="text-sm font-semibold capitalize truncate">
                                    {gender || "Not specified"}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3.5 bg-base-200/50 rounded-xl border border-base-300/50">
                            <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs text-base-content/60 font-medium">Age</p>
                                <p className="text-sm font-semibold truncate">
                                    {age ? `${age} years old` : "Not specified"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Skills (if present) */}
                    {skills && (Array.isArray(skills) ? skills.length > 0 : Boolean(skills)) && (
                        <div className="my-3">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-base-content/60 mb-2">
                                Skills & Technologies
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {(Array.isArray(skills) ? skills : String(skills).split(",")).map((skill, index) => (
                                    <span key={index} className="badge badge-neutral py-3 px-3.5 text-xs font-semibold">
                                        {typeof skill === "string" ? skill.trim() : skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Button */}
                    {/* <div className="mt-6 flex justify-end">
                        <button
                            className="btn btn-primary w-full sm:w-auto px-8 gap-2 shadow-md"
                            onClick={() => document.getElementById("my_modal_1").showModal()}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Edit Profile
                        </button>
                    </div> */}
                </div>
            </div>

            {/* Edit Modal */}
            <dialog id="my_modal_1" className="modal">
                <EditProfile user={profileData} />
            </dialog>
        </div>
    );
};

export default Profile;
