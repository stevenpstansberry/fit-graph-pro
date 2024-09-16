
import React, { useState, useEffect } from "react";
import { Card, Modal } from "@mui/material";



function ExerciseInfoCard({ open, onClose, exercise }) {
 

  return (
    <Modal
      open={open}
      onClose={onClose}
      BackdropProps={{
        style: { backgroundColor: 'rgba(0,0,0,0.5)' },
      }}
    >
      <Card
        sx={{
          maxWidth: 850,
          minWidth: 850,
          maxHeight: 500,
          minHeight: 500,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 12,
          p: 4,
          overflowY: 'auto',
        }}
      >
      </Card>
    </Modal>
  );
}

export default ExerciseInfoCard;

