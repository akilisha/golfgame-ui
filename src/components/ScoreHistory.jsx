import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { AppContext } from '../state/AppContext';
import jsonData from '../../sample.json';

function TablePaginationActions(props) {

    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

const tables = [
    {
        "location": "Sunset Swing",
        "players": [
            { "name": 'Jinsi', "scores": [21, 31, 41, 51, 61, 51, 41, 31, 31, 21, 41, 31, 21, 21, 21, 21, 31, 41] },
            { "name": 'Kadzo', "scores": [41, 31, 41, 31, 21, 41, 31, 41, 21, 31, 41, 31, 41, 51, 31, 21, 21, 21] },
        ]
    },
    {
        "location": "Friday Blues",
        "players": [
            { "name": 'Jimmy', "scores": [2, 3, 4, 5, 6, 5, 4, 3, 3, 2, 4, 3, 2, 2, 2, 2, 3, 4] },
            { "name": 'Bwano', "scores": [4, 3, 4, 3, 2, 4, 3, 4, 2, 3, 4, 3, 4, 5, 3, 2, 2, 2] },
        ]
    },
    {
        "location": "West Habour",
        "players": [
            { "name": 'Kwani', "scores": [2, 3, 4, 5, 6, 5, 4, 3, 3, 2, 4, 3, 2, 2, 2, 2, 3, 4] },
            { "name": 'Jumla', "scores": [4, 3, 4, 3, 2, 4, 3, 4, 2, 3, 4, 3, 4, 5, 3, 2, 2, 2] },
        ]
    },
    {
        "location": "Sunset Swing",
        "players": [
            { "name": 'Mwali', "scores": [2, 3, 4, 5, 6, 5, 4, 3, 3, 2, 4, 3, 2, 2, 2, 2, 3, 4] },
            { "name": 'Gondu', "scores": [4, 3, 4, 3, 2, 4, 3, 4, 2, 3, 4, 3, 4, 5, 3, 2, 2, 2] },
        ]
    },
    {
        "location": "West Habour",
        "players": [
            { "name": 'Anjia', "scores": [2, 3, 4, 5, 6, 5, 4, 3, 3, 2, 4, 3, 2, 2, 2, 2, 3, 4] },
            { "name": 'Mante', "scores": [4, 3, 4, 3, 2, 4, 3, 4, 2, 3, 4, 3, 4, 5, 3, 2, 2, 2] },
        ]
    },
    {
        "location": "Moon Spiral",
        "players": [
            { "name": 'Anjia', "scores": [2, 3, 4, 5, 6, 5, 4, 3, 3, 2, 4, 3, 2, 2, 2, 2, 3, 4] },
            { "name": 'Mante', "scores": [4, 3, 4, 3, 2, 4, 3, 4, 2, 3, 4, 3, 4, 5, 3, 2, 2, 2] },
        ]
    },
].sort((a, b) => (a.calories < b.calories ? -1 : 1));

export default function ScoreHistory({ text }) {

    const { session, downloadScoresHistory } = React.useContext(AppContext);
    const [history, setHistory] = React.useState(jsonData); // continue from here to build table using storage data format

    React.useEffect(() => {
        if (session) {
            (async function () {
                const data = await downloadScoresHistory({ organizer: session.user.id });
                setHistory(data);
            })();
        }
    }, []);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return <Box
    sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }}
>
    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
    </Avatar>
    <Typography component="h1" variant="h5">
        Profile
    </Typography>
        {tables.map((item, i) => (<TableContainer component={Paper} key={i}>
            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                <TableHead>
                    <TableRow>
                        <TableCell colSpan={19}>{item.location}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0
                        ? tables.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : tables
                    ).map((row) => (
                        row.players.map(player => <TableRow key={player.name}>
                            <TableCell component="th" scope="row">
                                {row.player}
                            </TableCell>
                            {player.scores.map(score => <TableCell>
                                {score}
                            </TableCell>)}
                        </TableRow>)
                    ))}
                    {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={6} />
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colSpan={3}
                            count={tables.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            slotProps={{
                                select: {
                                    inputProps: {
                                        'aria-label': 'rows per page',
                                    },
                                    native: true,
                                },
                            }}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
        ))}
    </Box>
}