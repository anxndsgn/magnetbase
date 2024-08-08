import { useState } from 'react';
import { Button, Container, Typography, Box } from '@mui/material';

function App() {
  const [port, setPort] = useState(null);

  async function connectToArduino() {
    try {
      const selectedPort = await navigator.serial.requestPort();
      await selectedPort.open({ baudRate: 115200 });
      setPort(selectedPort);
      console.log('Connected to Arduino');
    } catch (err) {
      console.error('Error:', err);
    }
  }

  async function sendCommand(command) {
    if (!port) {
      console.error('Not connected to Arduino');
      return;
    }
    const writer = port.writable.getWriter();
    await writer.write(new TextEncoder().encode(command + '\n'));
    writer.releaseLock();
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Arduino Control Panel
        </Typography>
        <Button variant="contained" onClick={connectToArduino} sx={{ mb: 2 }}>
          Connect to Arduino
        </Button>
        <Box>
          <Button
            variant="outlined"
            onClick={() => sendCommand('ON')}
            sx={{ mr: 1 }}
          >
            Turn LED On
          </Button>
          <Button variant="outlined" onClick={() => sendCommand('OFF')}>
            Turn LED Off
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default App;
