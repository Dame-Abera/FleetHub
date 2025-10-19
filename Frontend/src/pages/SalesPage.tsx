import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Paper,
  Stack,
  Badge,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import { getSales, confirmSale, rejectSale, completeSale } from '../services/saleService';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StoreIcon from '@mui/icons-material/Store';
import WarningIcon from '@mui/icons-material/Warning';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const SalesPage: React.FC = () => {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);
  const [selectedSale, setSelectedSale] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const queryClient = useQueryClient();

  const { data: salesData, isLoading, error, refetch } = useQuery(
    ['sales', refreshKey],
    () => getSales({ limit: 50 }),
    {
      enabled: !!user,
      refetchOnWindowFocus: false
    }
  );

  const confirmMutation = useMutation(confirmSale, {
    onSuccess: () => {
      queryClient.invalidateQueries(['sales']);
      setSnackbarMessage('Sale approved successfully!');
      setSnackbarOpen(true);
    },
    onError: (error: any) => {
      setSnackbarMessage(`Error: ${error.response?.data?.message || 'Failed to approve sale'}`);
      setSnackbarOpen(true);
    }
  });

  const rejectMutation = useMutation(rejectSale, {
    onSuccess: () => {
      queryClient.invalidateQueries(['sales']);
      setSnackbarMessage('Sale rejected successfully!');
      setSnackbarOpen(true);
      setRejectDialogOpen(false);
      setRejectReason('');
    },
    onError: (error: any) => {
      setSnackbarMessage(`Error: ${error.response?.data?.message || 'Failed to reject sale'}`);
      setSnackbarOpen(true);
    }
  });

  const completeMutation = useMutation(completeSale, {
    onSuccess: () => {
      queryClient.invalidateQueries(['sales']);
      setSnackbarMessage('Sale completed successfully!');
      setSnackbarOpen(true);
      setCompleteDialogOpen(false);
    },
    onError: (error: any) => {
      setSnackbarMessage(`Error: ${error.response?.data?.message || 'Failed to complete sale'}`);
      setSnackbarOpen(true);
    }
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleApproveClick = (sale: any) => {
    setSelectedSale(sale);
    setSelectedSaleId(sale.id);
    setApproveDialogOpen(true);
  };

  const handleApproveConfirm = () => {
    if (selectedSaleId) {
      confirmMutation.mutate(selectedSaleId);
      setApproveDialogOpen(false);
      setSelectedSale(null);
      setSelectedSaleId(null);
    }
  };

  const handleApproveCancel = () => {
    setApproveDialogOpen(false);
    setSelectedSale(null);
    setSelectedSaleId(null);
  };

  const handleRejectClick = (sale: any) => {
    setSelectedSale(sale);
    setSelectedSaleId(sale.id);
    setRejectDialogOpen(true);
  };

  const handleCompleteClick = (sale: any) => {
    setSelectedSale(sale);
    setSelectedSaleId(sale.id);
    setCompleteDialogOpen(true);
  };

  const handleRejectConfirm = () => {
    if (selectedSaleId) {
      rejectMutation.mutate({ id: selectedSaleId, reason: rejectReason });
    }
  };

  const handleCompleteConfirm = () => {
    if (selectedSaleId) {
      completeMutation.mutate(selectedSaleId);
    }
  };

  const handleRejectCancel = () => {
    setRejectDialogOpen(false);
    setSelectedSale(null);
    setSelectedSaleId(null);
    setRejectReason('');
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Error fetching sales: {error instanceof Error ? error.message : 'Unknown error'}
        </Alert>
        <Button onClick={handleRefresh} variant="contained">
          Retry
        </Button>
      </Container>
    );
  }

  const sales = salesData?.data || [];
  const pendingSales = sales.filter(sale => !sale.date);
  const completedSales = sales.filter(sale => sale.date);
  const mySales = sales.filter(sale => sale.seller.email === user?.email);
  const myPurchases = sales.filter(sale => sale.buyer.email === user?.email);

  const getFilteredSales = () => {
    switch (activeTab) {
      case 0: return pendingSales;
      case 1: return completedSales;
      case 2: return mySales;
      case 3: return myPurchases;
      default: return sales;
    }
  };

  const filteredSales = getFilteredSales();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Sales Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {user?.role === 'COMPANY_USER' 
              ? 'Manage vehicle purchase orders and transactions'
              : 'View your purchase history and orders'
            }
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh Data">
            <IconButton onClick={handleRefresh} disabled={isLoading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.50' }}>
            <DirectionsCarIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {sales.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Orders
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'warning.50' }}>
            <Badge badgeContent={pendingSales.length} color="warning">
              <PendingIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            </Badge>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {pendingSales.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending Approval
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'success.50' }}>
            <CheckCircleIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {completedSales.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completed
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', p: 2, bgcolor: 'info.50' }}>
            <AttachMoneyIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              ${sales.reduce((sum, sale) => sum + sale.price, 0).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Value
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PendingIcon />
                Pending
                {pendingSales.length > 0 && (
                  <Chip label={pendingSales.length} size="small" color="warning" />
                )}
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon />
                Completed
                {completedSales.length > 0 && (
                  <Chip label={completedSales.length} size="small" color="success" />
                )}
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <StoreIcon />
                My Sales
                {mySales.length > 0 && (
                  <Chip label={mySales.length} size="small" color="primary" />
                )}
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShoppingCartIcon />
                My Purchases
                {myPurchases.length > 0 && (
                  <Chip label={myPurchases.length} size="small" color="secondary" />
                )}
              </Box>
            } 
          />
        </Tabs>
      </Card>

      {/* Sales List */}
      {filteredSales.length > 0 ? (
        <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
          <CardContent sx={{ p: 0 }}>
            <List>
              {filteredSales.map((sale, index) => (
                <React.Fragment key={sale.id}>
                  <ListItem 
                    alignItems="flex-start" 
                    sx={{ 
                      py: 3, 
                      px: 3,
                      '&:hover': {
                        bgcolor: 'action.hover',
                        borderRadius: 1
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        sx={{ 
                          bgcolor: sale.date ? 'success.main' : 'warning.main', 
                          width: 60, 
                          height: 60,
                          boxShadow: 2
                        }}
                      >
                        {sale.date ? <DoneAllIcon /> : <AccessTimeIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <Box sx={{ flexGrow: 1, ml: 2 }}>
                      {/* Sale Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                            {sale.car.year} {sale.car.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {sale.car.category} • {sale.car.mileage?.toLocaleString()} miles
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Chip
                            label={`$${sale.price.toLocaleString()}`}
                            color="primary"
                            variant="outlined"
                            sx={{ fontWeight: 600, fontSize: '0.9rem' }}
                          />
                          <Chip
                            label={sale.date ? 'Completed' : 'Pending'}
                            color={sale.date ? 'success' : 'warning'}
                            variant="filled"
                            size="small"
                            sx={{ fontWeight: 500 }}
                          />
                        </Box>
                      </Box>

                      {/* Sale Details */}
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <PersonIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {sale.buyer.email === user?.email
                              ? `You purchased from ${sale.seller.name}`
                              : `Purchased by ${sale.buyer.name} (Seller: ${sale.seller.name})`}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <DirectionsCarIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            Car posted by {sale.car.postedBy?.name || 'N/A'}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Order Date: {new Date(sale.createdAt).toLocaleDateString()}
                          {sale.date && ` • Completed: ${new Date(sale.date).toLocaleDateString()}`}
                        </Typography>
                        {sale.notes && (
                          <Box sx={{ mt: 1.5, p: 1.5, bgcolor: 'grey.50', borderRadius: 1.5, border: '1px solid', borderColor: 'grey.200' }}>
                            <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                              "{sale.notes}"
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Action Buttons */}
                      {!sale.date && sale.seller.email === user?.email && (
                        <Box sx={{ 
                          display: 'flex', 
                          gap: 1.5, 
                          mt: 2,
                          p: 2,
                          bgcolor: 'warning.50',
                          borderRadius: 1.5,
                          border: '1px solid',
                          borderColor: 'warning.200'
                        }}>
                          <Button
                            size="medium"
                            variant="contained"
                            color="success"
                            startIcon={<ThumbUpIcon />}
                            onClick={() => handleApproveClick(sale)}
                            disabled={confirmMutation.isLoading}
                            sx={{ 
                              textTransform: 'none',
                              fontWeight: 600,
                              px: 3,
                              py: 1,
                              borderRadius: 2,
                              boxShadow: 2,
                              '&:hover': {
                                boxShadow: 4,
                                transform: 'translateY(-1px)'
                              },
                              transition: 'all 0.2s ease-in-out'
                            }}
                          >
                            Approve Sale
                          </Button>
                          <Button
                            size="medium"
                            variant="outlined"
                            color="error"
                            startIcon={<ThumbDownIcon />}
                            onClick={() => handleRejectClick(sale)}
                            disabled={rejectMutation.isLoading}
                            sx={{ 
                              textTransform: 'none',
                              fontWeight: 600,
                              px: 3,
                              py: 1,
                              borderRadius: 2,
                              borderWidth: 2,
                              '&:hover': {
                                borderWidth: 2,
                                transform: 'translateY(-1px)'
                              },
                              transition: 'all 0.2s ease-in-out'
                            }}
                          >
                            Reject Offer
                          </Button>
                        </Box>
                      )}

                      {sale.date && sale.seller.email === user?.email && (
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1, 
                          mt: 2,
                          p: 2,
                          bgcolor: 'success.50',
                          borderRadius: 1.5,
                          border: '1px solid',
                          borderColor: 'success.200'
                        }}>
                          <CheckCircleIcon color="success" />
                          <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                            Sale Completed
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </ListItem>
                  {index < filteredSales.length - 1 && <Divider sx={{ mx: 3 }} />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>
      ) : (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <DirectionsCarIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.6 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No sales orders found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {activeTab === 0 && 'No pending sales orders'}
            {activeTab === 1 && 'No completed sales orders'}
            {activeTab === 2 && 'You haven\'t sold any vehicles yet'}
            {activeTab === 3 && 'You haven\'t purchased any vehicles yet'}
          </Typography>
        </Paper>
      )}

      {/* Approve Confirmation Dialog */}
      <Dialog 
        open={approveDialogOpen} 
        onClose={handleApproveCancel} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon color="success" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Approve Sale
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to approve this sale offer?
          </Typography>
          {selectedSale && (
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Sale Details:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Car:</strong> {selectedSale.car.year} {selectedSale.car.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Price:</strong> ${selectedSale.price.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Buyer:</strong> {selectedSale.buyer.name} ({selectedSale.buyer.email})
              </Typography>
            </Box>
          )}
          <Typography variant="body2" color="text.secondary">
            Once approved, the sale will be marked as completed and the buyer will be notified.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleApproveCancel} 
            disabled={confirmMutation.isLoading}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApproveConfirm}
            color="success"
            variant="contained"
            disabled={confirmMutation.isLoading}
            startIcon={confirmMutation.isLoading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
            sx={{ 
              textTransform: 'none',
              px: 3,
              py: 1,
              fontWeight: 600
            }}
          >
            {confirmMutation.isLoading ? 'Approving...' : 'Approve Sale'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog 
        open={rejectDialogOpen} 
        onClose={handleRejectCancel} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CancelIcon color="error" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Reject Sale Offer
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to reject this sale offer? This action cannot be undone.
          </Typography>
          {selectedSale && (
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Sale Details:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Car:</strong> {selectedSale.car.year} {selectedSale.car.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Price:</strong> ${selectedSale.price.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Buyer:</strong> {selectedSale.buyer.name} ({selectedSale.buyer.email})
              </Typography>
            </Box>
          )}
          <TextField
            fullWidth
            label="Reason for rejection (optional)"
            multiline
            rows={3}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Please provide a reason for rejecting this offer..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleRejectCancel} 
            disabled={rejectMutation.isLoading}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRejectConfirm}
            color="error"
            variant="contained"
            disabled={rejectMutation.isLoading}
            startIcon={rejectMutation.isLoading ? <CircularProgress size={20} /> : <CancelIcon />}
            sx={{ 
              textTransform: 'none',
              px: 3,
              py: 1,
              fontWeight: 600
            }}
          >
            {rejectMutation.isLoading ? 'Rejecting...' : 'Reject Offer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default SalesPage;