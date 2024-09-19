import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

export default function UserDeleted() {

    const navigate = useNavigate();

    return (
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <HeartBrokenIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Account Deleted
            </Typography>

            <Typography variant={"body1"} sx={{ mt: 3 }}>
                It's sad to see you go, but you can always register a new account anytime again. By leaving however, the app will not be able to:
            </Typography>

            <List sx={{ width: '100%', maxWidth: 480, bgcolor: 'background.paper', borderStyle: 'dotted', mb: 3 }}>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <ImageIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Restore" secondary="restore your current players if the screen is refreshed" />
                </ListItem>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <WorkIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Retrieve" secondary="retrieve your previous players when you log back in next time" />
                </ListItem>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <BeachAccessIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Rewards" secondary="claim rewards in ongoing promotions at select locations" />
                </ListItem>
            </List>
            <Stack spacing={2} direction="row">
                <Button variant="outlined" onClick={() => navigate("/")}>Ok</Button>
            </Stack>
        </Box>
    );
}