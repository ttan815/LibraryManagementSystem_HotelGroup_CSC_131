import React, { useState } from 'react';
import './ReservationForm.css';

/**
 * ReservationForm Component
 * Allows users to reserve books for loan or in-person reading
 * Handles reservation type selection and submission
 */
const ReservationForm = ({ bookId, onClose }) => {
  const [reservationType, setReservationType] = useState('loan');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
    if (!token) {
      alert('Please login to make a reservation');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // CORRECTED: Include all required fields based on backend schema
      const reservationData = {
        book_id: parseInt(bookId),
        reservation_type: reservationType,
        // Add any other required fields that the backend expects
        // Based on the "Field required" error, we might need:
        user_id: null, // Backend should set this from token
        reservation_date: new Date().toISOString(),
        expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        status: "pending" // or whatever default status
      };

      console.log('Sending reservation data:', reservationData);

      const res = await fetch("http://localhost:8000/api/reservations/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reservationData),
      });

      const responseData = await res.json();
      console.log('Full response:', responseData);
      console.log('Response status:', res.status);

      if (res.ok) {
        alert(`Book reserved for ${reservationType === 'loan' ? 'loaning' : 'in-person reading'}`);
        onClose();
      } else {
        // Show detailed error information
        if (responseData.detail) {
          if (Array.isArray(responseData.detail)) {
            const errorMessages = responseData.detail.map(err => 
              `${err.loc.join('.')}: ${err.msg}`
            ).join(', ');
            alert(`Validation errors: ${errorMessages}`);
          } else {
            alert(`Reservation failed: ${responseData.detail}`);
          }
        } else {
          alert(`Reservation failed: ${JSON.stringify(responseData)}`);
        }
      }
    } catch (error) {
      console.error('Reservation error:', error);
      alert('Reservation failed. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reservation-form-overlay">
      <div className="reservation-form">
        <h3>Reserve Book</h3>
        
        <form onSubmit={handleSubmit}>
          {/* Reservation type selection */}
          <div className="form-group">
            <label>Reservation Type:</label>
            <select 
              value={reservationType} 
              onChange={(e) => setReservationType(e.target.value)}
              required
              className="form-control"
            >
              <option value="loan">Loan (Take Home)</option>
              <option value="in_person">In-Person Reading</option>
            </select>
          </div>

          {/* Action buttons */}
          <div className="form-actions">
            <button 
              type="button" 
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Reserving...' : 'Reserve Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;