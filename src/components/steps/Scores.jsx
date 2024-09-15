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
import Alert from '@mui/material/Alert';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function SetMaxHolesModal({ open, handleClose, maxHoles, setMaxHoles }) {

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData).entries());
          const newMaxHoles = formJson.newMaxHoles;
          console.log(newMaxHoles);
          setMaxHoles(Number(newMaxHoles))
          handleClose();
        },
      }}
    >
      <DialogTitle>Max Targets/Holes</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Change the max number of holes
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          name="newMaxHoles"
          label="New Max Holes"
          type="number"
          defaultValue={maxHoles}
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit">Update</Button>
      </DialogActions>
    </Dialog>
  )
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Scores() {

  const { players, maxHoles, hole, setHole, setMaxHoles, updateScores } = React.useContext(AppContext);
  const [valid, setValid] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  //create refs for text inputs to update scores/hole 
  const refs = players.reduce((prev, curr) => {
    prev[curr.name] = React.useRef(null)
    return prev;
  }, {})

  const onChangeMaxHoles = event => {
    setOpen(event.target.checked);
  }

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
                  {hole + 1 > maxHoles ? "No more targets" : `Hole ${hole + 1} of ${maxHoles}`}
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
                      inputRef={refs[row.name]}
                      label="Strokes"
                      variant="outlined"
                      name={row.name}
                      autoComplete={'off'}
                      type='number'
                      error={valid[row.name] != undefined && valid[row.name] !== ''}
                      helperText={valid[row.name]}
                      onFocus={event => event.target.value = ''}
                      disabled={hole === maxHoles} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {players?.length === 0 ?
          <Alert severity="error" sx={{ mt: 2 }}>The game has no players yet</Alert>
          :
          hole < maxHoles ?
            <>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Save then Next
              </Button>
              <FormControlLabel control={<Checkbox color="primary" onChange={onChangeMaxHoles} checked={open} />}
                label="Change the number of targets/holes"
              />
            </>
            :
            <Alert severity="success" sx={{ mt: 2 }}>End of game reached</Alert>
        }
      </Box>
      <SetMaxHolesModal open={open} handleClose={handleClose} maxHoles={maxHoles} setMaxHoles={setMaxHoles} />
    </div>

  )
}