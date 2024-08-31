import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function upsertPlayer({ organizer, player, hole }) {
    const { error } = await supabase
        .from('mg_player')
        .upsert({ organizer, player, hole }, { onConflict: 'organizer, player, hole', ignoreDuplicates: true });
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

export async function upsertLocation({ name, address, location }) {
    //TODO: NOT YET IMPLEMENTED FOR LOCATION
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

export async function selectAccount({ organizer }) {
    let { data: profile, error } = await supabase
        .from('mg_profile')
        .select('*')
        .eq('id', organizer);

    if (error) {
        console.log(error)
        throw Error(error)
    }

    return profile[0];
}

export async function updateAccount({ organizer, firstName, lastName, phoneNum }) {
    const { data, error } = await supabase
        .from('mg_profile')
        .update({ first_name: firstName, last_name: lastName, phone_number: phoneNum })
        .eq('id', organizer)
        .select()

    if (error) {
        console.log(error)
        throw Error(error)
    }

    console.log('updated profile', data)
}

export async function deleteAccount({organizer}) {
    const { error: err1 } = await supabase.auth.signOut()

    if (!err1) {
        const { error: err2 } = await supabase.rpc("delete_account", {organizer_input: organizer})

        if (err2) {
            console.log(err2)
            throw Error(err2)
        }
    }
}

export async function selectPlayers({ organizer }) {
    let { data: players, error } = await supabase
        .from('mg_player')
        .select('player,hole,score', { distinct: true })
        .eq('organizer', organizer);

    if (error) {
        console.log(error)
        throw Error(error)
    }

    return players;
}

