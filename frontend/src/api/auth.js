
dotenv.config()

const API_URL = import.meta.env.API_URL || "http://localhost:8080"

const signup = (username, email, password) =>
  fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password })
  }).then(res => res.json());

const login = (email, password) =>
  fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  }).then(res => res.json());

export default {
  signup,
  login
}
