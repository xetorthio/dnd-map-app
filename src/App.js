import './App.css';
import { Fragment, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import DM from './components/Pages/DM';
import Player from './components/Pages/Player';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  const [isPlayer, setPlayer] = useState(null);

  const handleDMClick = () => {
    setPlayer(false);
  };
  const handlePlayerClick = () => {
    setPlayer(true);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      {isPlayer === null ? <Fragment>
        <Stack spacing={2} direction="row">
          <Button variant="contained" color="primary" onClick={handleDMClick}>DM</Button>
          <Button variant="contained" color="secondary" onClick={handlePlayerClick}>Player</Button>
        </Stack>
      </Fragment> : isPlayer ? <Player /> : <DM />}
    </ThemeProvider>
  );
}

export default App;
