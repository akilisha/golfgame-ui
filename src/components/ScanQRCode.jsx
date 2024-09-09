import * as React from 'react';
import QRCode from 'qrcode';
import Box from '@mui/material/Box';

function QRCodeContainer({ children }) {
    return (
        <Box component="main" sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            {children}
        </Box>
    )
}

export default function ScanQRCode() {

    const text = window.location?.origin;
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        QRCode.toCanvas(canvasRef.current, text, { width: 480 }, function (error) {
            if (error) console.error(error)
            console.log(text);
        })

        return () => {
            console.log('unload canvas');
        }
    }, []);


    return (
        <QRCodeContainer>
            <canvas ref={canvasRef} style={{ margin: '10px auto' }}></canvas>
        </QRCodeContainer>
    )
}