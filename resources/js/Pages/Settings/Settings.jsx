import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import TextField from "@mui/material/TextField";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import Swal from "sweetalert2";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

export default function Setting({ settings }) {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettingFormData({
            ...settingFormData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const [settingFormData, setSettingFormData] = useState({
        shop_logo: settings.shop_logo,
        sale_receipt_note: settings.sale_receipt_note,
        shop_name: settings.shop_name,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log(file)
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSettingFormData({
                    ...settingFormData,
                    shop_logo: reader.result,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const submittedFormData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(submittedFormData.entries());

        router.post('settings', formJson, {
            forceFormData: true,
            onSuccess: (resp) => {
                Swal.fire({
                    title: "Success!",
                    text: "Successfully saved",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                });
            },
            onError: (errors) => {
                console.error("Submission failed with errors:", errors);
                console.log(formJson);
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Settings" />
            <form
                id="settings-form"
                encType="multipart/form-data"
                onSubmit={handleSubmit}
            >
            <Grid container flex flexDirection={'column'} spacing={2}>
                <Grid size={12}>
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            SHOP INFORMATION
                        </AccordionSummary>
                        <AccordionDetails>
                        <TextField
                                fullWidth
                                variant="outlined"
                                label={"Shop name"}
                                name="shop_name"
                                multiline
                                required
                                sx={{ mt: "1rem" }}
                                value={settingFormData.shop_name}
                                onChange={handleChange}
                            />

                            <Box sx={{display:'flex', width:'100%', justifyContent:'start', mt:'2rem'}}>
                            <Card sx={{ width: { xs: "100%", sm: 250 } }}>
                                <CardMedia
                                    sx={{ height: 200, contain:'content' }}
                                    image={settingFormData.shop_logo}
                                    title="shop logo"
                                />

                                <CardActions className="mt-0">
                                    {/* <Box sx={{ flexGrow: 1 }} /> */}
                                    <Button
                                        component="label"
                                        role={undefined}
                                        variant="contained"
                                        tabIndex={-1}
                                        startIcon={<CloudUploadIcon />}
                                        fullWidth
                                    >
                                        Upload shop logo
                                        <VisuallyHiddenInput
                                            type="file"
                                            onChange={handleFileChange}
                                            name="shop_logo"
                                        />
                                    </Button>
                                </CardActions>
                            </Card>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            RECEIPT PRINT
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{display:'flex', width:'100%', justifyContent:'center'}}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label={"Receipt note"}
                                name="sale_receipt_note"
                                multiline
                                required
                                sx={{ mt: "1rem" }}
                                value={settingFormData.sale_receipt_note}
                                onChange={handleChange}
                            />
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
                <Grid size={12} justifyContent={'end'} sx={{display:'flex'}}>
                    <Button type="submit" variant="outlined" size="large" color="success">UPDATE</Button>
                </Grid>
            </Grid>
            </form>
        </AuthenticatedLayout>
    );
}
