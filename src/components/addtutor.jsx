import React, { useState, useEffect } from 'react';
import { api } from '../api';
import NavBar from './NavBar/NavBar';
import Footer from './Footer/Footer';
import toast from 'react-hot-toast';

function AddTutor() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    image: '',
    language: '',
    price: '',
    description: '',
    review: 0,
  });
  const [loading, setLoading] = useState(false);
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

  const token = localStorage.getItem('token');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.addTutorial({
        name: form.name,
        email: form.email,
        image: form.image,
        language: form.language,
        price: Number(form.price),
        description: form.description,
      }, token);
      toast.success('Tutorial added successfully!');
      setForm({
        name: '',
        email: '',
        image: '',
        language: '',
        price: '',
        description: '',
        review: 0,
      });
    } catch (err) {
      toast.error('Failed to add tutorial.');
    }
    setLoading(false);
  };

  return (
    <>
      <NavBar />
      <div className={isLight ? "min-h-screen bg-white py-10 px-2 mt-16 -mb-12" : "min-h-screen bg-[#111827] py-10 px-2 mt-16 -mb-12"}>
        <div className="max-w-2xl mx-auto">
          <h1 className={isLight ? "text-3xl font-bold mb-2 text-black" : "text-3xl font-bold mb-2 text-white"}>Add New Tutorial</h1>
          <p className={isLight ? "mb-8 text-gray-700" : "mb-8 text-gray-500"}>Share your knowledge by creating a new tutorial</p>
          <form
            onSubmit={handleSubmit}
            className={isLight ? "bg-white rounded-xl shadow p-8 border-1 border-black space-y-6" : "bg-[#111827] rounded-xl shadow p-8 border-1 border-white space-y-6"}
          >
            <h2 className={isLight ? "text-xl font-semibold mb-4 text-black" : "text-xl font-semibold mb-4 text-white"}>Tutorial Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={isLight ? "block font-medium mb-1 text-black" : "block font-medium mb-1 text-white"}>User Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className={isLight ? "block font-medium mb-1 text-black" : "block font-medium mb-1 text-white"}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div>
              <label className={isLight ? "block font-medium mb-1 text-black" : "block font-medium mb-1 text-white"}>Tutorial Image URL</label>
              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter image URL (optional)"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={isLight ? "block font-medium mb-1 text-black" : "block font-medium mb-1 text-white"}>Language *</label>
                <input
                  type="text"
                  name="language"
                  value={form.language}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g., English, Spanish, French"
                />
              </div>
              <div>
                <label className={isLight ? "block font-medium mb-1 text-black" : "block font-medium mb-1 text-white"}>Price per Hour ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter hourly rate"
                />
              </div>
            </div>
            <div>
              <label className={isLight ? "block font-medium mb-1 text-black" : "block font-medium mb-1 text-white"}>Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full border rounded px-3 py-2"
                placeholder="Describe your tutorial and teaching style..."
              />
            </div>
            <div>
              <label className={isLight ? "block font-medium mb-1 text-black" : "block font-medium mb-1 text-white"}>Reviews</label>
              <input
                type="number"
                name="review"
                value={form.review}
                readOnly
                className={isLight ? "w-full border rounded px-3 py-2 bg-white" : "w-full border rounded px-3 py-2 bg-[#111827]"}
              />
              <p className={isLight ? "text-xs text-gray-500 mt-1" : "text-xs text-gray-400 mt-1"}>Review count starts at 0 by default</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold py-2 rounded mt-2 hover:from-blue-600 hover:to-cyan-500 transition"
            >
              {loading ? 'Adding...' : 'Add Tutorial'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AddTutor;