import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Box } from "@mui/material";
import axios from "axios";
import { ExternalRecognitionCard } from "./Card";
import { CommentSection } from "../common/CommentSection";

export const ExternalRecognitionView = () => {
    const [recognitionData, setRecognitionData] = useState({
        loading: true,
        data: null,
        err: null
    });

    const params = useParams();
    const id = params.id;

    useEffect(() => {
        if (!recognitionData.loading) {
            return;
        }

        axios.get(`http://localhost:8080/recognition/api/external-recognition/${id}`)
            .then(res => {
                const externalLinks = res.data.externalLinks.split(",")
                    .map(s => s.trim())
                    .filter(s => s !== "");

                setRecognitionData({
                    loading: false,
                    data: {
                        ...res.data, externalLinks
                    },
                    err: null,
                })
            }).catch(err => {
                setRecognitionData({
                    loading: false,
                    data: null,
                    err: "Error fetching external recognition media " + err.message,
                })
            })
    }, []);

    if (recognitionData.loading) {
        return <Box>Loading...</Box>
    }

    if (recognitionData.err) {
        return <Box>
            <Alert color="error" >{recognitionData.err}</Alert>
        </Box>
    }

    return (
        <Box width="80%">
            <ExternalRecognitionCard {...recognitionData.data} />
            <Box marginTop="2vh">
                <CommentSection />
            </Box>
        </Box>
    )
}