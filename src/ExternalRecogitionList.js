import { Alert, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Paper, Card, CardMedia, CardContent, CardActions, Button } from "@mui/material";

export const ExternalRecognitionList = () => {
    const [data, setData] = useState({
        loading: true,
        error: null,
        response: null,
    });

    useEffect(() => {
        axios.get("http://localhost:8080/recognition/api/external-recognition")
            .then(res => setData({
                loading: false,
                error: null,
                response: res.data
            })).catch(err => setData({
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
                    {data.response.map(r => <RecognitionCard title={r.title} description={r.description} />)}
                </Box>
            </Box>
        </Paper>
    )
}

const RecognitionCard = ({ title, description }) => {
    return (
        <Card sx={{ minHeight: "25vh", minWidth: "15vw", maxWidth: "25vw", marginTop: "2vh" }} >
            <CardMedia
                component="img"
                alt="green iguana"
                height="100"
                image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
            />

            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Like</Button>
                <Button size="small">Comment</Button>
                <Button size="small">Share</Button>
                <Button size="small">Learn More</Button>
            </CardActions>

        </Card>
    )
}