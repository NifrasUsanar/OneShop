import React, { useRef, useState } from "react";
import { Head } from "@inertiajs/react";
import {
    Button,
    Box,
    Typography,
    Paper,
    Card,
    CardMedia,
    Divider,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import PrintIcon from "@mui/icons-material/Print";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { styled } from "@mui/material/styles";
import numeral from "numeral";
import dayjs from "dayjs";
import { useReactToPrint } from "react-to-print";
import ejs from "ejs";

export default function Reciept({ sale, salesItems, settings, user_name }) {
    const contentRef = useRef(null);
    const reactToPrintFn = useReactToPrint({ contentRef });

    const RecieptContainer = styled(Paper)(({ theme }) => ({
        width: "500px",
        padding: theme.spacing(3),
        textAlign: "center",
        "@media print": {
            boxShadow: "none", // Remove shadow for print
            // padding:0
        },
    }));

    const RecieptPrintContainer = styled(Paper)(({ theme }) => ({
        width: "100%",
        fontFamily: settings.sale_print_font,
        textAlign: "center",
        boxShadow: "none",
        "@media print": {
            boxShadow: "none", // Remove shadow for print
        },
    }));

    const styles = {
        receiptTopText: {
            fontSize: "13px",
            fontWeight: "bold",
            fontFamily: settings.sale_print_font,
        },
        receiptSummaryText: {
            fontSize: "13px",
            padding: 0,
            fontWeight: "bold",
            borderBottom: "none",
            fontFamily: settings.sale_print_font,
        },
        receiptSummaryTyp: {
            fontSize: "13px",
            fontWeight: "bold",
            fontFamily: settings.sale_print_font,
        },
        itemsHeader: {
            fontSize: "13px",
            padding: 0,
            fontWeight: "bold",
            fontFamily: settings.sale_print_font,
            py: 1,
            pt: 0,
        },
        itemsHeaderTyp: {
            fontSize: "14px",
            fontWeight: "bold",
            fontFamily: settings.sale_print_font,
        },

        itemsCells: {
            fontSize: "13px",
            padding: 0,
            fontWeight: "500",
            py: 1,
            verticalAlign: "middle",
            fontFamily: settings.sale_print_font,
        },
        itemsCellsTyp: {
            fontSize: "13px",
            fontWeight: "500",
            fontFamily: settings.sale_print_font,
        },

        printArea: {
            paddingRight: parseFloat(settings.sale_print_padding_right),
            paddingLeft: parseFloat(settings.sale_print_padding_left),
        },
    };

    return (
        <>
            <Head title="Sale Reciept" />
            <Box className="flex justify-center mt-10 p-0">
                <RecieptContainer square={false} className="receipt-container">
                    <Box className="flex justify-between mb-3 print:hidden">
                        <Button
                            onClick={() => window.history.back()}
                            variant="outlined"
                            startIcon={<ArrowBackIosIcon />}
                        >
                            Back
                        </Button>
                        <Button
                            onClick={reactToPrintFn}
                            variant="contained"
                            endIcon={<PrintIcon />}
                        >
                            Print
                        </Button>
                    </Box>
                    <div
                        id="print-area"
                        ref={contentRef}
                        className="p-0"
                        style={styles.printArea}
                    >
                        <RecieptPrintContainer square={false}>
                            <Box className="flex justify-center items-center mt-0 flex-col">
                                <Card sx={{ width: 160, boxShadow: 0 }}>
                                    <CardMedia
                                        component="img"
                                        image={
                                            window.location.origin +
                                            "/" +
                                            settings.shop_logo
                                        }
                                    />
                                </Card>
                                {settings.show_receipt_shop_name == 1 && (
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontSize: "20px",
                                            fontFamily:
                                                settings.sale_print_font,
                                            fontWeight: "bold",
                                        }}
                                        color="initial"
                                        className="receipt-shop-name"
                                    >
                                        {settings.shop_name}
                                    </Typography>
                                )}

                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontSize: "15px",
                                        fontFamily: settings.sale_print_font,
                                    }}
                                    color="initial"
                                    className="receipt-address"
                                >
                                    {sale.address}
                                    <br/>
                                    {sale.contact_number}
                                </Typography>
                            </Box>
                            <Divider
                                sx={{
                                    borderBottom: "1px dashed",
                                    borderColor: "grey.700",
                                    my: "1rem",
                                }}
                                className="receipt-divider-after-address"
                            />
                            <Box className="flex items-start flex-col justify-start receipt-meta">
                                <Typography
                                    sx={styles.receiptTopText}
                                    color="initial"
                                >
                                    Order:
                                    {sale.sale_prefix +
                                        "/" +
                                        sale.invoice_number}
                                </Typography>
                                <Typography
                                    sx={styles.receiptTopText}
                                    color="initial"
                                    textAlign={"start"}
                                >
                                    Date:
                                    {dayjs(sale.created_at).format(
                                        "DD-MMM-YYYY, h:mm A"
                                    ) + " "}
                                    By: {user_name}
                                </Typography>

                                <Typography
                                    sx={styles.receiptTopText}
                                    color="initial"
                                >
                                    Client: {sale.name}
                                </Typography>
                            </Box>
                            <Divider
                                sx={{
                                    borderBottom: "1px dashed",
                                    borderColor: "grey.700",
                                    my: "1rem",
                                }}
                                className="receipt-divider-after-details"
                            />

                            <TableContainer>
                                <Table
                                    sx={{ width: "100%", padding: "0" }}
                                >
                                    <TableHead>
                                        <TableRow className="receipt-items-header">
                                            <TableCell sx={styles.itemsHeader}>
                                                <Typography
                                                    sx={styles.itemsHeaderTyp}
                                                    color="initial"
                                                >
                                                    Item
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                sx={styles.itemsHeader}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={styles.itemsHeaderTyp}
                                                    color="initial"
                                                >
                                                    Qty.
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                sx={styles.itemsHeader}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={styles.itemsHeaderTyp}
                                                    color="initial"
                                                >
                                                    Price
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                sx={styles.itemsHeader}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={styles.itemsHeaderTyp}
                                                    color="initial"
                                                >
                                                    Disc.
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                sx={styles.itemsHeader}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={styles.itemsHeaderTyp}
                                                    color="initial"
                                                >
                                                    Total
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {salesItems.map((item, index) => (
                                            <>
                                                {/* First Row: Product Name */}
                                                <TableRow
                                                    key={`name-row-${index}`}
                                                    className="receipt-product-row"
                                                >
                                                    <TableCell
                                                        colSpan={5}
                                                        sx={{
                                                            ...styles.itemsCells,
                                                            borderBottom:
                                                                "none",
                                                            paddingBottom: 0,
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={
                                                                styles.itemsCellsTyp
                                                            }
                                                            color="initial"
                                                        >
                                                            <strong>
                                                                {" "}
                                                                {index + 1}.
                                                                {item.name}{" "}
                                                                {item.account_number
                                                                    ? "| " +
                                                                      item.account_number
                                                                    : ""}
                                                            </strong>
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>

                                                <TableRow
                                                    key={`details-row-${index}`}
                                                    className="receipt-details-row"
                                                >
                                                    <TableCell
                                                        sx={styles.itemsCells}
                                                        align="right"
                                                        colSpan={2}
                                                    >
                                                        <Typography
                                                            sx={
                                                                styles.itemsCellsTyp
                                                            }
                                                            color="initial"
                                                        >
                                                            {item.quantity}x
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell
                                                        sx={styles.itemsCells}
                                                        align="right"
                                                    >
                                                        <Typography
                                                            sx={
                                                                styles.itemsCellsTyp
                                                            }
                                                            color="initial"
                                                        >
                                                            {numeral(
                                                                item.unit_price -
                                                                    item.discount
                                                            ).format("0,0.00")}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell
                                                        sx={styles.itemsCells}
                                                        align="right"
                                                    >
                                                        <Typography
                                                            sx={
                                                                styles.itemsCellsTyp
                                                            }
                                                            color="initial"
                                                        >
                                                            -
                                                            {numeral(
                                                                item.discount
                                                            ).format("0,0")}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell
                                                        sx={styles.itemsCells}
                                                        align="right"
                                                    >
                                                        <Typography
                                                            sx={
                                                                styles.itemsCellsTyp
                                                            }
                                                            color="initial"
                                                        >
                                                            <strong>
                                                                {numeral(
                                                                    parseFloat(
                                                                        item.quantity
                                                                    ) *
                                                                        (item.unit_price -
                                                                            item.discount)
                                                                ).format(
                                                                    "0,0.00"
                                                                )}
                                                            </strong>
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            </>
                                        ))}

                                        {/* Spacer Row */}
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                sx={{
                                                    padding: "7px 0",
                                                    borderBottom: "none",
                                                }}
                                            />
                                        </TableRow>
                                        {/* Row for Total, Discount, Subtotal, Amount Received, Change */}
                                        <TableRow
                                            sx={{ border: "none" }}
                                            className="receipt-summary-row"
                                        >
                                            <TableCell
                                                sx={styles.receiptSummaryText}
                                                colSpan={4}
                                                align="right"
                                                color="initial"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                    Total:
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                sx={styles.receiptSummaryText}
                                                align="right"
                                                color="initial"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                    Rs.
                                                    {numeral(
                                                        parseFloat(
                                                            sale.total_amount
                                                        ) +
                                                            parseFloat(
                                                                sale.discount
                                                            )
                                                    ).format("0,0.00")}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow
                                            sx={{ border: "none" }}
                                            className="receipt-summary-row"
                                        >
                                            <TableCell
                                                sx={styles.receiptSummaryText}
                                                colSpan={4}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                    Discount:
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                sx={styles.receiptSummaryText}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                    Rs.
                                                    {numeral(
                                                        sale.discount
                                                    ).format("0,0.00")}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow
                                            sx={{ border: "none" }}
                                            className="receipt-summary-row"
                                        >
                                            <TableCell
                                                sx={styles.receiptSummaryText}
                                                colSpan={4}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                    Subtotal:
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                sx={styles.receiptSummaryText}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                    Rs.
                                                    {numeral(
                                                        sale.total_amount
                                                    ).format("0,0.00")}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow
                                            sx={{ border: "none" }}
                                            className="receipt-summary-row"
                                        >
                                            <TableCell
                                                sx={styles.receiptSummaryText}
                                                colSpan={4}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                    <br />
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow
                                            sx={{ border: "none" }}
                                            className="receipt-summary-row"
                                        >
                                            <TableCell
                                                sx={styles.receiptSummaryText}
                                                colSpan={4}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                    Cash:
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                sx={styles.receiptSummaryText}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                    Rs.
                                                    {numeral(
                                                        sale.amount_received
                                                    ).format("0,0.00")}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow
                                            sx={{ border: "none" }}
                                            className="receipt-summary-row"
                                        >
                                            <TableCell
                                                sx={styles.receiptSummaryText}
                                                colSpan={4}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                    Change:
                                                </Typography>
                                            </TableCell>
                                            <TableCell
                                                sx={styles.receiptSummaryText}
                                                align="right"
                                            >
                                                <Typography
                                                    sx={
                                                        styles.receiptSummaryTyp
                                                    }
                                                    color="initial"
                                                >
                                                    Rs.
                                                    {numeral(
                                                        parseFloat(
                                                            sale.amount_received
                                                        ) -
                                                            parseFloat(
                                                                sale.total_amount
                                                            )
                                                    ).format("0,0.00")}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Divider
                                sx={{
                                    borderBottom: "1px dashed",
                                    borderColor: "grey.700",
                                    my: "1rem",
                                }}
                                className="receipt-divider-before-footer"
                            />
                            <Typography
                                variant="body1"
                                color="initial"
                                sx={{
                                    ...styles.receiptSummaryText,
                                    textAlign: "start",
                                }}
                            >
                                <div
                                className="receipt-footer"
                                    dangerouslySetInnerHTML={{
                                        __html: settings.sale_receipt_note,
                                    }}
                                />
                                {/* {settings.sale_receipt_note} */}
                            </Typography>
                        </RecieptPrintContainer>
                    </div>
                </RecieptContainer>
            </Box>
        </>
    );
}
