import React, { useEffect, useState } from 'react';
import { FaAccessibleIcon, FaCalendarAlt } from 'react-icons/fa';
import { FiUpload } from 'react-icons/fi';
import { BsCamera } from 'react-icons/bs';
const initialFormData = {
   growingSite: '',
   shape: '',
   plantingDate: '',
   strength: '',
   fallingDate: '',
   quality: '',
   type: '',
   size: '',
   durability: '',
   dimension: '',
   note: '',
   durability: '',
   processability: ''
};
export default function Form({ userid, user_compID }) {
   const [typeOptions, setTypeOptions] = useState([]);
   const [shapeOptions, setShapeOptions] = useState([]);
   const [qualityOptions, setQualityOptions] = useState([]);
   const [FormData, setFormData] = useState(initialFormData);
   const [message, setMessage] = useState('');

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...FormData, [name]: value });
   };
   useEffect(() => {
      fetch('http://localhost:8081/typeOptions')
         .then((response) => response.json())
         .then((data) => setTypeOptions(data))
         .catch((error) => console.error(error));


      fetch('http://localhost:8081/shapeOptions')
         .then((response) => response.json())
         .then((data) => setShapeOptions(data))
         .catch((error) => console.error(error));


      fetch('http://localhost:8081/qualityOptions')
         .then((response) => response.json())
         .then((data) => setQualityOptions(data))
         .catch((error) => console.error(error));
   }, []);

   const handleSubmit = async (e) => {
      e.preventDefault();
      const allInputData = { growingSite: FormData.growingSite, shape: FormData.shape, plantingDate: FormData.plantingDate, strength: FormData.strength, fallingDate: FormData.fallingDate, quality: FormData.quality, type: FormData.type, size: FormData.size, durability: FormData.durability, dimension: FormData.dimension, note: FormData.note, durability: FormData.durability, processability: FormData.processability };
      console.log("compid before submitting :", user_compID);
      console.log("userid before submitting :", userid);
      
      let res = await fetch("http://localhost:8081/logRegistration", {
         method: "POST",
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userid}, ${user_compID}`
         },
         body: JSON.stringify(allInputData)
      });

      let resjson = await res.json();
      if (res.status === 200) {
        
         setMessage(resjson.success || 'Successfully Inserted');

         // Clear form fields after successful submission
         setFormData(initialFormData);
         console.log("after instering to database")

         setTimeout(() => {
            setMessage('');
         }, 300);
      } else {
         setMessage(`Error: ${resjson.error || "Some error occurred."}`);
         console.error(resjson);
      }
      console.log(allInputData)
   };

   return (

      <form className="container" onSubmit={handleSubmit}>
         <h1>Log Information Registration</h1>
         <div className='form-cont'>
            <div className='sub-entry'>
               <input type="text" name="growingSite" value={FormData.growingSite} onChange={handleInputChange} placeholder='Growing Site'>
               </input>
            </div>

            {/* <div className='sub-entry'>
               <select name="shape" value={FormData.shape} onChange={handleInputChange}>
                  <option value="">Select Shape</option>
                  {shapeOptions.map((option, index) => (
                     <option key={index} value={option.m_id}>
                        {option.m_name}
                     </option>
                  ))}
               </select>
            </div> */}
            <div className='sub-entry'>
               <select name="shape" value={FormData.shape} onChange={handleInputChange}>
                  <option value="">Select Shape</option>
                  <option>shape1</option>
                  <option>shape2</option>
               </select>
            </div>
            <div className='sub-entry'>
               <label>Growing Day</label>
               <input type="date" name="plantingDate" required="required" value={FormData.plantingDate} onChange={handleInputChange} placeholder='Planting Date' ></input>

            </div>
            <div className='sub-entry'>
               <input type="text" name="strength" required="required" value={FormData.strength} onChange={handleInputChange} placeholder='Strength'></input>
            </div>
            <div className='sub-entry'>
               <label>falling Date</label>
               <input type="date" name="fallingDate" required="required" value={FormData.fallingDate} onChange={handleInputChange} placeholder='Falling Date'></input>

            </div>

            <div className='sub-entry'>
               <input type="text" required="required" name="durability" value={FormData.durability} onChange={handleInputChange} placeholder='Durability'></input>
            </div>
            <div className='sub-entry'>
               <select name="quality" required="required" value={FormData.quality} onChange={handleInputChange}>
                  <option value="">Select Quality</option>

                  <option > quality 1  </option>
                  <option > quality 12 </option>

               </select>
            </div>
            <div className='sub-entry'>
               <select name="type" value={FormData.type} onChange={handleInputChange}>
                  <option>Select Type</option>
                  <option>type1 </option>
                  <option>type2 </option>
               </select>
            </div>
            <div className='sub-entry'>
               <input type="text" name="size" required="required" value={FormData.size} onChange={handleInputChange} placeholder='size'></input>
            </div>
            <div className='sub-entry'>
               <input type="text" name="dimension" required="required" value={FormData.dimension} onChange={handleInputChange} placeholder='Dimension'></input>
            </div>
            <div className='sub-entry'>
               <input type="text" name="note" required="required" value={FormData.note} onChange={handleInputChange} placeholder='Note'></input>
               <i type='file' className='icon-note-1'><FiUpload /></i><i className='icon-note-2'><BsCamera /></i>
            </div>
            <div className='sub-entry'>
               <input type="text" name="durability" required="required" value={FormData.durability} onChange={handleInputChange} placeholder='Durability'></input>
            </div>
            <div className='sub-entry'>
               <input type="text" name="processability" required="required" value={FormData.processability} onChange={handleInputChange} placeholder='Processability'></input>
            </div>
            <div className='sub-entry'>
               <button className='btn'>Save</button>
               <button className='btn'>Cancel</button>
            </div>
         </div>
      </form>



   );
}
