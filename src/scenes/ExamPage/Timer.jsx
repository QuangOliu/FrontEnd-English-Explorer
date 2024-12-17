import { useEffect, useState, useRef } from "react";

const Timer = ({ duration, onTimeout = () => {} }) => {
    const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
    const intervalRef = useRef(null); // Store the interval ID

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current); // Clear interval once
                    onTimeout(); // Call the timeout handler
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(intervalRef.current); // Cleanup on unmount
    }, [onTimeout]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };

    return (
        <div
            style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: timeLeft < 10 ? "red" : "black", // Change color near timeout
            }}
        >
            Time Left: {formatTime(timeLeft)}
        </div>
    );
};

export default Timer;
