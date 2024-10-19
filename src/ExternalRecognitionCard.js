import React, { useEffect, useState } from "react"
import { Card, CardMedia, CardActions, CardContent, Typography, Button, Box, Alert, Skeleton } from "@mui/material"
import axios from "axios";

export const ExternalRecognitionCard = ({ id, title, description, externalLinks, videoLinks, images, href }) => {

    console.log("recognition href", href);

    let mediaType = "HARDCODED";
    if (id !== undefined && id !== null) {
        mediaType = "FETCH";
    } else if (images !== undefined && images !== null && images.length > 0) {
        mediaType = "IMAGE_PROVIDED";
    }

    const [mediaData, setMediaData] = useState({
        loading: (id !== undefined && id !== null),
        response: null,
        err: null
    })

    useEffect(() => {
        if (mediaType !== "FETCH") {
            return;
        }

        const params = {
            refType: "EXTERNAL_RECOGNITION",
            refId: id,
        }

        const config = {
            params
        }

        axios.get(`http://localhost:8080/recognition/api/media`, config)
            .then(res =>
                setMediaData({
                    loading: false,
                    response: res.data,
                    err: null
                })
            ).catch(err => setMediaData({
                loading: false,
                response: null,
                err: err
            }));
    }, []);

    let imgDataList = null;
    let externalVideoList = null;
    if (mediaType === "FETCH" && mediaData.loading === false && mediaData.err === null && mediaData.response !== null) {
        imgDataList = mediaData.response.filter(media => media.type === "IMAGE");
        externalVideoList = mediaData.response.filter(media => media.type === "VIDEO");
        if (imgDataList.length === 0) {
            mediaType = "HARDCODED";
        }
    }

    return (
        <Card  >
            {mediaData.err !== null && <Alert color="error" >Error loading media: {mediaData.err.message}</Alert>}

            {mediaData.loading && <Skeleton variant="rectangular" height="200px" />}

            {mediaType === "HARDCODED" && (
                <a className="silent-link" href={href}>
                    <CardMedia
                        component="img"
                        alt="green iguana"
                        height="200"
                        image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
                    /></a>
            )}

            {mediaType === "IMAGE_PROVIDED" && (
                <a className="silent-link" href={href}><CardMedia
                    component="img"
                    alt="green iguana"
                    height="200"
                    image={images[0]}
                /></a>
            )}

            {mediaType === "FETCH" && imgDataList !== null && (
                <a className="silent-link" href={href}><CardMedia
                    component="img"
                    alt={imgDataList[0].fileName}
                    height="200"
                    src={`data:${imgDataList[0].mimeType};base64,${imgDataList[0].mediaContent}`}
                /></a>
            )}

            <CardContent>
                <a className="silent-link" href={href}>
                    <Typography gutterBottom variant="h5" component="div">
                        {title}
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {description}
                    </Typography>
                </a>

                {videoLinks !== null && videoLinks !== undefined && (videoLinks.length > 0) && (
                    <Box marginTop="2vh">
                        <Typography variant="body2">Video links</Typography>
                        <Box>
                            {videoLinks.map(link =>
                                <Box>
                                    <a href={link}>{link}</a>
                                </Box>
                            )}
                        </Box>
                    </Box>
                )}

                {mediaType === "FETCH" && externalVideoList !== null && externalVideoList !== undefined && (externalVideoList.length > 0) && (
                    <Box marginTop="2vh">
                        <Typography variant="body2">Video links</Typography>
                        <Box>
                            {externalVideoList.map(media =>
                                <Box>
                                    <a href={media.mediaUrl}>{media.mediaUrl}</a>
                                </Box>
                            )}
                        </Box>
                    </Box>
                )}


                {externalLinks !== null && externalLinks !== undefined && (externalLinks.length > 0) && (
                    <Box marginTop="2vh">
                        <Typography variant="body2">External reading links</Typography>
                        {externalLinks.map(link =>
                            <Box>
                                <a href={link}>{link}</a>
                            </Box>
                        )}
                    </Box>

                )}

                {mediaType === "IMAGE_PROVIDED" && images !== null && images !== undefined && (images.length > 1) && (
                    <Box marginTop="2vh" display="flex" flexWrap="wrap">{
                        images.slice(1).map((img, i) => <Box sx={{ marginRight: "2vw", marginTop: "2vh" }}>
                            <img height="100vh" width="120vh" src={img} />
                        </Box>)
                    }</Box>
                )}

                <a className="silent-link" href={href}>
                    {mediaType === "FETCH" && mediaType === "FETCH" && imgDataList !== null && imgDataList.length > 0 && (
                        <Box marginTop="2vh" display="flex" flexWrap="wrap">{
                            imgDataList.map((img) => <Box sx={{ marginRight: "2vw", marginTop: "2vh" }}>
                                <img height="100vh" width="120vh" src={`data:${img.mimeType};base64,${img.mediaContent}`} />
                            </Box>)
                        }</Box>
                    )}
                </a>

            </CardContent>
            <CardActions>
                <Button size="small">Like</Button>
                <Button size="small">Comment</Button>
                <Button size="small">Share</Button>
            </CardActions>
        </Card>
    )
}