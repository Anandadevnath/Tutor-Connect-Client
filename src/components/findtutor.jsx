import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from './Footer/Footer';
import NavBar from './NavBar/NavBar';

function FindTutor() {
  const [tutors, setTutors] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [isLight, setIsLight] = useState(() => {
    return document.documentElement.getAttribute('data-theme') === 'light';
  });

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const selectedLanguage = params.get('language');

  useEffect(() => {
        api.getTutorials()
          .then(data => {
            setTutors(data);
            if (selectedLanguage) {
              setFiltered(
                data.filter(
                  t => t.language && t.language.toLowerCase() === selectedLanguage.toLowerCase()
                )
              );
            } else {
              setFiltered(data);
            }
          });
  }, [selectedLanguage]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLight(document.documentElement.getAttribute('data-theme') === 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!search) {
      if (selectedLanguage) {
        setFiltered(
          tutors.filter(
            t => t.language && t.language.toLowerCase() === selectedLanguage.toLowerCase()
          )
        );
      } else {
        setFiltered(tutors);
      }
    } else {
      setFiltered(
        tutors.filter(
          t =>
            (t.name && t.name.toLowerCase().includes(search.toLowerCase())) ||
            (t.language && t.language.toLowerCase().includes(search.toLowerCase())) ||
            (t.description && t.description.toLowerCase().includes(search.toLowerCase()))
        ).filter(
          t =>
            !selectedLanguage ||
            (t.language && t.language.toLowerCase() === selectedLanguage.toLowerCase())
        )
      );
    }
  }, [search, tutors, selectedLanguage]);

  return (
    <>
      <NavBar />
      <div className={isLight ? "min-h-screen bg-white mt-16 -mb-12" : "min-h-screen bg-[#111827] mt-16 -mb-12"}>
        <div className={isLight ? "bg-gradient-to-r from-blue-400 to-cyan-300 py-12 mb-5" : "bg-gradient-to-r from-blue-500 to-cyan-400 py-12 mb-5"}>
          <h1 className="text-4xl font-bold text-center text-white mb-2">Find Tutors</h1>
          <p className="text-lg text-center text-white opacity-90">
            Discover qualified tutors for any language and start learning today
          </p>
        </div>
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Search by language or specialty..."
              className="w-full md:w-1/2 px-4 py-2 border rounded focus:outline-none"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <span className="ml-4 text-gray-500 hidden md:inline">{filtered.length} tutors found</span>
          </div>
          {selectedLanguage && (
            <div className="mb-4 text-center">
              <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                Showing tutors for: {selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}
              </span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map(tutor => (
              <div key={tutor._id} className={isLight ? "bg-white border-black border-1 rounded-xl shadow p-4 flex flex-col" : "bg-[#1e293b] border-white border-1  rounded-xl shadow p-4 flex flex-col"}>
                <div className="relative">
                  <img
                    src={tutor.image}
                    alt={tutor.name}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full capitalize">
                    {tutor.language}
                  </span>
                </div>
                <div className="flex-1">
                  <div className={isLight ? "flex justify-between items-center mb-1" : "flex justify-between items-center mb-1"}>
                    <span className={isLight ? "font-semibold text-gray-900" : "font-semibold text-white"}>{tutor.name}</span>
                    <span className="font-bold text-blue-600 text-lg">${tutor.price}</span>
                  </div>
                  <div className={isLight ? "flex items-center text-gray-500 text-sm mb-2" : "flex items-center text-gray-400 text-sm mb-2"}>
                    <span>{tutor.email}</span>
                  </div>
                  <div className="flex items-center text-yellow-500 text-sm mb-2">
                    <span className="mr-1">★</span>
                    <span>{(tutor.review || 0).toFixed(1)} (reviews)</span>
                  </div>
                  <p className={isLight ? "text-gray-700 text-sm mb-2 line-clamp-2" : "text-gray-300 text-sm mb-2 line-clamp-2"}>{tutor.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tutor.language && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">{tutor.language}</span>
                    )}
                  </div>
                </div>
                <button
                  className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded transition"
                  onClick={() => navigate(`/tutordetails/${tutor._id}`)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className={isLight ? "text-center text-gray-500 mt-10" : "text-center text-gray-400 mt-10"}>No tutors found.</div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default FindTutor;