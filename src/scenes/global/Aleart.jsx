import React, { useEffect } from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Backdrop } from "@mui/material";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

function Aleart({ title, messsage, open, setOpen, type = "success", time = 750 }) {
  useEffect(() => {
    if (open === true) {
      setTimeout(() => {
        setOpen(false);
      }, time);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open} onClick={handleClose}>
      <div className='custom-modal'>
        {/* <div className={`${type} succes-animation icon-top`}>{type === "success" ? <CheckCircleOutlineIcon sx={{ fontSize: "45px" }} /> : <PriorityHighIcon sx={{ fontSize: "45px" }} />}</div> */}

        <div className='succes succes-animation icon-top'>
          <CheckCircleOutlineIcon sx={{ fontSize: "45px" }} />
        </div>
        <div className={`${type} border-bottom`}></div>
        <div className='content'>
          <p className='type'>{title}</p>
          <p className='message-type'>{messsage}</p>
        </div>
      </div>
    </Backdrop>
  );
}

export default Aleart;
