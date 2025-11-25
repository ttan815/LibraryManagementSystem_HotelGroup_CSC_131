import React, { useState, useEffect } from 'react';

const MembershipPage = ()=>{
    const [user,setUser] = useState('')
    useEffect(()=>{
        const setUserInfo = async ()=>{
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:8000/api/users/me",{
                headers:{
                    "Authorization": `Bearer ${token}`
                }         
            });
            const data = await res.json();
            setUser(data);
        }
        setUserInfo();
    },[])
    const updateMembership = async ()=>{
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/api/users/me",{
        headers:{
            "Authorization": `Bearer ${token}`
        }
        });
        if(res.ok){
            const body = {
                "membership_dues" : 1,
            }
            const options = {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, 
                },
                body: JSON.stringify(body),
            };
                const status = await fetch(`http://localhost:8000/api/users/me`, options)
                if(status.ok){
                    alert("Successfully enrolled in membership")
                    window.location.href = "http://localhost:3000/";
                }
                else{
                    alert("Unsuccessful in enrolling in membership")
                }
        }
        else{
            alert("Error authorizing user, please login again.")
        }
    }
    
    return(
        <>
            <h1>Enroll in LibraryMS Membership (Free & for life!)</h1>
            <button onClick={updateMembership}>Enroll</button>
        </>
    )
}

export default MembershipPage