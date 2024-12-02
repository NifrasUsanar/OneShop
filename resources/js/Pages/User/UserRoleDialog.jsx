import * as React from 'react';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormGroup, FormControlLabel, Switch, Grid2 as Grid } from '@mui/material';
import Swal from 'sweetalert2';

export default function UserRoleDialog({ open, handleClose, user_role, permissions}) {
    const [formState, setFormState] = useState({
      user_role: '',  // Now user_role is a text field
      permissions: [], // Store selected permissions here
    });

    useEffect(() => {
        console.log(user_role?.permissions)
      if (user_role) {
        setFormState({
          user_role: user_role.name || '', // Set the user role from the user data
          permissions: user_role.permissions?.map(p => p.name) || [],
        });
      } else {
        setFormState({
          user_role: '', // Default to an empty string
          permissions: [], // Default to no permissions
        });
      }
    }, [user_role]);

    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };

    const handlePermissionChange = (event) => {
      const { value, checked } = event.target;
      setFormState((prevState) => {
        const permissions = checked
          ? [...prevState.permissions, value]
          : prevState.permissions.filter(permission => permission !== value);
        return { ...prevState, permissions };
      });
    };

    const handleSubmit = (event) => {
      event.preventDefault();

      const endpoint = user_role ? `/user/${user_role.id}/role` : '/user/role';
      
      router.post(endpoint, formState, {
        onSuccess: (resp) => {
          const responseMessage = resp.props.flash?.message || 'User role and permissions updated!';

          Swal.fire({
            title: 'Success!',
            text: responseMessage,
            icon: 'success',
            position: 'bottom-start',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            toast: true,
          });
          handleClose(); // Close dialog on success
        },
        onError: (errors) => {
          const errorMessages = Object.values(errors).flat().join(' | ');
          Swal.fire({
            title: 'Error!',
            text: errorMessages || 'An unexpected error occurred.',
            icon: 'error',
            confirmButtonText: 'OK',
            timerProgressBar: true,
          });
        },
      });
    };

    return (
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={'sm'}
        fullWidth={true}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>User Role and Permissions</DialogTitle>
        <DialogContent>
          {/* User Role - TextField */}
          <TextField
            className="py-8"
            required
            margin="dense"
            id="user_role"
            name="user_role"
            label="User Role"
            type="text"
            fullWidth
            variant="outlined"
            value={formState.user_role}
            onChange={handleChange}
          />

<FormGroup sx={{ mt: '1rem' }}>
      <h4>Permissions</h4>
      <Grid container spacing={2}>
        {permissions.map((permission) => (
          <Grid
            item
            key={permission.id}
            size={{
              xs: 12, // Full width for extra small screens
              sm: 4,  // Half width for small screens
              md: 4,  // One-third width for medium screens
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={formState.permissions.includes(permission.name)} // Check if permission is in the list
                  onChange={handlePermissionChange}
                  value={permission.name}  // Permission ID as value
                  name="permissions"
                />
              }
              label={permission.name} // Display permission name
            />
          </Grid>
        ))}
      </Grid>
    </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">SAVE</Button>
        </DialogActions>
      </Dialog>
    );
}