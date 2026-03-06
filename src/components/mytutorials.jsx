import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { api } from '../api';
import Footer from './Footer/Footer';
import NavBar from './NavBar/NavBar';

function MyTutorials() {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    image: '',
    language: '',
    price: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [isLight, setIsLight] = useState(() => {
    return document.documentElement.getAttribute('data-theme') === 'light';
  });

  // API_BASE is now handled by centralized api

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLight(document.documentElement.getAttribute('data-theme') === 'light');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // Fetch user's tutorials
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.email) {
      setError('You must be logged in to view your tutorials.');
      setLoading(false);
      return;
    }
    api.getMyTutorials(user.email)
      .then(data => {
        setTutorials(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Delete tutorial
  const handleDelete = async (id) => {
    const user = JSON.parse(localStorage.getItem('user'));
    await api.deleteTutorial(id, user.email);
    setTutorials(tutorials.filter(t => t._id !== id));
  };

  // Open update modal
  const handleUpdate = (tutorial) => {
    setEditId(tutorial._id);
    setEditData({
      image: tutorial.image,
      language: tutorial.language,
      price: tutorial.price,
      description: tutorial.description,
    });
  };

  // Handle update form change
  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Submit update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    await api.updateTutorial(editId, { ...editData, email: user.email });
    setTutorials(tutorials.map(t =>
      t._id === editId ? { ...t, ...editData } : t
    ));
    setEditId(null);
  };

  if (loading) {
    return (
      <div className={isLight ? "min-h-screen flex items-center justify-center bg-white" : "min-h-screen flex items-center justify-center bg-[#111827]"}>
        <div className={isLight ? "text-gray-400" : "text-gray-400"}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={isLight ? "min-h-screen flex items-center justify-center bg-white" : "min-h-screen flex items-center justify-center bg-[#111827]"}>
        <div className={isLight ? "text-red-500" : "text-red-400"}>{error}</div>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className={isLight ? "min-h-screen bg-white px-4 sm:px-6 py-6 sm:py-10 mt-16 -mb-12" : "min-h-screen bg-[#111827] px-4 sm:px-6 py-6 sm:py-10 mt-16 -mb-12"}>
        <h1 className={isLight ? "text-2xl sm:text-4xl font-bold mb-2 text-black" : "text-2xl sm:text-4xl font-bold mb-2 text-white"}>My Tutorials</h1>
        <p className={isLight ? "text-base sm:text-lg text-gray-600 mb-8" : "text-base sm:text-lg text-gray-400 mb-8"}>Manage your tutorial listings</p>
        <div className={isLight ? "bg-white rounded-2xl shadow p-4 sm:p-8 border border-black" : "bg-[#111827] rounded-2xl shadow p-4 sm:p-8 border border-gray-800"}>
          <h2 className={isLight ? "text-xl sm:text-2xl font-semibold mb-6 text-black" : "text-xl sm:text-2xl font-semibold mb-6 text-white"}>Your Tutorials</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm sm:text-base">
              <thead>
                <tr className={isLight ? "text-left text-gray-600 border-b border-gray-300" : "text-left text-gray-400 border-b border-gray-700"}>
                  <th className="py-3 pr-4">Image</th>
                  <th className="py-3 pr-4">Language</th>
                  <th className="py-3 pr-4">Price</th>
                  <th className="py-3 pr-4">Description</th>
                  <th className="py-3 pr-4">Reviews</th>
                  <th className="py-3 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tutorials.map(tutorial => (
                  <tr key={tutorial._id} className={isLight ? "border-b border-gray-200" : "border-b border-gray-800"}>
                    <td className="py-4 pr-4">
                      <img
                        src={tutorial.image}
                        alt={tutorial.language}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover"
                      />
                    </td>
                    <td className={isLight ? "py-4 pr-4 font-bold text-black" : "py-4 pr-4 font-bold text-white"}>{tutorial.language}</td>
                    <td className={isLight ? "py-4 pr-4 text-black" : "py-4 pr-4 text-white"}>${tutorial.price}/hr</td>
                    <td className={isLight ? "py-4 pr-4 text-black" : "py-4 pr-4 text-white"}>{tutorial.description}</td>
                    <td className="py-4 pr-4">
                      <span className={isLight ? "bg-blue-200 text-blue-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium" : "bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-xs sm:text-sm font-medium"}>
                        {tutorial.review || 0} reviews
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        <button
                          className={isLight ? "bg-gray-100 text-gray-800 p-2 rounded-lg hover:bg-blue-100" : "bg-white text-gray-800 p-2 rounded-lg hover:bg-blue-100"}
                          onClick={() => handleUpdate(tutorial)}
                          title="Update"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className={isLight ? "bg-gray-100 text-gray-800 p-2 rounded-lg hover:bg-red-100" : "bg-white text-gray-800 p-2 rounded-lg hover:bg-red-100"}
                          onClick={() => handleDelete(tutorial._id)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {tutorials.length === 0 && (
                  <tr>
                    <td colSpan={6} className={isLight ? "text-center text-gray-400 py-8" : "text-center text-gray-400 py-8"}>
                      No tutorials found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Update Modal */}
        {editId && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
            <form
              className={isLight ? "bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-black w-full max-w-md" : "bg-[#111827] p-6 sm:p-8 rounded-xl shadow-lg border border-gray-800 w-full max-w-md"}
              onSubmit={handleUpdateSubmit}
            >
              <h3 className={isLight ? "text-xl font-bold mb-4 text-black" : "text-xl font-bold mb-4 text-white"}>Update Tutorial</h3>
              <div className="mb-3">
                <label className={isLight ? "block text-gray-600 mb-1" : "block text-gray-400 mb-1"}>Name</label>
                <input
                  type="text"
                  value={JSON.parse(localStorage.getItem('user'))?.name || ''}
                  disabled
                  className={isLight ? "w-full px-3 py-2 rounded bg-gray-100 text-gray-800" : "w-full px-3 py-2 rounded bg-gray-800 text-gray-300"}
                />
              </div>
              <div className="mb-3">
                <label className={isLight ? "block text-gray-600 mb-1" : "block text-gray-400 mb-1"}>Email</label>
                <input
                  type="email"
                  value={JSON.parse(localStorage.getItem('user'))?.email || ''}
                  disabled
                  className={isLight ? "w-full px-3 py-2 rounded bg-gray-100 text-gray-800" : "w-full px-3 py-2 rounded bg-gray-800 text-gray-300"}
                />
              </div>
              <div className="mb-3">
                <label className={isLight ? "block text-gray-600 mb-1" : "block text-gray-400 mb-1"}>Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={editData.image}
                  onChange={handleChange}
                  className={isLight ? "w-full px-3 py-2 rounded bg-gray-100 text-black" : "w-full px-3 py-2 rounded bg-gray-800 text-white"}
                  required
                />
              </div>
              <div className="mb-3">
                <label className={isLight ? "block text-gray-600 mb-1" : "block text-gray-400 mb-1"}>Language</label>
                <input
                  type="text"
                  name="language"
                  value={editData.language}
                  onChange={handleChange}
                  className={isLight ? "w-full px-3 py-2 rounded bg-gray-100 text-black" : "w-full px-3 py-2 rounded bg-gray-800 text-white"}
                  required
                />
              </div>
              <div className="mb-3">
                <label className={isLight ? "block text-gray-600 mb-1" : "block text-gray-400 mb-1"}>Price</label>
                <input
                  type="number"
                  name="price"
                  value={editData.price}
                  onChange={handleChange}
                  className={isLight ? "w-full px-3 py-2 rounded bg-gray-100 text-black" : "w-full px-3 py-2 rounded bg-gray-800 text-white"}
                  required
                />
              </div>
              <div className="mb-3">
                <label className={isLight ? "block text-gray-600 mb-1" : "block text-gray-400 mb-1"}>Description</label>
                <textarea
                  name="description"
                  value={editData.description}
                  onChange={handleChange}
                  className={isLight ? "w-full px-3 py-2 rounded bg-gray-100 text-black" : "w-full px-3 py-2 rounded bg-gray-800 text-white"}
                  required
                />
              </div>
              <div className="mb-3">
                <label className={isLight ? "block text-gray-600 mb-1" : "block text-gray-400 mb-1"}>Reviews</label>
                <input
                  type="number"
                  value={tutorials.find(t => t._id === editId)?.review || 0}
                  disabled
                  className={isLight ? "w-full px-3 py-2 rounded bg-gray-100 text-gray-800" : "w-full px-3 py-2 rounded bg-gray-800 text-gray-300"}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold"
                >
                  Update
                </button>
                <button
                  type="button"
                  className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded font-semibold"
                  onClick={() => setEditId(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default MyTutorials;