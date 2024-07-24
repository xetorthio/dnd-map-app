import Chip from '@mui/material/Chip';
import { ReadyState } from 'react-use-websocket';

const ConnectionStatus = ({connectionStatus}) => {
    const connectionStatusString = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Connected',
        [ReadyState.CLOSING]: 'Disconnecting',
        [ReadyState.CLOSED]: 'Disconnected',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
      }[connectionStatus];
    
      const connectionStatusColor = {
        [ReadyState.CONNECTING]: 'warning',
        [ReadyState.OPEN]: 'success',
        [ReadyState.CLOSING]: 'warning',
        [ReadyState.CLOSED]: 'error',
        [ReadyState.UNINSTANTIATED]: 'error',
      }[connectionStatus];

    return (
        <Chip  label={connectionStatusString} color={connectionStatusColor} />
    ); 
};

export default ConnectionStatus;