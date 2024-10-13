import { Alert, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Paper } from "@mui/material";
import { ExternalRecognitionCard } from "./ExternalRecognitionCard";

export const ExternalRecognitionList = () => {
    const [data, setData] = useState({
        loading: true,
        error: null,
        response: null,
    });

    useEffect(() => {
        axios.get("http://localhost:8080/recognition/api/external-recognition")
            .then(res => {
                const recognitions = res.data.map(r => {
                    let externalLinks = [];
                    if (r.externalLinks !== "" && r.externalLinks !== undefined && r.externalLinks !== null) {
                        externalLinks = r.externalLinks.split(",")
                            .map(link => link.trim())
                            .filter(link => link !== "");
                    }

                    return { ...r, externalLinks }
                });

                console.log("recognitions", recognitions);
                setData({
                    loading: false,
                    error: null,
                    response: recognitions
                });
            }).catch(err => setData({
                loading: false,
                error: "Error loading external recognitions " + err,
                response: null
            }))
    }, [])

    if (data.loading) {
        return <Box>Loading external recognitions ...</Box>
    }

    if (data.error) {
        return <Box>
            <Alert color="error" variant="outlined">{data.error}</Alert>
        </Box>
    }

    return (
        <Paper>
            <Box marginLeft="2vw">
                <Box>
                    <Typography variant="h6">External Recognitions</Typography>
                </Box>
                <Box>
                    {data.response.map(r =>
                        <Box sx={{ minHeight: "25vh", minWidth: "15vw", maxWidth: "25vw", marginTop: "2vh" }}>
                            <ExternalRecognitionCard {...r} />
                        </Box>
                    )}
                </Box>
            </Box>
        </Paper>
    )
}

