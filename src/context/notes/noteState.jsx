import { useState } from 'react'
import noteContext from './noteContext'
import axiosInstance from '../../axios.js'

const NoteState = (props)=>{

        const [notes, setNotes] = useState([])

        const getNotes = ()=>{
          axiosInstance().get("/get-notes/")
          .then((res)=>{
            setNotes(res.data.notes)
          })
          .catch((err)=>{
            console.log(err)
          })
        }

        const addNote = (title, description)=>{
          axiosInstance().post("/add-note/", {title:title, description:description})
          .then(()=>{
            getNotes()
          }).catch((err)=>{
            console.log(err)
          })
          
        }

        const deleteNote=(id)=>{
          axiosInstance().delete("/delete-note/"+id)
          .then(()=>{
            getNotes()
          }).catch((err)=>{
            console.log(err)
          })
        }

        const updateNote=(id, title, description)=>{
          
          axiosInstance().patch("/update-note/"+id, {title: title, description:description})
          let newNotes = JSON.parse(JSON.stringify(notes))

          for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
              if (element._id === id) {
                newNotes[index].title = title;
                newNotes[index].description = description;
                break; 
              }
          }  
          setNotes(newNotes);
        }

    return(
        <noteContext.Provider value={{notes, setNotes, addNote, deleteNote, getNotes, updateNote}}>
            {props.children}
        </noteContext.Provider>
    )
}

export default NoteState