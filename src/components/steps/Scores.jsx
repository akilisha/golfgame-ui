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
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import IconButton from '@mui/material/IconButton';

export default function Scores() {

  const { players, maxHoles, hole, setHole, updateScores } = React.useContext(AppContext);
  const [valid, setValid] = React.useState({});
  //create refs for text inputs to update scores/hole 
  const refs = players.reduce((prev, curr) => {
    prev[curr.name] = React.useRef(null)
    return prev;
  }, {})

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

  React.useEffect(() => {
    players.forEach(player => {
      if (refs[player.name].current) {
        refs[player.name].current.value = player.scores[hole]
      }
    })
  }, [hole])

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
                <TableCell align="right">
                  {hole > 0 && <IconButton aria-label="previous" size="small" color="secondary" sx={{ mr: 1 }} onClick={() => setHole(hole - 1)}><RemoveIcon /></IconButton>}
                  Hole {hole + 1}
                  {hole < maxHoles && <IconButton aria-label="next" size="small" color="primary" sx={{ ml: 1 }} onClick={() => setHole(hole + 1)}><AddIcon /></IconButton>}
                </TableCell>
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
                    <TextField
                      onFocus={() => refs[row.name].current.select()}
                      inputRef={refs[row.name]}
                      label="Strokes"
                      variant="outlined"
                      name={row.name}
                      autoComplete={'off'}
                      type='number'
                      error={valid[row.name] != undefined && valid[row.name] !== ''}
                      helperText={valid[row.name]} />
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