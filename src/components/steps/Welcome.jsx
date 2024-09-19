import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';

export default function Welcome() {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange =
    (panel) => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <LooksOneIcon />
        </ListItemAvatar>
        <ListItemText
          primary="Location aware"
          secondary={
            <React.Fragment>
              {"— Players should tap on their location to associate their scores with the location they are playing at"}
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <LooksTwoIcon />
        </ListItemAvatar>
        <ListItemText
          primary="Score history"
          secondary={
            <React.Fragment>
              {" — Registered players can now view their scores from previous games via the 'Score History' menu"}
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Looks3Icon />
        </ListItemAvatar>
        <ListItemText
          primary="Upcoming features"
          secondary={
            <React.Fragment>
              {' — Watch this details for more details as they emerge'}
            </React.Fragment>
          }
        />
      </ListItem>
    </List>
  );
}