const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.detail || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Book endpoints
  async getBooks(search = '', category = '', skip = 0, limit = 100) {
    const params = new URLSearchParams({ skip, limit });
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    
    const response = await fetch(`${API_BASE_URL}/books/?${params}`);
    return this.handleResponse(response);
  }

  async getBook(bookId) {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
    return this.handleResponse(response);
  }

  // Loan endpoints
  async createLoan(loanData) {
    const response = await fetch(`${API_BASE_URL}/loans/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(loanData)
    });
    return this.handleResponse(response);
  }

  async returnLoan(loanId, returnData) {
    const response = await fetch(`${API_BASE_URL}/loans/${loanId}/return`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(returnData)
    });
    return this.handleResponse(response);
  }

  async cancelLoan(loanId) {
    const response = await fetch(`${API_BASE_URL}/loans/${loanId}/cancel`, {
      method: 'PUT',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getLoans(skip = 0, limit = 100) {
    const response = await fetch(`${API_BASE_URL}/loans/?skip=${skip}&limit=${limit}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // Reservation endpoints
  async createReservation(reservationData) {
    const response = await fetch(`${API_BASE_URL}/reservations/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(reservationData)
    });
    return this.handleResponse(response);
  }

  async cancelReservation(reservationId) {
    const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}/cancel`, {
      method: 'PUT',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getReservations(skip = 0, limit = 100) {
    const response = await fetch(`${API_BASE_URL}/reservations/?skip=${skip}&limit=${limit}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // User endpoints
  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async updateCurrentUser(userData) {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(userData)
    });
    return this.handleResponse(response);
  }

  async getUserLoans() {
    const response = await fetch(`${API_BASE_URL}/users/me/loans`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getUserReservations() {
    const response = await fetch(`${API_BASE_URL}/users/me/reservations`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getWishlist() {
    const response = await fetch(`${API_BASE_URL}/users/me/wishlist`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async addToWishlist(bookId) {
    const response = await fetch(`${API_BASE_URL}/users/me/wishlist`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ book_id: bookId })
    });
    return this.handleResponse(response);
  }

  async removeFromWishlist(bookId) {
    const response = await fetch(`${API_BASE_URL}/users/me/wishlist/${bookId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // Admin endpoints
  async getDashboardStats() {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getAdminUsers(skip = 0, limit = 100) {
    const response = await fetch(`${API_BASE_URL}/admin/users?skip=${skip}&limit=${limit}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getAdminUser(userId) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async updateAdminUser(userId, userData) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(userData)
    });
    return this.handleResponse(response);
  }

  async deleteAdminUser(userId) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async createBook(bookData) {
    const response = await fetch(`${API_BASE_URL}/admin/books`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(bookData)
    });
    return this.handleResponse(response);
  }

  async updateBook(bookId, bookData) {
    const response = await fetch(`${API_BASE_URL}/admin/books/${bookId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(bookData)
    });
    return this.handleResponse(response);
  }

  async deleteBook(bookId) {
    const response = await fetch(`${API_BASE_URL}/admin/books/${bookId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getOverdueLoans() {
    const response = await fetch(`${API_BASE_URL}/admin/loans/overdue`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // Auth endpoints
  async login(username, password) {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    });
    return this.handleResponse(response);
  }

  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    return this.handleResponse(response);
  }

  // Contact endpoint
  async submitContactForm(contactData) {
    const response = await fetch(`${API_BASE_URL}/contact/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData)
    });
    return this.handleResponse(response);
  }

  // Update token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }
}

export default new ApiService();