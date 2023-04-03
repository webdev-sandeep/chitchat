import React from "react";

const ReceiverMessage = ({ message, time, avatar }) => {
  return (
    <div className="receiver-message flex items-center mr-16">
      <div className="message-info p-2 flex flex-col items-end">
        <div className="avatar h-10 w-10">
          <img
            src={avatar}
            alt="receiver-avatar"
            className="h-full w-full object-cover rounded-sm"
          />
        </div>
        <p className="time text-xs text-gray-700 lowercase">{time}</p>
      </div>
      <div className="message bg-white text-sm py-1 px-2 rounded-tr rounded-bl rounded-br">
        {message}
      </div>
    </div>
  );
};

export default ReceiverMessage;
