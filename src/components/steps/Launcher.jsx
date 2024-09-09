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


    return <div style={{
        width: "400px",
        margin: "40px auto"
    }}>
        <canvas ref={canvasRef}></canvas>
        <Paper elevation={3} style={{displa: 'flex', justifyContent: 'center'}}>
            <Typography variant='"subtitle1' component={"div"} sx={{p: 2, color: 'primary.main'}}>Scan with your phone camera to launch the app</Typography>
        </Paper>
    </div>
}