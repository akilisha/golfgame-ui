import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import {  Outlet, useNavigate } from 'react-router-dom';

export default function TabbedView() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const navigate = useNavigate();

  return (
    
    <div style={{margin: "40px auto"}}>
      <Tabs value={value} onChange={handleChange} aria-label="icon label tabs example">
        <Tab icon={<RocketLaunchIcon />} label="Launch" sx={{flex: 1}} onClick={() => navigate("/")} />
        <Tab icon={<LocationOnIcon />} label="Location"  sx={{flex: 1}} onClick={() => navigate("/location")}/>
        <Tab icon={<SportsKabaddiIcon />} label="Playing"  sx={{flex: 1}} onClick={() => navigate("/playing")}/>
      </Tabs>
      <div style={{
        margin: "0px auto"
      }}>
        <Outlet />
      </div>
      </div>
  );
}