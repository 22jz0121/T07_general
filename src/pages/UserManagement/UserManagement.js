import React, { useEffect, useState } from "react";
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import './UserManagement.css';
import UserTable from '../../components/UserTable/UserTable';

function UserManagement() {

  return (
      <div>
        <div className="navbar">
           <Navbar  />
        </div>

        <div className='columnBrake'>
          <div className="sidebar">
            <Sidebar />
          </div>
          <div className='mainbody'>
            
            <div className='usertable'>
              <div className='usertable-y'>
                <UserTable/> 
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

export default UserManagement;