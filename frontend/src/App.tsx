import React, { useState } from 'react';
import { Button, Container, Grid, Paper, TextField, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { backend } from 'declarations/backend';

const CalculatorButton = styled(Button)(({ theme }) => ({
  fontSize: '1.25rem',
  padding: theme.spacing(2),
}));

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<bigint | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const clear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
    setError(null);
    backend.clear();
  };

  const performOperation = async (nextOperator: string) => {
    const inputValue = BigInt(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      setLoading(true);
      setError(null);
      try {
        const result = await backend.calculate(firstOperand, inputValue, operator);
        setLoading(false);

        if ('ok' in result) {
          setDisplay(result.ok.toString());
          setFirstOperand(result.ok);
        } else {
          setError(result.err);
          setFirstOperand(null);
        }
      } catch (err) {
        setLoading(false);
        setError('An error occurred. Please try again.');
        console.error('Error during calculation:', err);
      }
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 2, marginTop: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          value={display}
          InputProps={{
            readOnly: true,
            endAdornment: loading ? <CircularProgress size={20} /> : null,
          }}
          sx={{ marginBottom: 2 }}
        />
        {error && (
          <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
        )}
        <Grid container spacing={1}>
          {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '=', '+'].map((btn) => (
            <Grid item xs={3} key={btn}>
              <CalculatorButton
                fullWidth
                variant="contained"
                onClick={() => {
                  if (btn === '=') {
                    performOperation('=');
                  } else if (['+', '-', '*', '/'].includes(btn)) {
                    performOperation(btn);
                  } else {
                    inputDigit(btn);
                  }
                }}
                sx={{
                  bgcolor: ['+', '-', '*', '/'].includes(btn) ? 'secondary.main' : 'primary.main',
                  '&:hover': {
                    bgcolor: ['+', '-', '*', '/'].includes(btn) ? 'secondary.dark' : 'primary.dark',
                  },
                }}
              >
                {btn}
              </CalculatorButton>
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={1} sx={{ marginTop: 1 }}>
          <Grid item xs={12}>
            <CalculatorButton
              fullWidth
              variant="contained"
              onClick={clear}
              color="error"
            >
              Clear
            </CalculatorButton>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default App;
