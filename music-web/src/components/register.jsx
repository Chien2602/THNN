"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router";
import { useRouter } from "next/navigation"
import { Eye, EyeOff, User, Lock, Mail, Loader2, CheckCircle } from "lucide-react"
import axios from "axios"

export default function Register() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
    if (name === "password") {
      calculatePasswordStrength(value)
    }
  }

  const calculatePasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    setPasswordStrength(strength)
  }

  const getStrengthColor = () => {
    if (passwordStrength === 0) return "bg-gray-200"
    if (passwordStrength === 1) return "bg-red-500"
    if (passwordStrength === 2) return "bg-yellow-500"
    if (passwordStrength === 3) return "bg-blue-500"
    return "bg-green-500"
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { email, username, password, confirmPassword } = userData

    if (!email || !username || !password || !confirmPassword) {
      setError("Please fill in all fields!")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!")
      return
    }

    try {
      setLoading(true)
      const response = await axios.post("http://localhost:3001/register", {
        email,
        username,
        password,
      })

      console.log("Register success:", response.data)
      setError("")
      navigate("/login")
    } catch (err) {
      console.error("Register error:", err)
      setError(err.response?.data?.message || "Registration failed. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#9ACBD0] to-[#48A6A7]">
      <div className="w-full max-w-md px-6 py-8">
        <div className="bg-white p-8 shadow-2xl rounded-3xl transform transition-all duration-300 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.2)]">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Create Account</h1>

          {error && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl animate-fadeIn">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="group relative">
              <div className="flex items-center p-3.5 bg-gray-100 rounded-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-[#48A6A7] focus-within:bg-white">
                <User size={20} className="text-gray-500 mr-2.5" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500"
                  value={userData.username}
                  onChange={handleChange}
                  aria-label="Username"
                />
                {userData.username.length > 0 && <CheckCircle size={18} className="text-green-500" />}
              </div>
            </div>

            <div className="group relative">
              <div className="flex items-center p-3.5 bg-gray-100 rounded-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-[#48A6A7] focus-within:bg-white">
                <Mail size={20} className="text-gray-500 mr-2.5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500"
                  value={userData.email}
                  onChange={handleChange}
                  aria-label="Email"
                />
                {userData.email.includes("@") && userData.email.includes(".") && (
                  <CheckCircle size={18} className="text-green-500" />
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="group relative">
                <div className="flex items-center p-3.5 bg-gray-100 rounded-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-[#48A6A7] focus-within:bg-white">
                  <Lock size={20} className="text-gray-500 mr-2.5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500"
                    value={userData.password}
                    onChange={handleChange}
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
              </div>

              {userData.password && (
                <div className="space-y-1">
                  <div className="flex gap-1.5 h-1.5">
                    <div
                      className={`flex-1 rounded-full ${passwordStrength >= 1 ? getStrengthColor() : "bg-gray-200"}`}
                    ></div>
                    <div
                      className={`flex-1 rounded-full ${passwordStrength >= 2 ? getStrengthColor() : "bg-gray-200"}`}
                    ></div>
                    <div
                      className={`flex-1 rounded-full ${passwordStrength >= 3 ? getStrengthColor() : "bg-gray-200"}`}
                    ></div>
                    <div
                      className={`flex-1 rounded-full ${passwordStrength >= 4 ? getStrengthColor() : "bg-gray-200"}`}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    {passwordStrength === 0 && "Enter a password"}
                    {passwordStrength === 1 && "Weak password"}
                    {passwordStrength === 2 && "Fair password"}
                    {passwordStrength === 3 && "Good password"}
                    {passwordStrength === 4 && "Strong password"}
                  </p>
                </div>
              )}
            </div>

            <div className="group relative">
              <div className="flex items-center p-3.5 bg-gray-100 rounded-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-[#48A6A7] focus-within:bg-white">
                <Lock size={20} className="text-gray-500 mr-2.5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500"
                  value={userData.confirmPassword}
                  onChange={handleChange}
                  aria-label="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              {userData.confirmPassword && userData.password === userData.confirmPassword && (
                <p className="text-xs text-green-500 mt-1 flex items-center">
                  <CheckCircle size={14} className="mr-1" /> Passwords match
                </p>
              )}
              {userData.confirmPassword && userData.password !== userData.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl shadow-md hover:opacity-90 transition duration-300 transform hover:translate-y-[-2px] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 size={20} className="animate-spin mr-2" />
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            <p className="text-center text-gray-600 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 font-semibold hover:underline transition-colors">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
