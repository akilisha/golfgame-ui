import * as React from 'react';
import QRCode from 'qrcode';

export default function ScanQRCode({ text }) {

    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        QRCode.toCanvas(canvasRef.current, text, { width: 400 }, function (error) {
            if (error) console.error(error)
            console.log(text);
        })

        return () => {
            console.log('unload canvas');
        }
    }, []);


    return <canvas ref={canvasRef} style={{ margin: '10px auto' }}></canvas>
}