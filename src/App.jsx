import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ThemeButton from './components/ThemeButton';

const ROW_SIZE = 7;

const App = () => {
  const [seats, setSeats] = useState([]);
  const [numSeats, setNumSeats] = useState(0);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [error, setError] = useState('');

  // Fetch seats from the server
  const fetchSeats = async () => {
    try {
      const response = await axios.get('https://ticket-book-backend-production.up.railway.app/seats');
      setSeats(response.data);
    } catch (error) {
      console.error('Error fetching seats:', error);
    }
  };

  useEffect(() => {
    fetchSeats();
  }, []);

  // Clear booked seats when numSeats changes
  useEffect(() => {
    setBookedSeats([]);
    setError('');
  }, [numSeats]);

  // Function to book seats
  const bookSeats = async () => {
    const availableSeats = seats.filter(seat => seat.status === 'available');

    // Check if we have enough available seats
    if (availableSeats.length < numSeats) {
      setError('Not enough seats available!');
      return;
    }

    // Find the first row with enough seats
    let seatsToBook = [];
    for (let i = 0; i < seats.length; i += ROW_SIZE) {
      const rowSeats = seats.slice(i, i + ROW_SIZE).filter(seat => seat.status === 'available');
      if (rowSeats.length >= numSeats) {
        seatsToBook = rowSeats.slice(0, numSeats);
        break;
      }
    }

    // If no single row has enough seats, book nearby available seats
    if (seatsToBook.length === 0) {
      seatsToBook = availableSeats.slice(0, numSeats);
    }

    try {
      await axios.post('https://ticket-book-backend-production.up.railway.app/seats/book', {
        seatNumbers: seatsToBook.map(seat => seat.seatNumber),
      });

      // Update the status of the seats
      const updatedSeats = seats.map(seat => {
        if (seatsToBook.find(bookedSeat => bookedSeat.seatNumber === seat.seatNumber)) {
          return { ...seat, status: 'booked' };
        }
        return seat;
      });

      setSeats(updatedSeats);
      setBookedSeats(seatsToBook.map(seat => seat.seatNumber));
      setError(''); // Clear any previous error
    } catch (error) {
      console.error('Error booking seats:', error);
      setError('Failed to book seats!');
    }
  };

  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900 bg-gray-100">
      <div className="w-full flex justify-between items-center p-4 bg-gray-200 dark:bg-gray-800">
        <ThemeButton />
      </div>
      <div className="flex flex-col items-center mt-5 mb-5">
        <h1 className="text-4xl font-bold mb-5 text-gray-900 dark:text-gray-100">Train Seat Reservation</h1>

        <div className="flex justify-between w-full max-w-4xl">
          {/* Left 42 seats */}
          <div className="grid grid-cols-7 gap-2">
            {seats.slice(0, 42).map((seat) => (
              <button
                key={seat.seatNumber}
                className={`p-4 w-12 h-12 ${seat.status === 'booked' ? 'bg-red-600' : 'bg-green-500'} rounded text-white`}
                disabled={seat.status === 'booked'}
              >
                {seat.seatNumber}
              </button>
            ))}
          </div>

          {/* Right 35 + 3 seats */}
          <div className="grid grid-cols-7 gap-2">
            {seats.slice(42).map((seat) => (
              <button
                key={seat.seatNumber}
                className={`p-4 w-12 h-12 ${seat.status === 'booked' ? 'bg-red-600' : 'bg-green-500'} rounded text-white`}
                disabled={seat.status === 'booked'}
              >
                {seat.seatNumber}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3 mt-5 mb-5">
          <input
            type="number"
            value={numSeats}
            onChange={(e) => setNumSeats(parseInt(e.target.value))}
            className="border p-2 rounded dark:bg-gray-700 dark:text-white"
            placeholder="Enter number of seats"
          />
          <button 
            onClick={bookSeats}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800"
          >
            Book Seats
          </button>
        </div>

        {error && (
          <div className="text-red-500 text-center mb-5">
            {error}
          </div>
        )}

        {bookedSeats.length > 0 && (
          <div className="text-center mt-5">
            <h3 className="text-xl font-semibold dark:text-gray-100">Booked Seats:</h3>
            <p className="bg-gray-200 dark:bg-gray-700 p-4 rounded mt-2 text-gray-900 dark:text-gray-100">
              {bookedSeats.join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;





















