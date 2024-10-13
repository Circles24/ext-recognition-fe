import { Alert, Button, Paper, Typography } from "@mui/material"
import { useState } from "react";
import axios from "axios";

import { Card, Box, TextField } from "@mui/material";

export const AdminForm = () => {
    const [formState, setFormState] = useState({});
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState(fs => ({ ...fs, [name]: value }));
    }

    const handleSumbit = (e) => {
        e.preventDefault();
        console.log("submit", e);
        formState.createdBy = 1234;
        axios.post(`http://localhost:8080/recognition/api/external-recognition`, formState)
            .then(res => {
                setMsg("Recognition created successfully!");
                setTimeout(() => setMsg(""), 3000);
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
                <form>
                    <Box width="45vw" height="30vh" paddingLeft="2vw" paddingRight="2vw" paddingTop="2vh" paddingBottom="2vh">
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

                        <Button variant="outlined" size="large" fullWidth sx={{ marginTop: "2vh" }} onClick={handleSumbit}>
                            Submit
                        </Button>
                    </Box>
                </form>
            </Card>
        </Paper>
    )
}