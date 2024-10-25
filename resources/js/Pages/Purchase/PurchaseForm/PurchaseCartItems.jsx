import React from 'react';
import { useState, useEffect, useContext } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TableFooter, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Import the Delete icon

import { usePurchase } from "@/Context/PurchaseContext";

export default function PurchaseCartItems() {
    const {
        cartState,
        cartTotal,
        removeFromCart,
        updateProductQuantity,
        totalProfit,
    } = usePurchase();

    // Function to handle the removal of items from the cart
    const handleRemoveItem = (item) => {
        // Logic to remove the item from cartState
        removeFromCart(item)
        // You can update your state here to remove the item from the cart
    };

    const handleQuantityChange = (item, newQuantity) => {
        if(newQuantity=='' || newQuantity==null) newQuantity=0
        updateProductQuantity(item.id, item.batch_number, newQuantity)
      };

    return (
        <TableContainer component={Paper} sx={{mb:'4rem'}}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Batch</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Cost</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {cartState.map((item) => (
                        <TableRow key={item.batch_id}>
                            <TableCell sx={{padding:'10px 10px'}}>{item.name}</TableCell>
                            <TableCell sx={{padding:'7px 10px'}}>{item.batch_number}</TableCell>
                            <TableCell sx={{padding:'7px 10px'}}>{parseFloat(item.price).toFixed(2)}</TableCell>
                            <TableCell sx={{padding:'7px 10px'}}> {item.quantity} </TableCell>
                            <TableCell sx={{padding:'7px 10px'}}>{parseFloat(item.cost).toFixed(2)}</TableCell> 
                            <TableCell sx={{padding:'7px 10px'}}>{(parseFloat(item.cost)*parseFloat(item.quantity)).toFixed(2)}</TableCell>
                            <TableCell sx={{padding:'7px 10px'}}>
                                <IconButton 
                                    aria-label="delete" 
                                    onClick={() => handleRemoveItem(item)} 
                                    color="error"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell colSpan={5} style={{ textAlign: 'right' }}>
                        <strong>Total Cost Amount:</strong>
                        </TableCell>
                        <TableCell>
                        <strong>Rs.{cartTotal.toFixed(2)}</strong>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={5} style={{ textAlign: 'right' }}>
                        <strong>Total Profit Amount:</strong>
                        </TableCell>
                        <TableCell>
                        <strong>Rs.{totalProfit.toFixed(2)}</strong>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={5} style={{ textAlign: 'right' }}>
                        <strong>Total Items:</strong>
                        </TableCell>
                        <TableCell>
                        <strong>{cartState.length}</strong>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}
