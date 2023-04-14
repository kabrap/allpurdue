import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));

const ConfirmationReport = ({ open, onClose, onConfirm, message }) => {
  const classes = useStyles();

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <div className={classes.paper}>
        <Typography variant="h5" id="confirmation-dialog-title">
          Confirm Report
        </Typography>
        <Typography variant="body1" id="confirmation-dialog-description">
          {message}
        </Typography>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <Button variant="contained" color="secondary" onClick={onConfirm} style={{ marginRight: '1rem' }}>
            Report
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationReport;
