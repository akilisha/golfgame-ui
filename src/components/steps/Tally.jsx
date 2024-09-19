import * as React from 'react';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { AppContext } from '../../state/AppContext';

export default function Tally({ handleReset }) {

  const { players, maxHoles, playerTally, resetScores } = React.useContext(AppContext);

  function onReset() {
    resetScores();
    handleReset();
  }

  return (
    <div style={{
      margin: "40px auto 0"
    }}>
      <TableContainer component={Paper}>
        <Table sx={{}} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Player</TableCell>
              {[...Array(maxHoles).keys()].map(hole => <TableCell key={hole}>{hole + 1}</TableCell>)}
              <TableCell align="right">Final</TableCell>
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
                {row.scores.map((score, i) => <TableCell key={i}>{score}</TableCell>)}
                <TableCell align="right">{playerTally(row.name)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button onClick={onReset}>Save & Reset</Button>
      </Box>
    </div>

  )
}