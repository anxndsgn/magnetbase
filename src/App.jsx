import { useState } from 'react';
import { Button, Container, Typography, Box } from '@mui/material';

function App() {
  const [port, setPort] = useState(null);
  const [connected, setConnected] = useState(false);
  const [portInfo, setPortInfo] = useState(null);

  async function connectToArduino() {
    try {
      const selectedPort = await navigator.serial.requestPort();
      await selectedPort.open({ baudRate: 9600 });
      setPort(selectedPort);
      setConnected(true);
      setPortInfo(await selectedPort.getInfo().usbVendorId);
    } catch (err) {
      console.error('Error:', err);
      alert('Somthing wrong happened, please try again');
    }
  }
  async function sendCommand(command) {
    if (!port) {
      console.error('Not connected to Arduino');
      alert('Not connected to Arduino');
      return;
    }
    const writer = port.writable.getWriter();
    console.log('Sending command:', command);
    await writer.write(new TextEncoder().encode(command + '\n'));
    writer.releaseLock();
  }

  return (
    <Container maxWidth='sm'>
      <Box sx={{ my: 4 }}>
        <Typography variant='h4' component='h1' gutterBottom>
          MagnetBase Control Panel
        </Typography>
        <div className='flex gap-2'>
          <Button variant='contained' onClick={connectToArduino} sx={{ mb: 2 }}>
            {connected ? `Connected to ${portInfo}` : `Connect to MagnetBase`}
          </Button>
          {port && (
            <Button
              onClick={async () => {
                await port.close();
                setPort(null);
                setConnected(false);
                alert('Disconnected!');
              }}
              sx={{ mb: 2 }}
            >
              Disconnect
            </Button>
          )}
        </div>

        <div className='grid grid-cols-3 gap-2'>
          {Array.from({ length: 9 }, (_, i) => (
            <MagPixel
              key={i}
              sendCommand={sendCommand}
              command={i + 1}
              connected={connected}
            >
              {i + 1}
            </MagPixel>
          ))}
        </div>
        <span></span>
      </Box>
      <Typography variant='h4' component='h1' gutterBottom>
        Changelog
      </Typography>
      <Typography variant='body1' component='p' gutterBottom>
        <ul>
          <li>v1.0: Initial release</li>
          <li>v1.1: 改为鼠标进入按钮时发送指令</li>
        </ul>
      </Typography>
    </Container>
  );
}

export default App;

// eslint-disable-next-line react/prop-types
function MagPixel({ sendCommand, command, connected, children }) {
  return (
    <Button
      variant={connected ? 'outlined' : 'disabled'}
      onClick={() => sendCommand(command)}
      onMouseEnter={() => {
        sendCommand(command);
      }}
      className=' h-24'
    >
      {children}
    </Button>
  );
}
