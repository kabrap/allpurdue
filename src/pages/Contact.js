import React, {useState} from 'react'
import './Contact.css'
import './LoginSignup.css'
import axios from 'axios';

function Contact() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [requestType, setRequestType] = useState('issue')
    const [name, setName] = useState('')

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleMessageChange = (e) => {
      setMessage(e.target.value);
    }

    const handleTypeChange = (e) => {
      setRequestType(e.target.value);
    }

    const handleNameChange = (e) => {
      setName(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // submit request
    }

    return (
        <div className="container">
            <h2 className="title">Contact Us!</h2>
            <form id='forgot-form' className="form" onSubmit={handleSubmit}>
                <label className='field-container'>
                  <span>Email</span>
                  <input type="email" value={email} onChange={handleEmailChange} placeholder="Enter your email" required />
                </label>

                <label id='request-options' className='field-container'>
                  <span>Request Type</span>
                  <select value={requestType} onChange={handleTypeChange} required>
                    <option value="add place">Add Place</option>
                    <option value="issue">Report Issue</option>
                  </select>
                </label>

                {/* Display issue form */}
                {requestType === 'issue' && 
                <>
                  <label className='field-container'>
                    <span>Message</span>
                    <input type="message" value={message} onChange={handleMessageChange} placeholder="I can't view a page..." />
                  </label>
                </>
                }

                {/* Display add place form */}
                {requestType === 'add place' && 
                <>
                  <label className='field-container'>
                    <span>Name of Place</span>
                    <input type="name" value={name} onChange={handleNameChange} placeholder="Name of place to add..." />
                  </label>
                  <label className='field-container'>
                    <span>Message</span>
                    <input type="message" value={message} onChange={handleMessageChange} placeholder="I would like to add this place..." />
                  </label>
                </>
                }

                <button type="submit" className="submit-button">
                    Submit
                </button>
            </form>
        </div>
    )
}

export default Contact