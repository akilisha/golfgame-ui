import * as React from 'react';
import { AppContext } from '../../state/AppContext';
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import Milestones from './Milestones';

export default function Login() {

    const { supabase, session } = React.useContext(AppContext);

    return (<div style={{
        width: "400px",
        margin: "40px auto"
    }}> {!session ?

        <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={["google"]}
            redirectTo={window.location?.origin}
        />
        :
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '30px'
        }}>
            <Milestones />
        </div>
        }</div>
    )
}