import React, {useState} from 'react'
import axios from 'axios'

function EditPlace() {
    const [placeType, setPlaceType] = useState("Food");
    const [nameOfPlace, setNameOfPlace] = useState('')
    const [description, setDescription] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [tags, setTags] = useState('')
    const [images, setImages] = useState('')
    const [address, setAddress] = useState('')
    const [googleUrl, setGoogleUrl] = useState('')
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [website, setWebsite] = useState('')


    const [hours, setHours] = useState([
      {start: '', end: '' },
      {start: '', end: '' },
      {start: '', end: '' },
      {start: '', end: '' },
      {start: '', end: '' },
      {start: '', end: '' },
      {start: '', end: '' }
    ]);
    const [showInputs, setShowInputs] = useState([0,0,0,0,0,0,0])
    const [showSuccessMsg, setShowSuccessMsg] = useState(false)

    const handlePlaceType = (e) => {
      setPlaceType(e);
    }

    const handleNameOfPlace = (e) => {
      setNameOfPlace(e.target.value);
    };

    const handleDescription = (e) => {
      setDescription(e.target.value);
    };

    const handlePhoneNumber = (e) => {
      setPhoneNumber(e.target.value);
    };

    const handleTags = (e) => {
      setTags(e.target.value);
    }

    const handleImages = (e) => {
      setImages(e.target.value);
    }

    const handleAddress = (e) => {
      setAddress(e.target.value);
    }

    const handleGoogleUrl = (e) => {
      setGoogleUrl(e.target.value);
    }

    const handleLatitude = (e) => {
      setLatitude(e.target.value);
    }

    const handleLongitude = (e) => {
      setLongitude(e.target.value);
    }

    const handleWebsite = (e) => {
      setWebsite(e.target.value);
    }

    const handleHoursChange = (index, field, value) => {
      const newHours = [...hours];
      newHours[index][field] = value;
      setHours(newHours);
    }

    const handleShowInputs = (index) => {
      const newInputs = [...showInputs];
      newInputs[index] = newInputs[index]+1;
      if (newInputs[index] === 3)
        newInputs[index] = 0;
      switch (newInputs[index]) {
        case 1:
          handleHoursChange(index, "start", "00:00")
          handleHoursChange(index, "end", "23:59")
          break;
        case 2: 
          handleHoursChange(index, "start", "");
          handleHoursChange(index, "end", "");
          break;
        default: break;
      }
      setShowInputs(newInputs);
    }

    const handleSubmit = async (e) => {
      e.preventDefault();

      const id = window.location.href.substring(window.location.href.indexOf("edit-place/")+11);

      const hoursArr = [
        [hours[0].start, hours[0].end],
        [hours[1].start, hours[1].end],
        [hours[2].start, hours[2].end],
        [hours[3].start, hours[3].end],
        [hours[4].start, hours[4].end],
        [hours[5].start, hours[5].end],
        [hours[6].start, hours[6].end]
      ]

      for (let i = 0; i < hoursArr.length; i++) {
        for (let j = 0; j < hoursArr[i].length; j++) {
          let e = hoursArr[i][j];
          let AM = true;
          let hour = e.substring(0,2);
          if (new RegExp('^([0-9]{2}:[0-9]{2})$').test(e)) {
            if (hour >= 12) {
              AM = false;
            }
            hour = ((parseInt(hour)+11)%12+1);
            e = hour + e.substring(2) + (AM ? "AM" : "PM");
            hoursArr[i][j] = e;
          }
        }
      }

      const AMPMhours = [
        hoursArr[0][0] + "-" + hoursArr[0][1],
        hoursArr[1][0] + "-" + hoursArr[1][1],
        hoursArr[2][0] + "-" + hoursArr[2][1],
        hoursArr[3][0] + "-" + hoursArr[3][1],
        hoursArr[4][0] + "-" + hoursArr[4][1],
        hoursArr[5][0] + "-" + hoursArr[5][1],
        hoursArr[6][0] + "-" + hoursArr[6][1]
      ]
      
      for (let i = 0; i < 7; i++) {
        if (AMPMhours[i] === "-")
        AMPMhours[i] = "No Hours"
        if (AMPMhours[i] === "12:00AM-11:59PM")
        AMPMhours[i] = "Open All Hours"
      }

      const phoneNum = phoneNumber.replace('-', '').replace('-', '');

      const tagsArr = tags.split(',').map(e => e.trim());

      const imagesArr = images.split(',').map(e => e.trim());

      // submit request
      await axios.put(`http://localhost:3000/admin/places/${id}/edit`, 
      {
        id: id,
        name: nameOfPlace,
        description: description,
        hours: AMPMhours,
        phone: phoneNum,
        placeType: placeType,
        tags: tagsArr,
        location: {
          type: "Point",
          coordinates: [longitude, latitude]
        },
        reviews: [],
        images: imagesArr,
        address: address,
        googleMap: googleUrl,
        website: website
      })
      .then(function (res) {
        console.log('successful submission')
        setShowSuccessMsg(true)
        window.location.href = `/places/${id}`
      })
      .catch(function (err) {
        console.log(err)
      }) 
    }

    return (
        <div className="location-container">
            <h2 className="title">Edit a Location</h2>
            <form id='forgot-form' className="form" onSubmit={handleSubmit}>
              <div className="type-bar">
                {placeType === "Food" &&
                  <button id='left-type' className='clicked-button' onClick={() => handlePlaceType("Food")}>Food</button>
                }
                {placeType !== "Food" &&
                  <button id='left-type' className='type-button' onClick={() => handlePlaceType("Food")}>Food</button>
                }
                {placeType === "Cafe" &&
                  <button className='clicked-button' onClick={() => handlePlaceType("Cafe")}>Cafe</button>
                }
                {placeType !== "Cafe" &&
                  <button className='type-button' onClick={() => handlePlaceType("Cafe")}>Cafe</button>
                }
                {placeType === "Study" &&
                  <button className='clicked-button'onClick={() => handlePlaceType("Study")}>Study</button>
                }
                {placeType !== "Study" &&
                  <button className='type-button'onClick={() => handlePlaceType("Study")}>Study</button>
                }
                {placeType === "Living" &&
                  <button id='right-type' className='clicked-button'onClick={() => handlePlaceType("Living")}>Living</button>
                }
                {placeType !== "Living" &&
                  <button id='right-type' className='type-button'onClick={() => handlePlaceType("Living")}>Living</button>
                }
              </div>
              <label className='location-field-container'>
                <span>Name of Place</span>
                <input type="message" value={nameOfPlace} onChange={handleNameOfPlace} placeholder="Name of place to edit..." required />
              </label>
              <label className='location-field-container'>
                <span>Description of Place</span>
                <textarea type="message" value={description} onChange={handleDescription} placeholder="Description of place to edit..." />
              </label>
              <label className='location-field-container'>
                <span>Phone number</span>
                <input type="tel" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" value={phoneNumber} onChange={handlePhoneNumber} placeholder="xxx-xxx-xxxx"></input>
              </label>
              <label className='location-field-container'>
                <span>Tags</span>
                <input type="text" placeholder="Fast Food, Chauncey, Chain" value={tags} pattern="[^,]+(,.*){3,}.+" onChange={handleTags}></input>
              </label>
              <label className='location-field-container'>
                <span>Images</span>
                <input type="url" placeholder="https://tinyurl.com/fiveguysfood, https://tinyurl.com/5guysinsidewl" value={images} onChange={handleImages}></input>
              </label>
              <label className='location-field-container'>
                <span>Address</span>
                <input type="text" placeholder="135 S Chauncey Ave Suite 1-K, West Lafayette, IN 47906" value={address} onChange={handleAddress}></input>
              </label>
              <label className='location-field-container'>
                <span>Google Map Url</span>
                <input type="url" placeholder="https://www.google.com/maps/place/Five+Guys/@40.4233731,-86.9122599,17.05z/data=!4m6!3m5!1s0x8812e2aed99721e9:0x2a65fca44b4f0116!8m2!3d40.4233321!4d-86.9080151!16s%2Fg%2F1tvq4qs0" value={googleUrl} onChange={handleGoogleUrl}></input>
              </label>
              <label className='location-field-container'>
                <span>Latitude</span>
                <input type="number" placeholder="40.42343994609269" value={latitude} onChange={handleLatitude}></input>
              </label>
              <label className='location-field-container'>
                <span>Longitude</span>
                <input type="number" placeholder="-86.90795109977412" value={longitude} onChange={handleLongitude}></input>
              </label>
              <label className='location-field-container'>
                <span>Website</span>
                <input type="url" placeholder="https://restaurants.fiveguys.com/135-S-Chauncey-Avenue" value={website} onChange={handleWebsite}></input>
              </label>
              
              <h1>Hours</h1>
              <div className="days-of-week-container">
                <div className="day-of-week">
                  <button type="button" className="day-label" onClick={() => handleShowInputs(0)}>S</button>
                  {showInputs[0] === 0 &&
                    <div className="hours-inputs">
                      <input type="time" value={hours[0].start} onChange={(e) => handleHoursChange(0, "start", e.target.value)} required/>
                      <input type="time" value={hours[0].end} onChange={(e) => handleHoursChange(0, "end", e.target.value)} required/>
                    </div>
                  }
                  {showInputs[0] === 1 &&
                    <div>Open 24 Hours</div>
                  }
                  {showInputs[0] === 2 &&
                    <div>No Hours</div>
                  }
                </div>
                <div className="day-of-week">
                  <button type="button" className="day-label" onClick={() => handleShowInputs(1)}>M</button>
                  {showInputs[1] === 0 &&
                    <div className="hours-inputs">
                      <input type="time" value={hours[1].start} onChange={(e) => handleHoursChange(1, "start", e.target.value)} required/>
                      <input type="time" value={hours[1].end} onChange={(e) => handleHoursChange(1, "end", e.target.value)} required/>
                    </div>
                  }
                  {showInputs[1] === 1 &&
                    <div>Open 24 Hours</div>
                  }
                  {showInputs[1] === 2 &&
                    <div>No Hours</div>
                  }
                </div>
                <div className="day-of-week">
                  <button type="button" className="day-label" onClick={() => handleShowInputs(2)}>T</button>
                  {showInputs[2] === 0 &&
                    <div className="hours-inputs">
                      <input type="time" value={hours[2].start} onChange={(e) => handleHoursChange(2, "start", e.target.value)} required/>
                      <input type="time" value={hours[2].end} onChange={(e) => handleHoursChange(2, "end", e.target.value)} required/>
                    </div>
                  }
                  {showInputs[2] === 1 &&
                    <div>Open 24 Hours</div>
                  }
                  {showInputs[2] === 2 &&
                    <div>No Hours</div>
                  }
                </div>
                <div className="day-of-week">
                  <button type="button" className="day-label" onClick={() => handleShowInputs(3)}>W</button>
                  {showInputs[3] === 0 &&
                    <div className="hours-inputs">
                      <input type="time" value={hours[3].start} onChange={(e) => handleHoursChange(3, "start", e.target.value)} required/>
                      <input type="time" value={hours[3].end} onChange={(e) => handleHoursChange(3, "end", e.target.value)} required/>
                    </div>
                  }
                  {showInputs[3] === 1 &&
                    <div>Open 24 Hours</div>
                  }
                  {showInputs[3] === 2 &&
                    <div>No Hours</div>
                  }
                </div>
                <div className="day-of-week">
                  <button type="button" className="day-label" onClick={() => handleShowInputs(4)}>T</button>
                  {showInputs[4] === 0 &&
                    <div className="hours-inputs">
                      <input type="time" value={hours[4].start} onChange={(e) => handleHoursChange(4, "start", e.target.value)} required/>
                      <input type="time" value={hours[4].end} onChange={(e) => handleHoursChange(4, "end", e.target.value)} required/>
                    </div>
                  }
                  {showInputs[4] === 1 &&
                    <div>Open 24 Hours</div>
                  }
                  {showInputs[4] === 2 &&
                    <div>No Hours</div>
                  }
                </div>
                <div className="day-of-week">
                  <button type="button" className="day-label" onClick={() => handleShowInputs(5)}>F</button>
                  {showInputs[5] === 0 &&
                    <div className="hours-inputs">
                      <input type="time" value={hours[5].start} onChange={(e) => handleHoursChange(5, "start", e.target.value)} required/>
                      <input type="time" value={hours[5].end} onChange={(e) => handleHoursChange(5, "end", e.target.value)} required/>
                    </div>
                  }
                  {showInputs[5] === 1 &&
                    <div>Open 24 Hours</div>
                  }
                  {showInputs[5] === 2 &&
                    <div>No Hours</div>
                  }
                </div>
                <div className="day-of-week">
                  <button type="button" className="day-label" onClick={() => handleShowInputs(6)}>S</button>
                  {showInputs[6] === 0 &&
                    <div className="hours-inputs">
                      <input type="time" value={hours[6].start} onChange={(e) => handleHoursChange(6, "start", e.target.value)} required/>
                      <input type="time" value={hours[6].end} onChange={(e) => handleHoursChange(6, "end", e.target.value)} required/>
                    </div>
                  }
                  {showInputs[6] === 1 &&
                    <div>Open 24 Hours</div>
                  }
                  {showInputs[6] === 2 &&
                    <div>No Hours</div>
                  }
                </div>
              </div>

                {/* Displaing success message when they submit */}
                {showSuccessMsg && <p className='success-msg'>Location successfully edited!</p>}

                <button type="submit" className="submit-button">
                    Submit
                </button>
            </form>
        </div>
    )
}

export default EditPlace