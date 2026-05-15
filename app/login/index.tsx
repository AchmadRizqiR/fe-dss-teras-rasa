import { useState } from "react";
import { useNavigate } from "react-router";
import AuthService from "../services/AuthService";

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    // Panggil Controller/Service kita
    const isSuccess = await AuthService.login(username, password);

    if (isSuccess) {
      navigate("/dashboard");
    } else {
      alert("Username atau password salah bro!");
    }
  };

  return (
    <main className="flex items-center justify-center w-screen h-screen bg-gray-100 p-8">
      {/* Container Utama (Shadow & Rounded) */}
      <div className="flex flex-row w-full max-w-[60vw] h-[80vh] bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* KIRI - Bagian Teks (Lebar 60%) */}
        <div className="flex flex-col justify-center w-3/5 p-16 bg-white">
          <div className="mb-6">
            {/* Angka 50 dengan garis bawah biru */}
            <div className="inline-block relative">
              <span className="text-5xl font-extrabold text-black">50</span>
              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-blue-600"></div>
            </div>
          </div>

          <h1 className="text-6xl font-extrabold leading-tight tracking-tight">
            <span className="text-blue-600 block">Login Design</span>
            <span className="text-black block">Examples</span>
          </h1>

          <p className="mt-6 text-2xl font-medium text-black">
            that Mix <span className="text-blue-600">Creativity</span> with{" "}
            <span className="text-blue-600">Convenience</span>
          </p>
        </div>

        {/* KANAN - Bagian Form Login / Glassmorphism (Lebar 40%) */}
        {/* Note: background-image ini pakai placeholder, nanti ganti sama gambar asli kamu bro */}
        <div
          className="relative flex flex-col items-center justify-center w-2/5 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1000&auto=format&fit=crop')",
          }}
        >
          {/* Overlay gelap dikit biar form kaca-nya makin nonjol */}
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Card Form Glassmorphism */}
          <div className="relative z-10 w-full max-w-md p-8 bg-white/20 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl">
            {/* Header Form */}
            <div className="text-center text-white mb-8">
              <h2 className="text-3xl font-bold mb-2">Hello!</h2>
              <p className="text-sm font-light text-gray-100">
                We are really happy to see you again!
              </p>
            </div>

            {/* Form Inputs */}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-xl bg-white/60 placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              />

              <div className="relative">
                <input
                  // 2. Tipe inputnya dibikin dinamis berdasarkan state
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-white/60 placeholder-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all pr-12"
                  // Note: Aku tambahin pr-12 di atas biar teks passwordnya
                  // nggak nabrak ikon mata kalau ketikannya panjang
                />

                {/* 3. Tombol Icon Mata */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)} // Balikkan nilai state pas diklik
                  className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    // Ikon Mata Terbuka (kalau showPassword true)
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    // Ikon Mata Tertutup (silang) (kalau showPassword false)
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-.722-3.25" />
                      <path d="M2 8a10.645 10.645 0 0 0 20 0" />
                      <path d="m20 15-1.726-2.05" />
                      <path d="m4 15 1.726-2.05" />
                      <path d="m9 18 .722-3.25" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Tombol Sign In - Pastikan type="submit" */}
              <button
                type="submit"
                className="w-full mt-2 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-200 shadow-lg shadow-blue-500/30"
              >
                Sign in
              </button>

              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="h-px bg-white/30 w-full"></div>
                <p className="text-center text-xs text-white whitespace-nowrap">
                  or sign in with
                </p>
                <div className="h-px bg-white/30 w-full"></div>
              </div>

              {/* Social Buttons */}
              <div className="flex justify-center gap-4 mt-2">
                <button
                  type="button"
                  className="p-3 bg-white/80 rounded-xl shadow hover:bg-white transition-all flex-1 flex justify-center text-blue-600 font-bold"
                >
                  f
                </button>
                <button
                  type="button"
                  className="p-3 bg-white/80 rounded-xl shadow hover:bg-white transition-all flex-1 flex justify-center text-gray-600 font-bold"
                >
                  G
                </button>
                <button
                  type="button"
                  className="p-3 bg-white/80 rounded-xl shadow hover:bg-white transition-all flex-1 flex justify-center text-black font-bold"
                >
                  
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
