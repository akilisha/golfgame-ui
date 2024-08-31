import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { AppContext } from '../../state/AppContext';

export default function Players() {

  const { session, players, addPlayer, dropPlayer, fetchPlayers } = React.useContext(AppContext)
  const [error, setError] = React.useState('')

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('player');
    
    if (!name || name.trim().length === 0) {
      setError(`player name is missing`)
    }
    else if (players.length > 0 && players.some(pl => pl.name === name)) {
      setError(`player '${name}' already exists`)
    }
    else {
      addPlayer({player: name});
      setError('')
    }
    event.currentTarget.reset();
  };

  React.useEffect(() => {
    if(session){
      (async function(){
        const players = await fetchPlayers();
        for(let row of players){
          addPlayer(row)
        }
      })();
    }
  }, [session]);

  return (
    <div style={{
      width: "400px",
      margin: "40px auto"
    }}>
      <TableContainer component={Paper}>
        <Table sx={{}} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Player</TableCell>
              <TableCell align="right">Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map((row) => (
              <TableRow
                key={row.name}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <IconButton color="secondary" aria-label="drop player" size='small' onClick={() => dropPlayer(row.name)}>
                    <HighlightOffIcon />
                  </IconButton>
                  {row.name}
                </TableCell>
                <TableCell align="right">{0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="player"
          label="Player Name"
          name="player"
          autoComplete="player"
          autoFocus
          error={error !== ''}
          helperText={error}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Add
        </Button>
      </Box>
    </div>

  )
}