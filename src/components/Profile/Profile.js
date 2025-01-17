import React from 'react'
import "./Profile.css";
import { ProfileData } from './ProfileData';

export function Profile({ userImage, userName }) {
  return (
    <div className='Profile'>
             
        <ul className='ProfileList'>
            {ProfileData.map((value, key) => {
                return (
                    <li key={key} 
                    id={window.location.pathname == value.link ? "active" : ""}
                    className='Profilerow' onClick={() => {
                        window.location.pathname = value.link;
                    }}>
                        <div id='title'>{value.title}</div>
                    </li>
                )
            })}
        </ul>
    </div>
  )
}

export default Profile;
