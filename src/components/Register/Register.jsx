import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import Footer from '../Footer/Footer';
import { AuthContext } from '../../contexts/AuthContext';
import { api } from '../../api';
import toast from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate();
    const { googleSignIn } = useContext(AuthContext) || {};

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        const name = e.target.name.value;
        const email = e.target.email.value;
        const photoURL = e.target.photoURL.value;
        const password = e.target.password.value;

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
        if (!passwordRegex.test(password)) {
            setError('Password must contain at least one uppercase letter, one lowercase letter, and be at least 6 characters long.');
            return;
        }

        try {
            const data = await api.register({ name, email, password, photoURL });
            if (data && !data.error) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                toast.success('Registration successful!');
                navigate('/');
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (error) {
            setError(error?.message || 'Registration error');
        }
    };

    const handleGoogleLogin = async () => {
        if (!googleSignIn) return;
        try {
            const result = await googleSignIn();
            const { email, displayName, photoURL } = result.user;
            const data = await api.googleLogin({ email, name: displayName, photoURL });
            if (data && !data.error) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                toast.success('Registration successful!');
                navigate('/');
            } else {
                setError(data.error || 'Google login failed');
            }
        } catch (err) {
            setError(err?.message || 'Google sign-in failed');
        }
    };

    return (
        <>
            <NavBar />
            <div className={isLight ? "flex flex-col items-center justify-center min-h-screen bg-white text-black pt-2 mt-10 -mb-12" : "flex flex-col items-center justify-center min-h-screen bg-[#111827] text-white pt-2 mt-10 -mb-12"}>
                {/* Logo and Welcome */}
                <div className="flex flex-col items-center mb-8 mt-8">
                    <h1 className={isLight ? "text-3xl md:text-4xl font-bold text-black mb-2" : "text-3xl md:text-4xl font-bold text-white mb-2"}>
                        Join <span className="text-cyan-400">TutorConnect</span>
                    </h1>
                    <p className={isLight ? "text-gray-500 text-center text-base" : "text-gray-400 text-center text-base"}>
                        Create your account and start your learning journey
                    </p>
                </div>

                {/* Register Card */}
                <div className={isLight ? "bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-black" : "bg-[#192132] shadow-xl rounded-2xl p-8 w-full max-w-md"}>
                    <h2 className={isLight ? "text-2xl font-semibold text-center mb-6 text-black" : "text-2xl font-semibold text-center mb-6 text-white"}>Create Account</h2>

                    {/* Google Sign In */}
                    <button
                        onClick={handleGoogleLogin}
                        className={isLight ? "w-full flex items-center justify-center border border-gray-300 rounded-md py-2 mb-4 font-medium bg-white text-black hover:bg-gray-100 transition" : "w-full flex items-center justify-center border border-gray-600 rounded-md py-2 mb-4 font-medium bg-[#111827] text-white hover:bg-[#232e42] transition"}
                    >
                        <svg
                            aria-label="Google logo"
                            width="20"
                            height="20"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            className="mr-2"
                        >
                            <g>
                                <path d="m0 0H512V512H0" fill="#fff"></path>
                                <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path>
                                <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path>
                                <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path>
                                <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path>
                            </g>
                        </svg>
                        Continue with Google
                    </button>

                    <div className="flex items-center my-4">
                        <div className={isLight ? "flex-grow border-t border-gray-300" : "flex-grow border-t border-gray-700"}></div>
                        <span className={isLight ? "mx-2 text-gray-400" : "mx-2 text-gray-500"}>or</span>
                        <div className={isLight ? "flex-grow border-t border-gray-300" : "flex-grow border-t border-gray-700"}></div>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label htmlFor="name" className={isLight ? "block text-sm font-medium text-gray-700 mb-1" : "block text-sm font-medium text-gray-300 mb-1"}>Full Name</label>
                            <div className="relative">
                                <span className={isLight ? "absolute left-3 top-2.5 text-gray-400" : "absolute left-3 top-2.5 text-gray-400"}>
                                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                        <circle cx="12" cy="8" r="4" stroke="#94a3b8" strokeWidth="2" />
                                        <path d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4" stroke="#94a3b8" strokeWidth="2" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Your full name"
                                    className={isLight ? "w-full pl-10 pr-4 py-2 border border-gray-300 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" : "w-full pl-10 pr-4 py-2 border border-gray-600 bg-[#111827] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className={isLight ? "block text-sm font-medium text-gray-700 mb-1" : "block text-sm font-medium text-gray-300 mb-1"}>Email</label>
                            <div className="relative">
                                <span className={isLight ? "absolute left-3 top-2.5 text-gray-400" : "absolute left-3 top-2.5 text-gray-400"}>
                                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                        <rect x="3" y="5" width="18" height="14" rx="2" stroke="#94a3b8" strokeWidth="2" />
                                        <path d="M3 7l9 6 9-6" stroke="#94a3b8" strokeWidth="2" />
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="your@email.com"
                                    className={isLight ? "w-full pl-10 pr-4 py-2 border border-gray-300 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" : "w-full pl-10 pr-4 py-2 border border-gray-600 bg-[#111827] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className={isLight ? "block text-sm font-medium text-gray-700 mb-1" : "block text-sm font-medium text-gray-300 mb-1"}>Password</label>
                            <div className="relative">
                                <span className={isLight ? "absolute left-3 top-2.5 text-gray-400" : "absolute left-3 top-2.5 text-gray-400"}>
                                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                        <rect x="5" y="8" width="14" height="10" rx="2" stroke="#94a3b8" strokeWidth="2" />
                                        <path d="M12 12v2" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                                        <circle cx="12" cy="11" r="1" fill="#94a3b8" />
                                    </svg>
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    placeholder="Create a strong password"
                                    className={isLight ? "w-full pl-10 pr-10 py-2 border border-gray-300 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" : "w-full pl-10 pr-10 py-2 border border-gray-600 bg-[#111827] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                                    tabIndex={-1}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        // Eye open
                                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="#94a3b8" strokeWidth="2" />
                                            <circle cx="12" cy="12" r="3" stroke="#94a3b8" strokeWidth="2" />
                                        </svg>
                                    ) : (
                                        // Eye closed
                                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                            <path d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7a21.77 21.77 0 015.06-6.06M1 1l22 22" stroke="#94a3b8" strokeWidth="2" />
                                            <path d="M9.53 9.53A3 3 0 0112 9c1.66 0 3 1.34 3 3 0 .47-.11.91-.29 1.29" stroke="#94a3b8" strokeWidth="2" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="photoURL" className={isLight ? "block text-sm font-medium text-gray-700 mb-1" : "block text-sm font-medium text-gray-300 mb-1"}>Photo URL (Optional)</label>
                            <div className="relative">
                                <span className={isLight ? "absolute left-3 top-2.5 text-gray-400" : "absolute left-3 top-2.5 text-gray-400"}>
                                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                                        <rect x="3" y="5" width="18" height="14" rx="2" stroke="#94a3b8" strokeWidth="2" />
                                        <path d="M3 7l9 6 9-6" stroke="#94a3b8" strokeWidth="2" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    id="photoURL"
                                    name="photoURL"
                                    placeholder="https://example.com/your-photo.jpg"
                                    className={isLight ? "w-full pl-10 pr-4 py-2 border border-gray-300 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" : "w-full pl-10 pr-4 py-2 border border-gray-600 bg-[#111827] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"}
                                />
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            type="submit"
                            className={isLight ? "w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-2 rounded-md font-semibold hover:from-blue-600 hover:to-cyan-500 transition" : "w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-2 rounded-md font-semibold hover:from-blue-600 hover:to-cyan-500 transition"}
                        >
                            Create Account
                        </button>
                    </form>
                    <p className={isLight ? "text-center text-gray-400 mt-4 text-xs" : "text-center text-gray-400 mt-4 text-xs"}>
                        By creating an account, you agree to our{' '}
                        <a href="#" className="text-blue-400 hover:underline">Terms of Service</a> and{' '}
                        <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>
                    </p>
                    <p className={isLight ? "text-center text-gray-400 mt-4" : "text-center text-gray-400 mt-4"}>
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-400 hover:underline font-medium">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Register;