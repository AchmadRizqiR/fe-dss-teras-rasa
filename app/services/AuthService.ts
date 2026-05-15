// app/services/AuthService.ts

class AuthService {
  // static API_URL: string = "https://mppl.rutherweb.my.id/api";

  // Kembaliannya pasti boolean (true/false)
  static isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    if (!token) return false; 
    if (token === "null" || token === "undefined" || token.trim() === "") {
      return false;
    }
    return true; 
  }

  // Kembaliannya string atau null
  static getToken(): string | null {
    return localStorage.getItem("token");
  }

  // Parameter username & password bertipe string, kembaliannya Promise<boolean>
  static async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) throw new Error("Login gagal");

      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      return true;

    } catch (error) {
      console.error("AuthService Error:", error);
      return false;
    }
  }

  static logout(): void {
    localStorage.removeItem("token");
  }
}

export default AuthService;