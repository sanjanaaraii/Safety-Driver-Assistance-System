// Backend integration will replace this mock

export async function getAuthStatus() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        isLoggedIn: false, 
        user: null
      });
    }, 300);
  });
}
