import * as React from "react";
import { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import Grid from "@mui/material/Grid2";
import { Button, Box, FormControl, TextField, MenuItem } from "@mui/material";
import FindReplaceIcon from "@mui/icons-material/FindReplace";
import dayjs from "dayjs";
import axios from "axios";
import numeral from "numeral";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
        border: 0,
    },
    "& td, & th": {
        padding: '10px 5px', // Reduce padding on the rows
    },
}));

export default function SalesReport({ stores, report }) {
    const [dataReport, setDataReport] = useState(report);

    const [searchTerms, setSearchTerms] = useState({
        start_date: dayjs().format("YYYY-MM-DD"),
        end_date: dayjs().format("YYYY-MM-DD"),
        store: 0,
    });

    const handleFieldChange = ({ target: { name, value } }) => {
        setSearchTerms({
            ...searchTerms,
            [name]: value,
        });
    };

    const refreshReport = (url) => {
        const options = {
            preserveState: true, // Preserves the current component's state
            preserveScroll: true, // Preserves the current scroll position
            only: ["report"], // Only reload specified properties
            onSuccess: (response) => {
                setDataReport(response.props.report);
            },
        };
        router.get(
            url,
            searchTerms,
            options
        );
    };

    const headers = [
        { label: "#", align: "left", sx: {} },
        { label: "DATE", align: "left", sx: { width: "120px" } },
        { label: "DESCRIPTION", align: "left", sx: {} },
        { label: "RECEIVABLE", align: "right", sx: {} },
        { label: "SETTLED", align: "right", sx: {} },
        { label: "PROFIT", align: "right", sx: {} },
    ];

    const initialTotals = {
        totalReceivable: 0,
        totalSettled: 0,
        totalProfit: 0,
        totalBalance: 0,
        totalRevenue: 0,
    };

    const totals = (dataReport && dataReport.length > 0)
        ? dataReport.reduce((acc, row) => {
            const receivable = parseFloat(row.receivable) || 0;
            const settled = parseFloat(row.settled) || 0;
            const profit = parseFloat(row.profit) || 0;

            acc.totalReceivable += receivable;
            acc.totalSettled += settled;
            acc.totalProfit += profit;
            acc.totalBalance += receivable - settled;
            acc.totalRevenue += receivable;

            return acc;
        }, initialTotals)
        : initialTotals;

    return (
        <AuthenticatedLayout>
            <Head title="Sale Report" />
            <Grid
                container
                spacing={2}
                alignItems="center"
                sx={{ width: "100%", mt: "1rem" }}
                justifyContent={"center"}
                size={12}
            >
                <Grid size={3}>
                    <TextField
                        label="Store"
                        name="store"
                        fullWidth
                        select
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                        value={searchTerms.store}
                        onChange={handleFieldChange}
                        required
                    >
                        <MenuItem value={0}>All</MenuItem>
                        {stores.map((store) => (
                            <MenuItem key={store.id} value={store.id}>
                                {store.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <FormControl>
                    <TextField
                        label="Start Date"
                        name="start_date"
                        placeholder="Start Date"
                        fullWidth
                        type="date"
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                        value={searchTerms.start_date}
                        onChange={handleFieldChange}
                        required
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label="End Date"
                        name="end_date"
                        placeholder="End Date"
                        fullWidth
                        type="date"
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                        value={searchTerms.end_date}
                        onChange={handleFieldChange}
                        required
                    />
                </FormControl>

                <Button
                    variant="contained"
                    onClick={() => refreshReport(window.location.pathname)}
                    sx={{ height: "100%" }}
                    size="large"
                >
                    <FindReplaceIcon />
                </Button>
            </Grid>


                <Grid container width={'100%'} justifyContent={'center'} sx={{mt:2}}>
                <TableContainer component={Paper} sx={{ width:'100%', maxWidth: {sm:"750px"}, overflow:'auto',height:'500px' }}>
                    <Table aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                {headers.map((header, index) => (
                                    <StyledTableCell
                                        key={index}
                                        align={header.align}
                                        sx={header.sx}
                                    >
                                        {header.label}
                                    </StyledTableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataReport && dataReport.length > 0 ? (
                                dataReport.map((row, index) => (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell component="th" scope="row">
                                            {index + 1}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            {row.date} {/* Display the date */}
                                        </StyledTableCell>
                                        <StyledTableCell align="left">
                                            {row.description} {/* Display the description */}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {numeral(row.receivable).format('0,0.00')} {/* Format receivable */}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {numeral(row.settled).format('0,0.00')} {/* Format settled */}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {numeral(row.profit).format('0,0.00')} {/* Format profit */}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))
                            ) : (
                                <StyledTableRow>
                                    <StyledTableCell colSpan={6} align="center">
                                        No data available
                                    </StyledTableCell>
                                </StyledTableRow>
                            )}

                            <StyledTableRow sx={{backgroundColor:'black'}}>
                                <StyledTableCell colSpan={3} align="right">
                                    <strong>Total:</strong>
                                </StyledTableCell>
                                <StyledTableCell align="right"
                                sx={{
                                    backgroundColor:'#295F98', // Conditional color
                                    color: 'white', // Text color for contrast
                                }}>
                                    <strong>{numeral(totals.totalReceivable).format('0,0.00')}</strong>
                                </StyledTableCell>
                                <StyledTableCell align="right"
                                sx={{
                                    backgroundColor:'#295F98', // Conditional color
                                    color: 'white', // Text color for contrast
                                }}>
                                    <strong>{numeral(totals.totalSettled).format('0,0.00')}</strong>
                                </StyledTableCell>
                                <StyledTableCell align="right"
                                sx={{
                                    backgroundColor: totals.totalProfit > 0 ? 'green' : totals.totalProfit < 0 ? 'red' : 'gray', // Conditional color
                                    color: 'white', // Text color for contrast
                                }}
                                >
                                    <strong>{numeral(totals.totalProfit).format('0,0.00')}</strong>
                                </StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell colSpan={6} align="right">
                                </StyledTableCell>
                            </StyledTableRow>

                            {/* Row for Revenue */}
                            <StyledTableRow>
                                <StyledTableCell colSpan={5} align="right">
                                    <strong>Revenue:</strong>
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <strong>{numeral(totals.totalRevenue).format('0,0.00')}</strong>
                                </StyledTableCell>
                            </StyledTableRow>

                            {/* Row for Balance */}
                            <StyledTableRow>
                                <StyledTableCell colSpan={5} align="right">
                                    <strong>Balance/Receivable:</strong>
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <strong>{numeral(totals.totalBalance).format('0,0.00')}</strong>
                                </StyledTableCell>
                            </StyledTableRow>

                            
                        </TableBody>
                    </Table>
                </TableContainer>
                </Grid>
        </AuthenticatedLayout>
    );
}