import { createContext, useState, useEffect } from 'react';
import { supabase, insertPlayer, deletePlayer, upsertScores, tallyScores, clearScores } from '../service/suparepo';

export const AppContext = createContext(null);

export const GUEST_MODE = 'guest';
export const NON_GUEST_MODE = 'non-guest';
export const LOCATION_MODE = 'location';

const initialState = {
    mode: LOCATION_MODE,
    players: [],
    hole: 0,
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

    function addPlayer(name, holes = 18) {
        const scores = new Array(holes);
        scores.fill(0);

        setState(state => ({
            ...state,
            players: [...state.players, { name, scores }]
        }));

        //if session is available, update remote database
        if (session && name) {
            insertPlayer({ organizer: session.user.id, player: name })
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
            clearScores({ organizer: session.user.id })
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

    return (
        <AppContext.Provider value={{ ...state, supabase, session, addPlayer, dropPlayer, updateScores, playerTally, sessionTally, resetScores, setMode }}>
            {children}
        </AppContext.Provider>
    )
}