import React, {useState} from 'react'
import './LoginSignup.css'
import axios from 'axios';

function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [sent, setSent] = useState(false)

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:3000/forgotPassword', {
            username: email,
        })
        .then(function (res) {
            setSent(true);
            console.log("password reset sent")
        })
        .catch(function (err) {
            console.log("password reset failed")
        })
    }

    return (
        <div className="container">
        <h2 className="title">Reset Password</h2>
        <form id='forgot-form' className="form" onSubmit={handleSubmit}>
            <label className='field-container'>
            <span>Email</span>
            <input type="email" value={email} onChange={handleEmailChange} placeholder="Enter your email" required />
            </label>
            {sent && <p id='reset-msg'>Password reset link sent to ${email}</p>}
            <button type="submit" className="submit-button">
                Send reset link
            </button>
        </form>
        </div>
    )
}

export default ForgotPassword