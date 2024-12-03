import React, { useEffect, useState } from "react";
import BsContext from "./BsContext";

const BsState = (props) => {

    const [movie, changeMovie] = useState("");

    const [time, changeTime] = useState("");

    const [noOfSeat, changeNoOfSeats] = useState({
        A1: "",
        A2: "",
        A3: "",
        A4: "",
        D1: "",
        D2: "",
    });

    const [errorPopup, setErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [lastBookingDetails, setLastBookingDetails] = useState(null);

    const handlePostBooking = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/booking', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ movie: movie, slot: time, seats: noOfSeat }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
    
            setErrorPopup(true);
            setErrorMessage(data.message);
    
            if (response.status === 200) {
                changeTime("");
                changeMovie("");
                setLastBookingDetails(data.data);
                window.localStorage.clear();
            }
        } catch (error) {
            setErrorPopup(true);
            setErrorMessage("Failed to connect to the server. Please try again later.");
            console.error("Error in handlePostBooking:", error);
        }
    };
    

    const handleGetLastBooking = async() => {
        const response = await fetch(
            'http://localhost:8080/api/booking', {
                method: "GET",
            }
        )
        const data = await response.json();

        setLastBookingDetails(data.data);
    };

    useEffect(()=>{
        const movie = window.localStorage.getItem("movie");
        const slot = window.localStorage.getItem("slot");
        const seats = JSON.parse(window.localStorage.getItem("seats"));

        if(movie){
            changeMovie(movie);
        }
        if(slot){
            changeTime(slot);
        }
        if(seats){
            changeNoOfSeats(seats);
        }
    }, [])
    return (
        <BsContext.Provider value={{ handlePostBooking,
            handleGetLastBooking,
            movie,
            changeMovie,
            time,
            changeTime,
            noOfSeat,
            changeNoOfSeats,
            lastBookingDetails,
            errorPopup,
            setErrorPopup,
            errorMessage,
            setErrorMessage,}}>{props.children}</BsContext.Provider>
    )
}

export default BsState;