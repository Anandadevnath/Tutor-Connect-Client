import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from './Footer/Footer';
import NavBar from './NavBar/NavBar';
import { FaStar, FaUsers, FaClock, FaArrowLeft, FaMapMarkerAlt } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { api } from '../api';

const FindTutorDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tutor, setTutor] = useState(null);
    const [isLight, setIsLight] = useState(() => {
        return document.documentElement.getAttribute('data-theme') === 'light';
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        api.getTutorialById(id, token)
            .then(data => setTutor(data))
            .catch(() => setTutor(null));
    }, [id]);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsLight(document.documentElement.getAttribute('data-theme') === 'light');
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        return () => observer.disconnect();
    }, []);

    const handleBook = async () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            toast.error('Please log in to book a tutor.');
            return;
        }
        const bookingData = {
            tutorId: tutor._id,
            image: tutor.image,
            language: tutor.language,
            price: tutor.price,
            tutorEmail: tutor.email,
            email: user.email,
        };
        try {
            await api.bookTutorial(bookingData, token);
            toast.success('Booking successful!');
        } catch (err) {
            toast.error('You have already booked this tutor or an error occurred.');
        }
    };

    if (!tutor) {
        return (
            <>
                <NavBar />
                <div className={isLight ? "min-h-screen flex items-center justify-center bg-white mt-16 -mb-12" : "min-h-screen flex items-center justify-center bg-[#111827] mt-16 -mb-12"}>
                    <div className={isLight ? "text-gray-500" : "text-gray-400"}><span className="loading loading-spinner loading-xl"></span></div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <NavBar />
            <ToastContainer position="top-center" />
            <div className={isLight ? "min-h-screen bg-white pt-8 pb-16 mt-16 -mb-12" : "min-h-screen bg-[#111827] pt-8 pb-16 mt-16 -mb-12"}>
                <div className="max-w-7xl mx-auto px-4">
                    <button
                        className="flex items-center text-blue-400 hover:underline mb-6"
                        onClick={() => navigate(-1)}
                    >
                        <FaArrowLeft className="mr-2" /> Back to Find Tutors
                    </button>
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left: Tutor Info Card */}
                        <div className={isLight ? "bg-white rounded-2xl shadow p-8 flex-1 mb-6 lg:mb-0 border border-black" : "bg-[#111827] rounded-2xl shadow p-8 flex-1 mb-6 lg:mb-0 border border-gray-800"}>
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                                <img
                                    src={tutor.image}
                                    alt={tutor.name}
                                    className={isLight ? "w-40 h-40 rounded-full object-cover mb-4 md:mb-0 border-4 border-gray-300" : "w-40 h-40 rounded-full object-cover mb-4 md:mb-0 border-4 border-gray-700"}
                                />
                                <div className="flex-1 w-full">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                        <h1 className={isLight ? "text-4xl font-bold mb-2 text-black" : "text-4xl font-bold mb-2 text-white"}>{tutor.name}</h1>
                                        <div className="text-3xl font-bold text-blue-400 mb-2 md:mb-0 md:ml-4">
                                            ${tutor.price}
                                            <span className={isLight ? "text-base font-normal text-gray-600 ml-1 align-top" : "text-base font-normal text-gray-400 ml-1 align-top"}>per hour</span>
                                        </div>
                                    </div>
                                    <div className={isLight ? "flex items-center gap-2 mb-2 text-gray-700" : "flex items-center gap-2 mb-2 text-gray-300"}>
                                        <FaMapMarkerAlt className="mr-1" />
                                        <span>{tutor.country || 'Country'}</span>
                                    </div>
                                    <span className="inline-block bg-green-600 text-white px-3 py-1 rounded-full font-semibold mb-2 capitalize text-sm">
                                        {tutor.language}
                                    </span>
                                    <div className={isLight ? "flex flex-wrap items-center gap-6 text-gray-600 text-base mb-4" : "flex flex-wrap items-center gap-6 text-gray-400 text-base mb-4"}>
                                        <span className="flex items-center gap-1">
                                            <FaStar className="text-yellow-400" />
                                            {tutor.review ? tutor.review.toFixed(1) : '0.0'} <span className={isLight ? "ml-1 text-gray-400" : "ml-1 text-gray-500"}>({tutor.reviewsCount || '92'} reviews)</span>
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FaUsers /> {tutor.students || '95'} students
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FaClock /> {tutor.experience || '4'} years experience
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* About */}
                            <div className="mt-8">
                                <h2 className={isLight ? "text-2xl font-bold mb-2 text-black" : "text-2xl font-bold mb-2 text-white"}>About</h2>
                                <p className={isLight ? "text-gray-700 text-lg" : "text-gray-300 text-lg"}>{tutor.description}</p>
                            </div>
                            {/* Specialties */}
                            {tutor.specialties && tutor.specialties.length > 0 && (
                                <div className="mt-8">
                                    <h2 className={isLight ? "text-2xl font-bold mb-2 text-black" : "text-2xl font-bold mb-2 text-white"}>Specialties</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {tutor.specialties.map((spec, idx) => (
                                            <span key={idx} className={isLight ? "bg-gray-200 text-gray-800 px-4 py-1 rounded-full text-base font-medium" : "bg-gray-800 text-gray-200 px-4 py-1 rounded-full text-base font-medium"}>
                                                {spec}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* Availability */}
                            {tutor.availability && tutor.availability.length > 0 && (
                                <div className="mt-8">
                                    <h2 className={isLight ? "text-2xl font-bold mb-2 text-black" : "text-2xl font-bold mb-2 text-white"}>Availability</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {tutor.availability.map((day, idx) => (
                                            <span key={idx} className={isLight ? "bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-base font-medium" : "bg-blue-900 text-blue-300 px-4 py-1 rounded-full text-base font-medium"}>
                                                {day}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Right: Booking Card */}
                        <div className="w-full lg:w-80 flex-shrink-0">
                            <div className={isLight ? "bg-white rounded-2xl shadow p-8 mb-6 flex flex-col items-center border border-black" : "bg-[#111827] rounded-2xl shadow p-8 mb-6 flex flex-col items-center border border-gray-800"}>
                                <div className="text-3xl font-bold text-blue-400 mb-1">${tutor.price}</div>
                                <div className={isLight ? "text-gray-600 mb-4" : "text-gray-400 mb-4"}>per hour</div>
                                <button
                                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold py-3 rounded-lg mb-3 shadow hover:from-blue-600 hover:to-cyan-500 transition text-lg flex items-center justify-center"
                                    onClick={handleBook}
                                >
                                    <span className="mr-2">📖</span> Book Now
                                </button>
                                <div className={isLight ? "text-gray-400 text-base text-center mb-4" : "text-gray-500 text-base text-center mb-4"}>No payment required now</div>
                                <div className="border-t pt-4 text-base w-full" style={isLight ? { borderColor: '#e5e7eb' } : { borderColor: '#374151' }}>
                                    <div className="flex justify-between mb-2">
                                        <span className={isLight ? "text-gray-600" : "text-gray-400"}>Response time:</span>
                                        <span className={isLight ? "font-semibold text-black" : "font-semibold text-white"}>Within 2 hours</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className={isLight ? "text-gray-600" : "text-gray-400"}>Languages:</span>
                                        <span className={isLight ? "font-semibold text-black" : "font-semibold text-white"}>{tutor.language}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className={isLight ? "text-gray-600" : "text-gray-400"}>Students taught:</span>
                                        <span className={isLight ? "font-semibold text-black" : "font-semibold text-white"}>{tutor.students || '95'}+</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default FindTutorDetails;