import * as React from 'react';
import QRCode from 'qrcode';
import { Paper, Typography } from '@mui/material';

export default function Launcher({ text }) {

    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        QRCode.toCanvas(canvasRef.current, text, { width: 400 }, function (error) {
            if (error) console.error(error)
            console.log(text);
        });

        return () => {
            console.log('unload canvas');
        }
    }, []);

    return (
        <Paper elevation={3} sx={{mt: 4}} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
            <canvas ref={canvasRef}></canvas>
            <Typography variant='h5' component={"div"} sx={{ p: 2, color: 'primary.main', textAlign: 'center' }}>
                Scan with your phone camera to launch the app
            </Typography>
        </Paper>
    )
}