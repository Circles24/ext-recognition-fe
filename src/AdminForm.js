import { Alert, Button, Paper, Typography } from "@mui/material"
import { useState } from "react";
import axios from "axios";

import { Card, Box, TextField, ButtonGroup } from "@mui/material";
import { ExternalRecognitionCard } from "./ExternalRecognitionCard";

export const AdminForm = () => {
    const [flowState, setFlowState] = useState("FORM");
    const [formState, setFormState] = useState({});
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState(fs => ({ ...fs, [name]: value }));
    }

    const handleFormSumit = (e) => {
        e.preventDefault();
        if (!formState.title || !formState.description) {
            return;
        }

        if (flowState === "FORM") {
            setFlowState("PREVIEW");
            return;
        }
    }

    const handlePreviewSumbit = (e) => {
        e.preventDefault();
        formState.createdBy = 1234;
        axios.post(`http://localhost:8080/recognition/api/external-recognition`, formState)
            .then(res => {
                setMsg("Recognition created successfully!");
                setTimeout(() => setMsg(""), 3000);
                setFlowState("FORM");
                setFormState({});
            }).catch(err => {
                setErr("Recognition creation failed!");
                setTimeout(() => setErr(""), 3000);
            })
    }

    return (
        <Paper sx={{ width: "fit-content", height: "fit-content" }}>
            {msg && <Alert sx={{ marginBottom: "2vh" }} variant="outlined" color="info">{msg}</Alert>}
            {err && <Alert sx={{ marginBottom: "2vh" }} variant="outlined" color="error">{err}</Alert>}
            <Card>
                <Box width="45vw" paddingLeft="2vw" paddingRight="2vw" paddingTop="2vh" paddingBottom="2vh">

                    {flowState === "FORM" && (
                        <form>
                            <Typography variant="h6" marginBottom="2vh">External Recognition</Typography>
                            <Box marginBottom="2vh">
                                <TextField
                                    required
                                    id="outlined-basic"
                                    label="Title"
                                    variant="outlined"
                                    name="title"
                                    sx={{ width: "fit-content", height: "fit-content" }}
                                    value={formState.title}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Box>
                            <Box>
                                <TextField
                                    required
                                    id="outlined-basic"
                                    label="Description"
                                    variant="outlined"
                                    name="description"
                                    onChange={handleChange}
                                    value={formState.description}
                                    fullWidth
                                    multiline={true}
                                    size="large"
                                />
                            </Box>
                            <Button variant="outlined" size="large" fullWidth sx={{ marginTop: "2vh" }} onClick={handleFormSumit}>
                                Preview
                            </Button>
                        </form>
                    )}

                    {flowState === "PREVIEW" && <Box>
                        <ExternalRecognitionCard title={formState.title} description={formState.description} />
                        <ButtonGroup fullwidth={true} sx={{ marginTop: "2vh", width: "100%" }} variant="outlined" aria-label="Basic button group">
                            <Button onClick={() => setFlowState("FORM")}>Edit</Button>
                            <Button onClick={handlePreviewSumbit}>Submit</Button>
                        </ButtonGroup>
                    </Box>
                    }
                </Box>
            </Card>
        </Paper>
    )
}
