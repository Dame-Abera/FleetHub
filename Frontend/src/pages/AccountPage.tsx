import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Chip,
  Paper,
  Stack,
  useTheme,
  useMediaQuery,
  Fade,
  Slide
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Edit,
  Save,
  Cancel,
  CameraAlt,
  Security,
  Settings,
  History
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

const AccountPage: React.FC = () => {
  const { user, updateProfile, refreshProfile } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    avatar: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      avatar: user?.avatar || ''
    });
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'error';
      case 'CUSTOMER': return 'primary';
      case 'SELLER': return 'success';
      default: return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Administrator';
      case 'CUSTOMER': return 'Customer';
      case 'SELLER': return 'Seller';
      default: return role;
    }
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Fade in timeout={800}>
        <Box sx={{ mb: 4 }}>
          <Typography variant={isMobile ? "h4" : "h3"} component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Account Management
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage your profile information and account settings
          </Typography>
        </Box>
      </Fade>

      <Grid container spacing={4}>
        {/* Profile Overview Card */}
        <Grid item xs={12} md={4}>
          <Slide direction="up" in timeout={1000}>
            <Card sx={{ height: 'fit-content', position: 'sticky', top: 20 }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                  <Avatar
                    src={user.avatar}
                    sx={{
                      width: 120,
                      height: 120,
                      fontSize: '3rem',
                      bgcolor: 'primary.main',
                      mx: 'auto',
                      mb: 2,
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                  {isEditing && (
                    <IconButton
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' }
                      }}
                    >
                      <CameraAlt />
                    </IconButton>
                  )}
                </Box>

                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                  {user.name}
                </Typography>
                
                <Chip
                  label={getRoleLabel(user.role)}
                  color={getRoleColor(user.role) as any}
                  sx={{ mb: 2 }}
                />

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Member since {format(new Date(user.createdAt), 'MMMM yyyy')}
                </Typography>

                <Stack spacing={1} sx={{ textAlign: 'left' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email color="action" fontSize="small" />
                    <Typography variant="body2">{user.email}</Typography>
                  </Box>
                  {user.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Phone color="action" fontSize="small" />
                      <Typography variant="body2">{user.phone}</Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Slide>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Slide direction="up" in timeout={1200}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                    Profile Information
                  </Typography>
                  {!isEditing ? (
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={handleEdit}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={handleCancel}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                        onClick={handleSave}
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </Stack>
                  )}
                </Box>

                {/* Alerts */}
                {error && (
                  <Fade in>
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                      {error}
                    </Alert>
                  </Fade>
                )}

                {success && (
                  <Fade in>
                    <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
                      {success}
                    </Alert>
                  </Fade>
                )}

                <Divider sx={{ mb: 3 }} />

                {/* Form Fields */}
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={formData.name}
                      onChange={handleInputChange('name')}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <Person color="action" sx={{ mr: 1 }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange('phone')}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <Phone color="action" sx={{ mr: 1 }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      value={user.email}
                      disabled
                      InputProps={{
                        startAdornment: <Email color="action" sx={{ mr: 1 }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                      helperText="Email cannot be changed. Contact support if needed."
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Avatar URL"
                      value={formData.avatar}
                      onChange={handleInputChange('avatar')}
                      disabled={!isEditing}
                      placeholder="https://example.com/avatar.jpg"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                      helperText="Enter a URL to your profile picture"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Slide>

          {/* Account Settings */}
          <Slide direction="up" in timeout={1400}>
            <Card sx={{ mt: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
                  Account Settings
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                      <Security sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        Security
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Manage your password and security settings
                      </Typography>
                      <Button variant="outlined" size="small">
                        Change Password
                      </Button>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                      <Settings sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        Preferences
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Customize your account preferences
                      </Typography>
                      <Button variant="outlined" size="small">
                        Settings
                      </Button>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Slide>

          {/* Account Activity */}
          <Slide direction="up" in timeout={1600}>
            <Card sx={{ mt: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 3 }}>
                  Account Activity
                </Typography>

                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <History color="action" />
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        Account Created
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(user.createdAt), 'MMMM dd, yyyy')}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <History color="action" />
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        Last Updated
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(user.updatedAt), 'MMMM dd, yyyy')}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <History color="action" />
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        Account Status
                      </Typography>
                      <Chip
                        label={user.isActive ? 'Active' : 'Inactive'}
                        color={user.isActive ? 'success' : 'error'}
                        size="small"
                      />
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Slide>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AccountPage;
