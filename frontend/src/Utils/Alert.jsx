import React,{useEffect, useState} from "react";
const Alert = ({message, type,onClose })=>{
    const [show, setShow]=useState(true);
    useEffect(()=>{
        const timer = setTimeout(()=>{
            setShow(false);
            setTimeout(()=>{
        if (onClose) onClose();
        },300)
    },3000)
        
        return ()=> clearTimeout(timer)
    },[onClose]);

    return (
        <div  style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        padding: '12px 20px',
        borderRadius: '8px',
        backgroundColor: type === 'Error' ? '#f44336' : '#4CAF50',
        color: '#fff',
        boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(-20px)',
        transition: 'all 0.3s ease-in-out',
        minWidth: '200px',
        fontSize: '16px',
      }}
    > {message}</div>
    );
};

export default Alert;
