import { Alert, Button, Paper, Typography } from "@mui/material"
import { useState } from "react";
import axios from "axios";

import { Card, Box, TextField, ButtonGroup } from "@mui/material";
import { ExternalRecognitionCard } from "./ExternalRecognitionCard";
import DeleteIcon from '@mui/icons-material/Delete';

export const AdminForm = () => {
    const [flowState, setFlowState] = useState("FORM");
    const [formState, setFormState] = useState({
        externalLinks: [""]
    });
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

        formState.externalLinks = formState.externalLinks.filter(link => link !== "");
        setFormState({ ...formState });
        setFlowState("PREVIEW");
    }

    const backToEdit = () => {
        formState.externalLinks.push("");
        setFormState({ ...formState });
        setFlowState("FORM");
    }

    const handleExternalLinkChange = (e, i) => {
        formState.externalLinks[i] = e.target.value;
        if (i === (formState.externalLinks.length - 1)) {
            formState.externalLinks.push("");
        }
        setFormState({ ...formState });
    }

    const deleteExternalLink = (i) => {
        formState.externalLinks.splice(i, 1);
        if (formState.externalLinks.length === 0) {
            formState.externalLinks.push("");
        }
        setFormState({ ...formState });
    }

    const handlePreviewSumbit = (e) => {
        e.preventDefault();
        const aggExternalLinks = formState.externalLinks.filter(link => link !== "").join(", ");
        const payload = { ...formState, createdBy: 1234, externalLinks: aggExternalLinks};

        axios.post(`http://localhost:8080/recognition/api/external-recognition`, payload)
            .then(() => {
                setMsg("Recognition created successfully!");
                setTimeout(() => setMsg(""), 3000);
                setFlowState("FORM");
                setFormState({
                    externalLinks: [""]
                });
            }).catch(err => {
                setErr("Recognition creation failed! " + err);
                setTimeout(() => setErr(""), 3000);
            })
    }

    return (
        <Paper sx={{ width: "100%" }}>
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
                            <Box marginTop="2vh">
                                <Typography variant="body2">External Links</Typography>
                                <Box marginTop="2vh">
                                    {formState.externalLinks.map((link, i) => <Box display="flex">
                                        <TextField
                                            id="outlined-basic"
                                            label="external link"
                                            variant="outlined"
                                            name="externalLink"
                                            onChange={(e) => handleExternalLinkChange(e, i)}
                                            value={link}
                                            size="small"
                                            sx={{ marginTop: "1vh" }}
                                        />
                                        <Button size="small" color="error" sx={{ alignSelf: "center" }} onClick={() => deleteExternalLink(i)}>
                                            <DeleteIcon />
                                        </Button>
                                        </Box>)}
                                </Box>
                            </Box>
                            <Button variant="outlined" size="large" fullWidth sx={{ marginTop: "2vh" }} onClick={handleFormSumit}>
                                Preview
                            </Button>
                        </form>
                    )}

                    {flowState === "PREVIEW" && <Box>
                        <ExternalRecognitionCard  {...formState} />
                        <ButtonGroup fullwidth={true} sx={{ marginTop: "2vh", width: "100%" }} variant="outlined" aria-label="Basic button group">
                            <Button onClick={backToEdit}>Edit</Button>
                            <Button onClick={handlePreviewSumbit}>Submit</Button>
                        </ButtonGroup>
                    </Box>
                    }
                </Box>
            </Card>
        </Paper>
    )
}
