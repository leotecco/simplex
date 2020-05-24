import React from "react";

import "typeface-roboto";

import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";

import simplex from "./simplex";

const TableInteractions = ({ matriz, index }) => {
  return (
    <Box mb={2}>
      <Box mb={1}>
        <Typography variant="h4">Interação {index + 1}</Typography>
      </Box>

      <Table>
        <TableBody>
          {matriz.map((line, index) => (
            <TableRow key={index}>
              {line.map((value, index) => (
                <TableCell key={index}>{value.toFixed(2)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

const FormVariablesAndRestrictions = ({ onSubmit = () => {} }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    event.persist();

    const data = new FormData(event.target);
    const variables = data.get("variables");
    const restrictions = data.get("restrictions");
    const interactions = data.get("interactions");

    onSubmit({ variables, restrictions, interactions });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box mb={1}>
        <Typography variant="h4">Dados iniciais</Typography>
      </Box>

      <Box mb={1}>
        <TextField
          type="number"
          name="variables"
          label="Quantidade de variáveis"
          variant="outlined"
          required
          fullWidth
        />
      </Box>

      <Box mb={1}>
        <TextField
          type="number"
          name="restrictions"
          label="Quantidade de restrições"
          variant="outlined"
          required
          fullWidth
        />
      </Box>

      <Box mb={1}>
        <TextField
          type="number"
          name="interactions"
          label="Quantidade de interações"
          variant="outlined"
          required
          fullWidth
        />
      </Box>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        fullWidth
      >
        Maximizar
      </Button>
    </form>
  );
};

const FormFuncVariablesAndRestrictions = ({
  variables,
  restrictions,
  onSubmit,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    event.persist();

    const data = new FormData(event.target);

    const objectiveFunction = Array(variables + restrictions + 1)
      .fill()
      .map((value, index) => {
        if (index < variables) {
          return parseFloat(data.get(`f[${index}]`)) * -1;
        }

        return 0;
      });

    const matrizRestrictions = Array(restrictions)
      .fill()
      .map((value, line) =>
        Array(variables + restrictions + 1)
          .fill()
          .map((value, index) => {
            if (index < variables) {
              return parseFloat(data.get(`r[${line}][${index}]`));
            }

            if (index === variables + restrictions) {
              return parseFloat(data.get(`r[${line}][${variables}]`));
            }

            if (index === variables + line) {
              return 1;
            }

            return 0;
          })
      );

    onSubmit([...matrizRestrictions, objectiveFunction]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box mb={1}>
        <Typography variant="h4">Função objetivo</Typography>
      </Box>

      <Box display="flex" mb={1}>
        {Array(variables)
          .fill()
          .map((value, index) => (
            <Box mr={1} key={`f[${index}]`}>
              <TextField
                name={`f[${index}]`}
                label={`x${index + 1}`}
                variant="outlined"
                required
              />
            </Box>
          ))}
      </Box>

      <Box mb={1}>
        <Typography variant="h4">Restrições</Typography>
      </Box>

      {Array(restrictions)
        .fill()
        .map(() => Array(variables + 1).fill())
        .map((variables, line) => (
          <Box display="flex" mb={1} key={`l${line}`}>
            {variables.map((value, index) => {
              if (index < variables.length - 1) {
                return (
                  <Box mr={1} key={`r[${line}][${index}]`}>
                    <TextField
                      name={`r[${line}][${index}]`}
                      label={`x${index + 1}`}
                      variant="outlined"
                      required
                    />
                  </Box>
                );
              }

              return (
                <Box
                  display="flex"
                  alignItems="center"
                  key={`r[${line}][${index}]`}
                >
                  {"<="}
                  <Box ml={1}>
                    <TextField
                      name={`r[${line}][${index}]`}
                      variant="outlined"
                      required
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        ))}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        fullWidth
      >
        Passo a passo
      </Button>
    </form>
  );
};

function App() {
  const [allMatriz, setAllMatriz] = React.useState(null);
  const [matriz, setMatriz] = React.useState(null);
  const [lineSize, setLineSize] = React.useState(null);
  const [columnSize, setColumnSize] = React.useState(null);
  const [variables, setVariables] = React.useState(null);
  const [restrictions, setRestrictions] = React.useState(null);
  const [interactions, setInteractions] = React.useState(null);

  const handleSubmitVariablesAndRestrictions = ({
    variables,
    restrictions,
    interactions,
  }) => {
    const lineSize = parseInt(restrictions) + 1;
    const columnSize = parseInt(variables) + parseInt(restrictions) + 1;

    setVariables(parseInt(variables));
    setRestrictions(parseInt(restrictions));
    setInteractions(parseInt(interactions));
    setLineSize(lineSize);
    setColumnSize(columnSize);
  };

  const handleSubmitFuncVariablesAndRestrictions = (matriz) => {
    setMatriz(matriz);

    const allMatriz = [matriz];
    let countInterations = 0;

    do {
      allMatriz.push(
        simplex.createNewMatriz(
          allMatriz[allMatriz.length - 1],
          lineSize,
          columnSize
        )
      );

      countInterations++;
    } while (
      !simplex.stopConditionReached(
        allMatriz[allMatriz.length - 1],
        lineSize
      ) &&
      countInterations < interactions
    );

    allMatriz.shift();

    setAllMatriz(allMatriz);
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="center" mt={4}>
      <Paper>
        <Box width={600} p={2}>
          {!variables && !restrictions && (
            <FormVariablesAndRestrictions
              onSubmit={handleSubmitVariablesAndRestrictions}
            />
          )}

          {variables && restrictions && !matriz && (
            <FormFuncVariablesAndRestrictions
              variables={variables}
              restrictions={restrictions}
              onSubmit={handleSubmitFuncVariablesAndRestrictions}
            />
          )}

          {allMatriz &&
            allMatriz.map((matriz, index) => (
              <TableInteractions matriz={matriz} index={index} key={index} />
            ))}
        </Box>
      </Paper>
    </Box>
  );
}

export default App;
