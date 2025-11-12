import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import './components/ReservationForm.css';

/**
 * ReservationForm Component
 * Allows users to reserve books for loan or in-person reading
 * Handles reservation type selection and submission
 */
const ReservationForm = ({ bookId, onClose }) => {
  // Access global application state
  const { user, reservations, setReservations } = useContext(AppContext);
  const [reservationType, setReservationType] = useState('loan');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to make a reservation');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create new reservation object
      const newReservation = {
        id: Date.now(), // Temporary ID
        bookId,
        userId: user.id,
        type: reservationType,
        date: new Date().toISOString(),
        status: 'pending'
      };

      // Update global state
      setReservations([...reservations, newReservation]);
      
      // Show success message and close form
      alert(`Book reserved for ${reservationType === 'loan' ? 'loaning' : 'in-person reading'}`);
      onClose();
    } catch (error) {
      alert('Reservation failed. Please try again.');
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
              className="btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn-primary"
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