import Draggable from 'react-draggable';
import { Paper, Box, Typography, IconButton, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Fragment, useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const BattleTracker = ({ open, onClose, onChange }) => {
    const [newEncounter, setNewEncounter] = useState(false);
    const [encounter, setEncounter] = useState(null);

    const handleNewBattle = (e) => {
        setNewEncounter(false);
        const rawCharacters = e.target.value.split('\n');
        let characters = rawCharacters.map((character) => {
            const data = character.split('\t');
            return {name: data[0], enemy: data[1] == 'TRUE'? true : false, initiative: data[2]};
        });

        const newencounter = {rounds: 1, characters: characters, turn: 0};
        setEncounter(newencounter);
        const nextTurn = 0;
    };

    const handleCharacterRemove = (i) => {
        const newcharacters = [...encounter.characters];
        newcharacters.splice(i, 1)
        const newencounter = {...encounter, characters: newcharacters};
        setEncounter(newencounter);
    };

    const handleNextTurn = () => {
        const nextTurn = (encounter.turn + 1) % encounter.characters.length;
        const newencounter = {...encounter, turn: nextTurn};
        if (nextTurn == 0) {
            newencounter.rounds++;
        }
        setEncounter(newencounter);
    };

    useEffect(() => {
        onChange(encounter);
    }, [encounter]);

    if (!open) return null;
  
    return (
      <Draggable handle="#draggable-dialog-title">
        <Paper
          elevation={3}
          style={{
            position: 'absolute',
            top: '20%',
            left: '20%',
            width: '300px',
            padding: '16px',
            cursor: 'move',
            zIndex: 1300, // Ensure it's above other content
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" id="draggable-dialog-title">
            <Typography variant="h6">Battle Tracker</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          {newEncounter ? 
            <TextField multiline id="standard-basic" label="Battle data" variant="standard" onBlur={handleNewBattle} />
            : 
                <Fragment>
                    <Button variant='outlined' onClick={() => {setNewEncounter(true)}}>New encounter</Button>
                    <Button variant='outlined' color='error' onClick={handleNextTurn}>Next</Button>
                </Fragment>}
          
          {encounter && 
            <Fragment>
                <Typography variant="h6">Round: {encounter.rounds}</Typography>
                <TableContainer component={Paper}>
                    <Table size='small' aria-label="simple table">
                        <TableBody>
                            {encounter.characters.map((character, i) => (
                                <TableRow
                                key={character.name}
                                style={{backgroundColor: i == encounter.turn ? 'rgba(254, 241, 96,0.3)' : character.enemy ? 'rgba(255,0,0,0.3)' : ''}}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell align="left">{character.initiative}</TableCell>
                                    <TableCell align="left" component="th" scope="row">
                                        {character.name}
                                    </TableCell>
                                    <TableCell align="left" component="th" scope="row">
                                        {character.enemy ? <IconButton size="small" onClick={() => {handleCharacterRemove(i);}}><CloseIcon /></IconButton> : null}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Fragment>
        }
        </Paper>
      </Draggable>
    );
  };

export default BattleTracker;