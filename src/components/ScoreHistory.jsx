import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Avatar, Typography } from '@mui/material';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import { AppContext } from '../state/AppContext';

export default function ScoreHistory() {

    const { history, } = React.useContext(AppContext);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    // Avoid a layout jump when reaching the last page with empty history.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - history.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (<Box
        sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}
    >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <ManageHistoryIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
            Scores History
        </Typography>

        {history?.length > 0 ? (
            <Paper sx={{ width: '100%', mt: 2 }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                        <caption>
                            Historical scores are organized by location and participants, and then ordered by the date played, starting from the most recent
                        </caption>
                        {(rowsPerPage > 0
                            ? history.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : history
                        ).map((row, i) => (
                            <TableBody key={i} style={{ border: '1px solid' }}>
                                <TableRow style={{ backgroundColor: '#8BC34A' }}>
                                    <TableCell colSpan={row.players[0].scores.length}>
                                        {row.location} {row?.date ? `on ${row.date}` : ''}</TableCell>
                                </TableRow>

                                <TableRow>
                                    {[...new Array(row.players[0].scores.length).keys()].map(n => <TableCell key={n}>
                                        <i style={{ fontSize: '0.8em', fontWeight: 'bold', color: 'red' }}>{n + 1}</i>
                                    </TableCell>)}
                                </TableRow>
                                {
                                    row.players.map(player => (
                                        <>
                                            <TableRow key={player.name} style={{ backgroundColor: '#ddd' }}>
                                                <TableCell component="td" colSpan={row.players[0].scores.length}>
                                                    <i style={{ fontWeight: 'bold' }}>{player.name}</i>
                                                </TableCell>
                                            </TableRow>

                                            <TableRow >
                                                {player.scores.map((score, idx) => <TableCell key={idx}>
                                                    {score}
                                                </TableCell>)}
                                            </TableRow>
                                        </>
                                    ))
                                }

                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 53 * emptyRows }}>
                                        <TableCell colSpan={row.players[0].scores.length} />
                                    </TableRow>
                                )}
                            </TableBody>
                        ))}
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[2, 5, 10, 25]}
                    component="div"
                    count={history.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        )
            :
            (<Paper sx={{ width: '100%', mt: 2 }}>
                <Alert severity="info">You currently do not have any historical data. Once you begin playing, you will begin to see you scoring history here
                </Alert >
            </Paper>)
        }
    </Box>)
}