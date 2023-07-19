import React, { useState } from 'react'
import noteContext from '../src/context/notes/noteContext'
import { useContext } from 'react'

const AddNote = () => {
    const context = useContext(noteContext)
    const {addNote} = context

    const [note, setNote] = useState({title:"", description:""})

    const handleClick=(e)=>{
        e.preventDefault()
        addNote(note.title, note.description)
        setNote({title: "", description: "", tag: ""})
    }

    const onChange=(e)=>{
        setNote({...note, [e.target.name]: e.target.value})
    }

    return (
        <>
        <div className='d-flex justify-content-end' style={{maxWidth: '912px', outline: 'none'}}>
            <div className='my-3 col-10'>
                <div className="input-group">
                    <input type="text" id='title' name='title' className="form-control" placeholder='Title (atleast 3 characters)' onChange={onChange} value={note.title} minLength={3} required/>
                </div>

                <div className="input-group mb-3">
                    <textarea className="form-control" id='description' name='description' placeholder='Take a note... (atleast 5 characters)' onChange={onChange} value={note.description} minLength={5} required></textarea>
                </div>

                <div className='input-group mb-3'>
                    <button className="btn btn-outline-success custom-btn" onClick={handleClick}><i className="fa-solid fa-plus fa-xl" ></i></button>
                </div>
            </div>
        </div>
        </>
    )
}

export default AddNote