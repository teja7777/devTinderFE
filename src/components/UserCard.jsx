import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { removeUserFromFeed } from "../utils/Redux/feedSlice";

const UserCard = ({ user, feed, cardIndex, totalCards }) => {
    const dispatch = useDispatch();
    const currentUser = user || (Array.isArray(feed) ? feed[0] : feed);
    const [loadingAction, setLoadingAction] = useState(null);
    const [error, setError] = useState(null);

    const _id = currentUser?._id;

    useEffect(() => {
        setError(null);
        setLoadingAction(null);
    }, [_id]);

    if (!currentUser) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center mb-4 shadow-inner">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-base-content/40"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                        />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-base-content mb-1">No connections to show</h2>
                <p className="text-sm text-base-content/60 max-w-sm">
                    You have reviewed all available profiles. Check back later for new connections!
                </p>
            </div>
        );
    }

    const { name, firstName, lastName, photoUrl, age, gender, about, email } = currentUser;
    const displayName = name || [firstName, lastName].filter(Boolean).join(" ") || "Developer";

    const handleSendRequest = async (status, userId) => {
        if (loadingAction) return;
        setLoadingAction(status);
        setError(null);
        try {
            await axios.post(
                `${BASE_URL}/connection/send/${status}/${_id}`,
                {},
                { withCredentials: true }
            );
            dispatch(removeUserFromFeed(userId));
        } catch (err) {
            const message = err?.response?.data?.message || err?.response?.data || err?.message || "Failed to process request";
            setError(message);
        } finally {
            setLoadingAction(null);
        }
    };

    return (
        <div className="w-full max-w-3xl px-2 flex items-center">
            <div className="card rounded-3xl h-112 w-full shadow-2xl bg-base-100 border border-base-300/80 overflow-hidden" id={_id}>
                <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full">
                    {/* Left Side: Photo with Gradient and Tag */}
                    <div className="h-full w-full bg-base-200 overflow-hidden relative group">
                        <img
                            src={photoUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                            alt={displayName}
                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                        {/* Top floating pill */}
                        <div className="absolute top-4 left-4">
                            <span className="badge badge-sm bg-base-100/80 backdrop-blur-md font-semibold text-xs border-none shadow-md py-3 px-3 text-base-content">
                                🔥 DevTinder Profile
                            </span>
                        </div>

                        {/* Bottom photo info overlay for smaller screens */}
                        <div className="absolute bottom-4 left-4 right-4 text-white md:hidden">
                            <h3 className="text-xl font-bold drop-shadow-md">{displayName}</h3>
                            <p className="text-xs text-white/80">{age ? `${age} yrs` : ""} {gender ? `• ${gender}` : ""}</p>
                        </div>
                    </div>

                    {/* Right Side: Details & Actions */}
                    <div className="p-6 md:p-8 flex flex-col justify-between h-full bg-base-100 relative">
                        <div>
                            {/* Category Subtitle */}
                            <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary">
                                    Suggested Match
                                </span>
                                {totalCards > 1 && cardIndex !== undefined && (
                                    <span className="badge badge-sm badge-neutral font-semibold text-xs py-2.5 px-2.5 shadow-xs">
                                        {cardIndex + 1} of {totalCards}
                                    </span>
                                )}
                            </div>

                            {/* Name */}
                            <div className="flex items-center justify-between gap-2 mb-2">
                                <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-base-content truncate">
                                    {displayName}
                                </h2>
                            </div>

                            {/* Badges */}
                            <div className="flex items-center gap-2 mb-4 flex-wrap">
                                {age && (
                                    <span className="badge badge-md bg-base-200 border-base-300 font-semibold text-xs py-3 px-3">
                                        🎂 {age} yrs
                                    </span>
                                )}
                                {gender && (
                                    <span className="badge badge-md badge-outline badge-primary font-semibold text-xs py-3 px-3 capitalize">
                                        {gender.toLowerCase() === "male"
                                            ? "♂ Male"
                                            : gender.toLowerCase() === "female"
                                                ? "♀ Female"
                                                : `⚧ ${gender}`}
                                    </span>
                                )}
                                {email && (
                                    <span className="badge badge-md bg-base-200 border-base-300 text-xs py-3 px-3 truncate max-w-[200px] opacity-80" title={email}>
                                        ✉️ {email}
                                    </span>
                                )}
                            </div>

                            {/* About Bio Box */}
                            <div className="mt-2">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-base-content/50 mb-1.5 flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    About
                                </p>
                                <div className="bg-base-200/60 p-3.5 rounded-2xl border border-base-300/60 leading-relaxed text-sm text-base-content/80 max-h-28 overflow-y-auto shadow-inner">
                                    {about ? (
                                        <p className="whitespace-pre-line">{about}</p>
                                    ) : (
                                        <p className="italic text-base-content/40 text-xs">
                                            No bio provided by this user.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {error && (
                                <p className="text-red-500 text-xs text-center font-medium mt-2">
                                    {error}
                                </p>
                            )}
                        </div>

                        {/* Actions: Ignore & Interested */}
                        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-base-200/80">
                            <button
                                className={`btn text-white bg-red-400 border border-red-400 hover:bg-red-500 shadow-md font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${loadingAction ? "opacity-60 cursor-not-allowed" : ""
                                    }`}
                                disabled={Boolean(loadingAction)}
                                onClick={() => handleSendRequest("ignored", _id)}
                            >
                                {loadingAction === "ignored" ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                                Ignored
                            </button>

                            <button
                                className={`btn text-white bg-blue-500 border border-blue-500 hover:bg-blue-600 shadow-md font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${loadingAction ? "opacity-60 cursor-not-allowed" : ""
                                    }`}
                                disabled={Boolean(loadingAction)}
                                onClick={() => handleSendRequest("intrested", _id)}
                            >
                                {loadingAction === "intrested" ? (
                                    <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                                Interested
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCard;
