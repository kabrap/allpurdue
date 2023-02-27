import React, {useState} from 'react'
import './Contact.css'
import './LoginSignup.css'
import axios from 'axios';

function Contact() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [requestType, setRequestType] = useState('Add Place')
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // submit request
        await axios.post('http://localhost:3000/submit-request', {
          requestType: requestType,
          email: email,
          message: message,
          name: name
        })
        .then(function (res) {
          console.log('successful submission')
        })
        .catch(function (err) {
          console.log(err)
        }) 
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
                    <option value="Add Place">Add Place</option>
                    <option value="Report Issue">Report Issue</option>
                  </select>
                </label>

                {/* Display issue form */}
                {requestType === 'Report Issue' && 
                <>
                  <label className='field-container'>
                    <span>Message</span>
                    <input type="message" value={message} onChange={handleMessageChange} placeholder="I can't view a page..." />
                  </label>
                </>
                }

                {/* Display add place form */}
                {requestType === 'Add Place' && 
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