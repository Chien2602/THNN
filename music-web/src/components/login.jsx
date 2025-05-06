import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Sử dụng react-router-dom
import { Eye, EyeOff, User, Lock } from "lucide-react";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please fill in all fields!");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post("http://localhost:3001/login", {
        username,
        password,
      });
      const token = response.data.accessToken;
      localStorage.setItem("token", token);
      localStorage.setItem("refresh", response.data.refreshToken);

      setError("");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid username or password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#9ACBD0] to-[#48A6A7]">
      <form
        className="w-[400px] bg-white p-8 shadow-2xl rounded-3xl"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          Login
        </h1>

        {error && (
          <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
        )}

        <div className="flex items-center p-3.5 mb-6 bg-gray-100 rounded-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-[#48A6A7] focus-within:bg-white">
          <User size={24} className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Username"
            className="w-full bg-transparent outline-none text-gray-700"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="flex items-center p-3.5 mb-6 bg-gray-100 rounded-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-[#48A6A7] focus-within:bg-white">
          <Lock size={24} className="text-gray-500 mr-2" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full bg-transparent outline-none text-gray-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {showPassword ? (
            <Eye
              size={24}
              className="text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <EyeOff
              size={24}
              className="text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl shadow-md hover:opacity-90 transition duration-300"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
