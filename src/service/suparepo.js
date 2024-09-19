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
    if (error) {
        console.log(error)
    }
}

export async function upsertLocation({ name, address, latitude, longitude }) {
    const record = ({ name, address, latitude, longitude });
    const { data, error } = await supabase
        .from('mg_location')
        .upsert(record, { onConflict: 'latitude, longitude', ignoreDuplicates: false })
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
    if (error) {
        console.log(error)
        throw Error(error)
    }

    return data.map(pl => pl.score).reduce((prev, curr) => {
        return prev + curr;
    }, 0)
}

export async function clearScores({ organizer, location, players, history }) {
    try {
        uploadScoresHistory({ organizer, location, players, history });

        const { error } = await supabase.rpc('game_clean_up', { organizer })
        if (error) {
            console.log(error)
            throw Error(error)
        }
    } catch (err) {
        console.log(`Error trying to clear scores - ${err.message}`)
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

export async function deleteAccount({ organizer }) {
    const { error: err1 } = await supabase.auth.signOut()

    if (!err1) {
        const { error: err2 } = await supabase.rpc("delete_account", { organizer_input: organizer })

        if (err2) {
            console.log(err2)
            throw Error(err2)
        }
    }
}

export async function selectPlayers({ organizer }) {
    const { data: players, error } = await supabase
        .from('mg_player')
        .select('player,hole,score', { distinct: true })
        .eq('organizer', organizer);

    if (error) {
        console.log(error)
        throw Error(error)
    }

    return players;
}

export async function uploadScoresHistory({ organizer, history }) {
    const bucketPath = `/${import.meta.env.VITE_ROOT_SCORES_BUCKET}/${organizer}`;
    const targetFile = import.meta.env.VITE_SCORES_HISTORY_FILE;

    const blob = new Blob([JSON.stringify(history, null, 2)], {
        type: "application/json",
    });

    const { data: updateRes, error: updateErr } = await supabase.storage
        .from(bucketPath)
        .update(targetFile, blob, {
            cacheControl: '3600',
            upsert: true
        });

    if (updateErr && updateErr.message === "Object not found") {
        const { data: uploadRes, error: uploadErr } = await supabase.storage
            .from(bucketPath)
            .upload(targetFile, blob);


        if (uploadErr) {
            console.log(`upload failure: ${uploadErr.message}`)
            throw Error(uploadErr);
        }

        console.log(`upload new file result: ${JSON.stringify(uploadRes)}`)
    }

    console.log(`update existing file result: ${JSON.stringify(updateRes)}`)
}

export async function downloadScoresHistory({ organizer }) {
    const bucketPath = `/${import.meta.env.VITE_ROOT_SCORES_BUCKET}/${organizer}`;
    const targetFile = import.meta.env.VITE_SCORES_HISTORY_FILE;

    const { data, error } = await supabase.storage
        .from(bucketPath)
        .download(targetFile);

    if (error) {
        console.log(error);
        return [];
    }

    try {
        const text = await data.text();
        const parsed = JSON.parse(text);
        return Array.isArray(parsed) ? parsed : [];
    }
    catch (e) {
        return [];
    }
}