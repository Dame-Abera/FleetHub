import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Warning as WarningIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon
} from '@mui/icons-material';

export interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'error' | 'info' | 'success';
  loading?: boolean;
  icon?: React.ReactNode;
  severity?: 'error' | 'warning' | 'info' | 'success';
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  loading = false,
  icon,
  severity
}) => {
  const getIcon = () => {
    if (icon) return icon;
    
    switch (type) {
      case 'error':
        return <DeleteIcon color="error" />;
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'info':
        return <EditIcon color="info" />;
      default:
        return <WarningIcon color="warning" />;
    }
  };

  const getSeverity = () => {
    if (severity) return severity;
    
    switch (type) {
      case 'error':
        return 'error' as const;
      case 'success':
        return 'success' as const;
      case 'info':
        return 'info' as const;
      default:
        return 'warning' as const;
    }
  };

  const getConfirmButtonColor = () => {
    switch (type) {
      case 'error':
        return 'error';
      case 'success':
        return 'success';
      case 'info':
        return 'primary';
      default:
        return 'warning';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {getIcon()}
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Alert severity={getSeverity()} sx={{ mb: 2 }}>
          {message}
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{ textTransform: 'none' }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={getConfirmButtonColor()}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          sx={{ 
            textTransform: 'none',
            px: 3,
            py: 1
          }}
        >
          {loading ? 'Processing...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;

