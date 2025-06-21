import React, { useState } from 'react';
import axios from 'axios';

function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Assuming a signup endpoint, this will likely need adjustment
      const res = await axios.post('/api/auth/signup', form); 
      // Typically, signup might not automatically log in or store a token directly,
      // but this depends on the backend implementation.
      // For now, mimicking the login behavior but alerting 'Signup successful'
      if (res.data.token) { // If a token is returned
        localStorage.setItem('token', res.data.token);
      }
      alert('Signup successful! Please login.'); // Or redirect to login
    } catch (err) {
      // It's better to provide more specific error messages if possible
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" onChange={handleChange} placeholder="Username" />
      <input name="email" onChange={handleChange} placeholder="Email" />
      <input name="password" onChange={handleChange} placeholder="Password" type="password" />
      <button type="submit">Signup</button>
    </form>
  );
}

export default Signup;
