import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function insertPlayer({ organizer, player }) {
    const { error } = await supabase
        .from('mg_player')
        .insert({ organizer, player });
    if (error) {
        console.log(error)
    }
}

export async function deletePlayer({ organizer, player }) {
    const { error } = await supabase
        .from('mg_player')
        .delete()
        .eq('organizer', organizer)
        .eq('player', player)
        .is("location", null)
    if (error) {
        console.log(error)
    }
}

export async function upsertScores({ organizer, hole, strokes }) {
    const record = Object.keys(strokes).map(name => {
        return ({ organizer, player: name, hole: hole + 1, score: Number(strokes[name]) })
    });
    const { data, error } = await supabase
        .from('mg_player')
        .upsert(record, { onConflict: 'organizer, player, hole', ignoreDuplicates: false })
        .select()
    if (error) {
        console.log(error)
    }
    return data;
}

export async function tallyScores({ organizer, player }) {
    const { data, error } = await supabase
        .from('mg_player')
        .select()
        .eq('organizer', organizer)
        .eq('player', player)
        .is('location', null)
    if (error) {
        console.log(error)
        throw Error(error)
    }
    
    return data.map(pl => pl.score).reduce((prev, curr) => {
        return prev + curr;
    }, 0)
}

export async function clearScores({ organizer }) {
    const { error } = await supabase
        .from('mg_player')
        .delete()
        .eq('organizer', organizer)
        .is('location', null)
        .gt('hole', 1)
    if (error) {
        console.log(error)
    }
}

