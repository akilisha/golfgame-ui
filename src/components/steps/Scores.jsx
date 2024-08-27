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
import { AppContext } from '../../state/AppContext';

export default function Scores() {

  const { players, hole, updateScores } = React.useContext(AppContext);
  const [valid, setValid] = React.useState({})

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    //validate
    for (const pair of data.entries()) {
      if (pair[1] === '') {
        setValid(v => ({ ...v, [pair[0]]: `${pair[0]} should not be empty` }));
        return;
      }
      else {
        setValid(v => ({ ...v, [pair[0]]: '' }));
      }
    }

    //submit validated
    const scores = players.reduce((prev, curr) => {
      const strokes = data.get(curr.name);
      prev[curr.name] = strokes;
      return prev;
    }, {});
    updateScores(hole, scores)
    event.currentTarget.reset();
  };

  return (
    <div style={{
      width: "400px",
      margin: "40px auto"
    }}>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TableContainer component={Paper}>
          <Table sx={{}} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Player</TableCell>
                <TableCell align="right">Hole {hole + 1}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {players.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">
                    <TextField label="Strokes" variant="outlined" name={row.name} autoComplete={'off'} type='number' error={valid[row.name] != undefined && valid[row.name] !== ''} helperText={valid[row.name]} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </Box>
    </div>

  )
}