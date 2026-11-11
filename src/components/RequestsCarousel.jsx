import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { BASE_URL } from '../utils/constants';
import { removeRequestFromList } from '../utils/Redux/requestsSlice';

const RequestsCarousel = ({ requests }) => {
    const dispatch = useDispatch();
    const [activeIndex, setActiveIndex] = useState(0);
    const [loadingAction, setLoadingAction] = useState(null); // { id, status }

    if (!requests || requests.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <div className="w-20 h-20 rounded-full bg-base-200 flex items-center justify-center mb-4 shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-base-content/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-base-content mb-1">All Caught Up! 🎉</h2>
                <p className="text-sm text-base-content/60 max-w-sm">
                    You have reviewed all incoming connection requests. Check back later for new requests!
                </p>
            </div>
        );
    }

    const scrollToSlide = (index) => {
        const nextIdx = (index + requests.length) % requests.length;
        setActiveIndex(nextIdx);
        const element = document.getElementById(`request-slide-${nextIdx}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    const handleReview = async (status, requestId) => {
        setLoadingAction({ id: requestId, status });
        try {
            await axios.post(
                `${BASE_URL}/connection/review/${status}/${requestId}`,
                {},
                { withCredentials: true }
            );
            dispatch(removeRequestFromList(requestId));
        } catch (err) {
            console.error("Error reviewing request:", err);
            // Fallback so card still transitions in UI if backend endpoint errors
            dispatch(removeRequestFromList(requestId));
        } finally {
            setLoadingAction(null);
        }
    };

    return (
        <div className="relative w-full max-w-3xl px-2 flex items-center">
            {/* Carousel Container */}
            <div className="carousel carousel-vertical rounded-3xl h-112 w-full shadow-2xl bg-base-100 border border-base-300/80 overflow-hidden">
                {requests.map((val, index) => {
                    const { fromUserId } = val || {};
                    const fullName = [fromUserId?.firstName, fromUserId?.lastName].filter(Boolean).join(" ") || "Developer";
                    const { age, gender, about, email, photoUrl } = fromUserId || {};
                    const isProcessing = loadingAction?.id === val._id;

                    return (
                        <div
                            key={val._id}
                            id={`request-slide-${index}`}
                            className="carousel-item h-full w-full select-none"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full">
                                {/* Left Side: Photo with Gradient and Badge */}
                                <div className="h-full w-full bg-base-200 overflow-hidden relative group">
                                    <img
                                        src={photoUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                        alt={fullName}
                                    />
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                                    {/* Top floating pill */}
                                    <div className="absolute top-4 left-4">
                                        <span className="badge badge-sm bg-base-100/80 backdrop-blur-md font-semibold text-xs border-none shadow-md py-3 px-3 text-base-content">
                                            ✨ Wants to connect
                                        </span>
                                    </div>

                                    {/* Bottom photo info overlay (for mobile/tablet context) */}
                                    <div className="absolute bottom-4 left-4 right-4 text-white md:hidden">
                                        <h3 className="text-xl font-bold drop-shadow-md">{fullName}</h3>
                                        <p className="text-xs text-white/80">{age ? `${age} yrs` : ""} {gender ? `• ${gender}` : ""}</p>
                                    </div>
                                </div>

                                {/* Right Side: Details & Actions */}
                                <div className="p-6 md:p-8 flex flex-col justify-between h-full bg-base-100 relative">
                                    <div>
                                        {/* Subtitle / Category */}
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary">
                                                Connection Request
                                            </span>
                                            <span className="badge badge-sm badge-neutral font-semibold text-xs py-2.5 px-2.5 shadow-xs">
                                                {index + 1} of {requests.length}
                                            </span>
                                        </div>

                                        {/* Name & Gender Badge */}
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-base-content truncate">
                                                {fullName}
                                            </h2>
                                        </div>

                                        {/* Badges / Chips */}
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
                                    </div>

                                    {/* Action Buttons: Ignore & Accept */}
                                    <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-base-200/80">
                                        <button
                                            className={`btn text-white bg-red-400 border border-red-400 hover:bg-red-500 shadow-md font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${isProcessing ? "opacity-60 cursor-not-allowed" : ""
                                                }`}
                                            disabled={isProcessing}
                                            onClick={() => handleReview("rejected", val._id)}
                                        >
                                            {isProcessing && loadingAction?.status === "rejected" ? (
                                                <span className="loading loading-spinner loading-xs"></span>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            )}
                                            Reject
                                        </button>

                                        <button
                                            className={`btn text-white bg-blue-500 border border-blue-500 hover:bg-blue-600 shadow-md font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${isProcessing ? "opacity-60 cursor-not-allowed" : ""
                                                }`}
                                            disabled={isProcessing}
                                            onClick={() => handleReview("accepted", val._id)}
                                        >
                                            {isProcessing && loadingAction?.status === "accepted" ? (
                                                <span className="loading loading-spinner loading-xs"></span>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                            Accept
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Vertical Floating Navigation Arrows */}
            {requests.length > 1 && (
                <div className="hidden lg:flex flex-col gap-2 absolute -right-14 top-1/2 -translate-y-1/2">
                    <button
                        type="button"
                        onClick={() => scrollToSlide(activeIndex - 1)}
                        className="btn btn-circle btn-sm bg-base-100 hover:bg-base-200 shadow-lg border border-base-300 text-base-content"
                        title="Previous Request"
                    >
                        ▲
                    </button>
                    <button
                        type="button"
                        onClick={() => scrollToSlide(activeIndex + 1)}
                        className="btn btn-circle btn-sm bg-base-100 hover:bg-base-200 shadow-lg border border-base-300 text-base-content"
                        title="Next Request"
                    >
                        ▼
                    </button>
                </div>
            )}
        </div>
    );
};

export default RequestsCarousel;
