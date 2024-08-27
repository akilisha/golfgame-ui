import * as React from 'react';
import { AppContext } from '../../state/AppContext';
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import ScanQRCode from '../ScanQRCode';

export default function Login() {

    const baseUrl = import.meta.env.BASE_URL;
    const { supabase, session } = React.useContext(AppContext);

    return (<div style={{
        width: "400px",
        margin: "40px auto"
    }}> {!session ?

        <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={["google"]}
        />
        :
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '30px'
        }}>
            <button style={{ display: 'block' }} onClick={() => supabase.auth.signOut()}>Sign out</button>
            <ScanQRCode text={baseUrl} />;
        </div>
        }</div>
    )
}