import React, { useState, useEffect } from "react";

const CountdownTimer = ({ dateEnd, timeExpired }) => {
  const getRemainingSeconds = (dateEnd, timeExpired) => {
    if (!dateEnd || !timeExpired) {
      return 0;
    }

    const [day, month, year] = dateEnd.split("-").map(Number);
    const [hours, minutes, seconds] = timeExpired.split(":").map(Number);

    const endDateTime = new Date(year, month - 1, day, hours, minutes, seconds);
    const now = new Date();
    const remainingSeconds = Math.floor((endDateTime - now) / 1000);

    return remainingSeconds > 0 ? remainingSeconds : 0;
  };

  const [timeRemaining, setTimeRemaining] = useState(
    getRemainingSeconds(dateEnd, timeExpired)
  );

  useEffect(() => {
    setTimeRemaining(getRemainingSeconds(dateEnd, timeExpired));
  }, [dateEnd, timeExpired]);

  useEffect(() => {
    if (timeRemaining <= 0) return;

    const countdownInterval = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [timeRemaining]);

  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;

  if (timeRemaining <= 0) {
    return <div>Hết hạn</div>;
  }

  return (
    <>
      {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
      {String(seconds).padStart(2, "0")}
    </>
  );
};

export default CountdownTimer;
