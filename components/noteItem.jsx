import React, { useContext } from 'react'
import noteContext from '../src/context/notes/noteContext'

const NoteItem = (props) => {
    const { note, updateNote } = props
    const context = useContext(noteContext)
    const {deleteNote} = context
    return (
        <div style={{maxWidth: 912}} className='d-flex justify-content-end'>
            <div className="card my-3 col-10">
                    <div className="card-body">
                        <h5 className="card-title">{note.title}</h5>
                        <p className="card-text">{note.description}</p>
                        <div className="d-flex justify-content-space-around">
                            <button className='btn btn-outline-danger mx-2 btn-sm' onClick={()=>{deleteNote(note._id)}}><i className="fa-solid fa-trash mx-2"></i></button>
                            <button className='btn btn-outline-warning mx-2 btn-sm' onClick={()=>{updateNote(note)}}><i className="fa-solid fa-pen-to-square mx-2"></i></button>
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default NoteItem