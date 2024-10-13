import React from "react"
import { Card, CardMedia, CardActions, CardContent, Typography, Button, Box, Alert } from "@mui/material"

export const ExternalRecognitionCard = ({ title, description, externalLinks, videoLinks, images }) => {
    return (
        <Card  >
            <CardMedia
                component="img"
                alt="green iguana"
                height="200"
                image={(images && images.length > 0) ? images[0] : "https://mui.com/static/images/cards/contemplative-reptile.jpg"}
            />

            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {title}
                </Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {description}
                </Typography>

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

                {images !== null && images !== undefined && (images.length > 1) && (
                    <Box marginTop="2vh" display="flex" flexWrap="wrap">{
                        images.slice(1).map((img, i) => <Box sx={{ marginRight: "2vw", marginTop: "2vh" }}>
                            <img height="100vh" width="120vh" src={img} />
                        </Box>)
                    }</Box>
                )}

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