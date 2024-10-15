import { Alert, Button, Paper, Typography, Badge } from "@mui/material"
import { useState, useRef } from "react";
import axios from "axios";

import { Card, Box, TextField, ButtonGroup } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ExternalRecognitionCard } from "./ExternalRecognitionCard";
import DeleteIcon from '@mui/icons-material/Delete';

export const AdminForm = () => {
    const [flowState, setFlowState] = useState("FORM");
    const [formState, setFormState] = useState({
        images: [],
        imageFiles: [],
        videoLinks: [""],
        externalLinks: [""]
    });
    const [msg, setMsg] = useState("");
    const [err, setErr] = useState("");
    const fileInputRef = useRef();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState(fs => ({ ...fs, [name]: value }));
    }

    const handleFormSumit = (e) => {
        e.preventDefault();
        if (!formState.title || !formState.description) {
            return;
        }

        formState.videoLinks = formState.videoLinks.slice(0, -1);
        formState.externalLinks = formState.externalLinks.filter(link => link !== "");
        setFormState({ ...formState });
        setFlowState("PREVIEW");
    }

    const backToEdit = () => {
        formState.videoLinks.push("");
        formState.externalLinks.push("");
        setFormState({ ...formState });
        setFlowState("FORM");
    }

    const handleVideoLinkChange = (e, i) => {
        formState.videoLinks[i] = e.target.value;
        if (i === (formState.videoLinks.length - 1)) {
            formState.videoLinks.push("");
        }
        setFormState({ ...formState });
    }

    const deleteVideoLink = (i) => {
        formState.videoLinks.splice(i, 1);
        if (formState.videoLinks.length === 0) {
            formState.videoLinks.push("");
        }
        setFormState({ ...formState });
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
        const payload = { title: formState.title, description: formState.description, createdBy: 1234, externalLinks: aggExternalLinks };

        axios.post(`http://localhost:8080/recognition/api/external-recognition`, payload)
            .then((res) => {
                setMsg("Recognition created successfully!");
                setTimeout(() => setMsg(""), 3000);

                if ((formState.images.length + formState.videoLinks.length) === 0) {
                    setFlowState("FORM");
                    setFormState({
                        images: [],
                        imageFiles: [],
                        videoLinks: [""],
                        externalLinks: [""]
                    });

                    return;
                }

                const refId = res.data.id;
                const refType = "EXTERNAL_RECOGNITION";
                const config = {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                }

                const formData = new FormData();
                formData.append("refType", refType);
                formData.append("refId", refId);
                formState.imageFiles.forEach(imgFile => formData.append("imageFiles", imgFile));
                formState.videoLinks.forEach(link => formData.append("videoLinks", link));
            
                axios.postForm('http://localhost:8080/recognition/api/media', formData, config)
                .then(() => {
                    setFlowState("FORM");
                    setFormState({
                        images: [],
                        imageFiles: [],
                        videoLinks: [""],
                        externalLinks: [""]
                    });    
                }).catch((err) => {
                    setErr("Media upload failed! " + err);
                    setTimeout(() => setErr(""), 3000);     
                })
            }).catch(err => {
                setErr("Recognition creation failed! " + err);
                setTimeout(() => setErr(""), 3000);
            })
    }

    const handleImageChange = (e) => {
        const { files } = e.target;
        const fileArr = Array.from(files);
        const imgUrls = fileArr.map(file => URL.createObjectURL(file));
        formState.images = formState.images.concat(imgUrls);
        formState.imageFiles = formState.imageFiles.concat(fileArr);
        setFormState({ ...formState });
    }

    const handleImageDrop = (i) => {
        formState.images.splice(i, 1);
        formState.imageFiles.splice(i, 1);
        setFormState({ ...formState });
    }

    return (
        <Paper sx={{ width: "100%" }}>
            {msg && <Alert sx={{ marginBottom: "2vh" }} variant="outlined" color="info">{msg}</Alert>}
            {err && <Alert sx={{ marginBottom: "2vh" }} variant="outlined" color="error">{err}</Alert>}
            <Card sx={{ width:"100%" }}>
                <Box paddingLeft="2vw" paddingRight="2vw" paddingTop="2vh" paddingBottom="2vh">

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
                                <Button variant="outlined" onClick={() => fileInputRef.current.click()}>
                                    <Box marginRight="0.5vw">Upload Images</Box>
                                    <CloudUploadIcon sx={{ alignSelf: "center" }} />
                                </Button>
                                <input
                                    type="file"
                                    id="file"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    multiple
                                    hidden
                                    ref={fileInputRef}
                                />
                            </Box>
                            
                            {formState.images.length > 0 && (
                                <Box marginTop="2vh" display="flex" flexWrap="wrap">{
                                    formState.images.map((img, i) => <Box sx={{ marginRight: "2vw", marginTop: "2vh" }}>
                                        <Badge badgeContent={<Button size="small" color="error" onClick={() => handleImageDrop(i)}>
                                            <DeleteIcon color="error" />
                                        </Button>}>
                                            <img height="100vh" width="120vh" src={img} />
                                        </Badge>
                                    </Box>)
                                }</Box>
                            )}
                            
                            <Box marginTop="2vh">
                            <Typography variant="body2">Video links</Typography>
                            <Box display="flex" flexWrap="wrap">
                                    {formState.videoLinks.map((link, i) => <Box display="flex">
                                        <TextField
                                            id="outlined-basic"
                                            label="Video link"
                                            variant="outlined"
                                            name="externalLink"
                                            onChange={(e) => handleVideoLinkChange(e, i)}
                                            value={link}
                                            size="small"
                                            sx={{ marginTop: "1vh" }}
                                        />
                                        <Button size="small" color="error" sx={{ alignSelf: "center" }} onClick={() => deleteVideoLink(i)}>
                                            <DeleteIcon />
                                        </Button>
                                    </Box>)}
                                </Box> 
                            </Box>

                            <Box marginTop="2vh">
                                <Typography variant="body2">External Links</Typography>
                                <Box display="flex" flexWrap="wrap">
                                    {formState.externalLinks.map((link, i) => <Box display="flex">
                                        <TextField
                                            id="outlined-basic"
                                            label="External link"
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
