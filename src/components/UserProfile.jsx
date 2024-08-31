import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { AppContext, DELETED_MODE } from '../state/AppContext';

function ConfirmDialog({ open, handleConfirm }) {

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={() => handleConfirm(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Proceed with extreme caution
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to proceed? This action will delete everything related to this user.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleConfirm(false)}>Cancel</Button>
                    <Button onClick={() => handleConfirm(true)} autoFocus>Confirm</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default function UserProfile() {

    const [open, setOpen] = React.useState(false);
    const [confirmed, setConfirmed] = React.useState(false);
    const { closeAccount, updateProfile, fetchProfile, setMode } = React.useContext(AppContext);
    const [errors, setErrors] = React.useState({
        first: '',
        last: '',
        phone: '',
    });
    const [profile, setProfile] = React.useState(null);

    const handleSubmit = (event) => {
        event.preventDefault();

        const { firstName, lastName, phoneNum } = profile;

        setErrors(curr => ({
            ...curr,
            first: (firstName && firstName.trim().length > 0) ? '' : 'firstName cannot be empty',
            last: (lastName && lastName.trim().length > 0) ? '' : 'lastName cannot be empty',
            phone: (phoneNum && phoneNum.trim().length > 0) ? '' : 'phoneNum cannot be empty',
        }));

        if (firstName && firstName.trim().length > 0 &&
            lastName && lastName.trim().length > 0 &&
            phoneNum && phoneNum.trim().length > 0) {
            updateProfile({ firstName, lastName, phoneNum })
        }
    };

    const handleConfirm = (status) => {
        setOpen(false);
        setConfirmed(status)
    }

    const handleDeleteAccount = (event) => {
        event.preventDefault();
        setOpen(true);
    }

    React.useEffect(() => {
        if (confirmed) {
            closeAccount();
            setConfirmed(false);
            setMode(DELETED_MODE);
        }
    }, [confirmed]);

    React.useEffect(() => {
        (async function () {
            const { first_name: firstName, last_name: lastName, phone_number: phoneNum } = await fetchProfile();
            setProfile({ firstName, lastName, phoneNum })
        })();
    }, []);

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
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Profile
            </Typography>
            <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            autoFocus
                            label={"First Name"}
                            error={errors.first !== ''}
                            helperText={errors.first}
                            value={profile?.firstName || ''}
                            onChange={e => setProfile(form => ({ ...form, firstName: e.target.value }))}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            label={"Last Name"}
                            error={errors.last !== ''}
                            helperText={errors.last}
                            value={profile?.lastName || ''}
                            onChange={e => setProfile(form => ({ ...form, lastName: e.target.value }))}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            label={"Phone Number"}
                            error={errors.phone !== ''}
                            helperText={errors.phone}
                            value={profile?.phoneNum || ''}
                            onChange={e => setProfile(form => ({ ...form, phoneNum: e.target.value }))}
                        />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Update
                </Button>
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Link href="#" variant="body2" onClick={handleDeleteAccount}>
                            Delete my account
                        </Link>
                    </Grid>
                </Grid>
            </Box>
            <ConfirmDialog open={open} handleConfirm={handleConfirm} />
        </Box>
    );
}