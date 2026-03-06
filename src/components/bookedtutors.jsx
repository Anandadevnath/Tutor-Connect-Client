import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import Footer from './Footer/Footer';
import NavBar from './NavBar/NavBar';
import { toast, ToastContainer } from 'react-toastify';
import { api } from '../api';
import 'react-toastify/dist/ReactToastify.css';

function BookedTutors() {
  const [bookings, setBookings] = useState([]);
  const [reviewed, setReviewed] = useState({});
  const [loading, setLoading] = useState(true);
  const [isLight, setIsLight] = useState(() => {
    return document.documentElement.getAttribute('data-theme') === 'light';
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLight(document.documentElement.getAttribute('data-theme') === 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    api.getMyBookings(token)
      .then(data => {
        setBookings(data);
        setReviewed({});
        setLoading(false);
      });
  }, []);

  // Use booking._id for per-booking review state
  const handleReview = async (bookingId, tutorId) => {
    const token = localStorage.getItem('token');
    try {
      await api.reviewTutorial(tutorId, token);
      toast.success('Review added successfully!');
    } catch {
      toast.error('Failed to add review.');
    }
  };

  if (loading) {
    return (
      <div className={isLight ? "min-h-screen flex items-center justify-center bg-white" : "min-h-screen flex items-center justify-center bg-[#111827]"}>
        <div className={isLight ? "text-gray-400" : "text-gray-400"}>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <ToastContainer position="top-center" />
      <div className={isLight ? "min-h-screen bg-white px-4 sm:px-6 py-10 mt-16" : "min-h-screen bg-[#111827] px-4 sm:px-6 py-10 mt-16"}>
        <h1 className={isLight ? "text-3xl sm:text-4xl font-bold mb-2 text-black" : "text-3xl sm:text-4xl font-bold mb-2 text-white"}>My Booked Tutors</h1>
        <p className={isLight ? "text-base sm:text-lg text-gray-600 mb-8" : "text-base sm:text-lg text-gray-400 mb-8"}>Manage your booked tutoring sessions</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className={isLight ? "bg-white rounded-2xl shadow p-6 flex flex-col justify-between border border-black" : "bg-[#1f2937] rounded-2xl shadow p-6 flex flex-col justify-between border border-gray-800"}
            >
              <div className="flex items-center gap-4 mb-4">
                {booking.image ? (
                  <img
                    src={booking.image}
                    alt={booking.name}
                    className={isLight ? "w-14 h-14 rounded-full object-cover border-2 border-gray-300" : "w-14 h-14 rounded-full object-cover border-2 border-gray-700"}
                  />
                ) : (
                  <div className={isLight ? "w-14 h-14 rounded-full bg-gray-200" : "w-14 h-14 rounded-full bg-gray-700"} />
                )}
                <div>
                  <div className={isLight ? "font-semibold text-lg sm:text-xl text-black" : "font-semibold text-lg sm:text-xl text-white"}>
                    {booking.name || booking.tutorEmail?.split('@')[0]}
                  </div>
                  <span className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm mt-1">
                    {booking.language}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-yellow-400 text-sm sm:text-base mb-2">
                <FaStar />
                <span>{booking.review || 5}</span>
              </div>

              <div className={isLight ? "text-blue-600 font-bold text-xl sm:text-2xl mb-4" : "text-blue-400 font-bold text-xl sm:text-2xl mb-4"}>${booking.price}/hr</div>

              <div className="w-full">
                {reviewed[booking._id] ? (
                  <button
                    className={isLight ? "w-full bg-gray-200 text-gray-400 font-semibold py-2 sm:py-3 rounded-lg cursor-not-allowed" : "w-full bg-gray-800 text-gray-400 font-semibold py-2 sm:py-3 rounded-lg cursor-not-allowed"}
                    disabled
                  >
                    Already Reviewed
                  </button>
                ) : (
                  <button
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold py-2 sm:py-3 rounded-lg shadow hover:from-blue-600 hover:to-cyan-500 transition"
                    onClick={() => handleReview(booking._id, booking.tutorId)}
                  >
                    Add Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default BookedTutors;