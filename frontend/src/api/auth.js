// Backend integration will replace this mock

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function loginUser(credentials) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email && credentials.password) {
        const mockUser = {
          id: 1,
          name: "Sanjana Rai",
          email: credentials.email
        };

        localStorage.setItem("token", "mock-token");
        localStorage.setItem("user", JSON.stringify(mockUser));

        resolve({
          success: true,
          token: "mock-token",
          user: mockUser
        });
      } else {
        reject({
          success: false,
          message: "Invalid credentials"
        });
      }
    }, 1000);
  });
}

export async function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  return Promise.resolve({ success: true });
}

export async function getAuthStatus() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        resolve({
          isLoggedIn: true,
          user: JSON.parse(user)
        });
      } else {
        resolve({
          isLoggedIn: false,
          user: null
        });
      }
    }, 200);
  });
}

export async function registerUser(data) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {

      if (!data.email || !data.password) {
        reject({ message: "All fields are required" });
      } else {
        resolve({
          success: true,
          message: "User registered successfully"
        });
      }

    }, 1000); // simulate server delay
  });
}
