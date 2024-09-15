import { createContext, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    supabase, upsertPlayer, deletePlayer, selectPlayers, upsertScores,
    tallyScores, clearScores, selectAccount, updateAccount, deleteAccount,
    upsertLocation, downloadScoresHistory, uploadScoresHistory
} from '../service/suparepo';

export const AppContext = createContext(null);

export const GOLFING_MODE = 'golfing';
export const PROFILE_MODE = 'profile';
export const DELETED_MODE = 'deleted';
export const HISTORY_MODE = 'history';
export const LOCATION_KEY = 'selected-golf-location';
export const HISTORY_KEY = 'scores-history';

const initialState = {
    mode: GOLFING_MODE,
    players: [],
    hole: 0,
    maxHoles: Number(import.meta.env.VITE_MAX_GAME_HOLES || 18),
    location: JSON.parse(sessionStorage.getItem(LOCATION_KEY)) || null,
    history: JSON.parse(sessionStorage.getItem(HISTORY_KEY)) || [],
}

export function AppProvider({ children }) {

    const [state, setState] = useState(initialState);

    const [session, setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
        return () => subscription.unsubscribe();
    }, []);

    function setMode(mode) {
        setState(state => ({
            ...state,
            mode
        }))
    }

    function setHole(hole) {
        setState(state => ({
            ...state,
            hole
        }))
    }

    function setLocation(location) {
        if (location) {
            sessionStorage.setItem(LOCATION_KEY, JSON.stringify(location))
        }

        setState(state => ({
            ...state,
            location
        }));

        //if session is available, update remote database
        if (session && location) {
            const { name, address, lat, lng } = location;
            upsertLocation({ name, address, latitude: lat, longitude: lng })
        }
    }

    function setHistory(history) {
        if (location) {
            sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history))
        }

        setState(state => ({
            ...state,
            history
        }));
    }

    function closeAccount() {
        //if session is available, update remote database
        if (session) {
            deleteAccount({ organizer: session.user.id })
        }
    }

    function updateProfile({ firstName, lastName, phoneNum }) {
        //if session is available, update remote database
        if (session) {
            updateAccount({ organizer: session.user.id, firstName, lastName, phoneNum })
        }
    }

    async function fetchProfile() {
        //if session is available, update remote database
        if (session) {
            return await selectAccount({ organizer: session.user.id })
        }
    }

    async function fetchPlayers() {
        //if session is available, update remote database
        if (session) {
            return await selectPlayers({ organizer: session.user.id })
        }
    }

    function addPlayer({ player, hole, score }) {
        setState(curr => {
            if (curr.players.some(pl => pl.name === player)) {
                const updatedPlayers = curr.players.map(pl => {
                    if (pl.name === player) {
                        pl.scores[hole - 1] = score;
                    }
                    return pl;
                });
                return ({ ...curr, players: updatedPlayers });
            }
            else {
                const scores = new Array(initialState.maxHoles);
                scores.fill(0);
                return ({ ...curr, players: [...curr.players, { name: player, scores }] })
            }
        });

        //if session is available, update remote database
        if (session && player) {
            upsertPlayer({ organizer: session.user.id, player })
        }
    }

    function dropPlayer(name) {
        setState(state => ({
            ...state,
            players: state.players.filter(pl => pl.name !== name)
        }));

        //if session is available, update remote database
        if (session && name) {
            deletePlayer({ organizer: session.user.id, player: name })
        }
    }

    function updateScores(hole, strokes) {
        setState(state => ({
            ...state,
            players: state.players.map(pl => {
                const score = strokes[pl.name];
                pl.scores[hole] = Number(score);
                return pl;
            }),
            hole: hole + 1,
        }));

        //if session is available, update remote database
        if (session && strokes) {
            upsertScores({ organizer: session.user.id, hole, strokes })
        }
    }

    function resetScores() {
        setState(initialState);

        //if session is available, clear remote database
        if (session) {
            const { location, players, history } = state;
            clearScores({ organizer: session.user.id, location, players, history })
        }
    }

    function playerTally(name) {
        const player = state.players.find(pl => pl.name === name);
        if (player) {
            return player.scores.reduce((prev, curr) => {
                const cummulative = prev + curr
                return cummulative;
            }, 0)
        }
        return 0;
    }

    function sessionTally(player) {
        //if session is available, tally scores from remote database
        if (session && player) {
            return tallyScores({ organizer: session.user.id, player })
        }
    }

    async function createPaymentIntent({ amount }) {

        return await fetch(`${import.meta.env.VITE_SUPABASE_URL}/${import.meta.env.VITE_FETCH_PAYMENT_INTENT}`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ amount })
        })
            .then(res => res.json());
    }

    async function createSetupIntent({ customerId }) {

        return await fetch(`${import.meta.env.VITE_SUPABASE_URL}/${import.meta.env.VITE_FETCH_SETUP_INTENT}`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ customerId })
        })
            .then(res => res.json());
    }

    // Make sure to call `loadStripe` outside of a component’s render to avoid
    // recreating the `Stripe` object on every render.
    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUB_KEY);

    return (
        <AppContext.Provider value={{
            ...state, supabase, session, fetchProfile, updateProfile, closeAccount, fetchPlayers, addPlayer, dropPlayer, updateScores,
            playerTally, sessionTally, resetScores, setMode, setHole, setLocation, setHistory, stripePromise, createPaymentIntent, createSetupIntent,
            downloadScoresHistory, uploadScoresHistory,
        }}>
            {children}
        </AppContext.Provider>
    )
}