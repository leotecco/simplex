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
  const [objective, setObjective] = React.useState();

  const handleClick = (objective) => {
    setObjective(objective);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.persist();

    const data = new FormData(event.target);
    const variables = data.get("variables");
    const restrictions = data.get("restrictions");
    const interactions = data.get("interactions");

    onSubmit({ variables, restrictions, interactions, objective });
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

      <Box display="flex">
        <Box width="100%" mr={1}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            onClick={() => handleClick("max")}
            fullWidth
          >
            Maximizar
          </Button>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          onClick={() => handleClick("min")}
          fullWidth
        >
          Minimizar
        </Button>
      </Box>
    </form>
  );
};

const FormFuncVariablesAndRestrictions = ({
  variables,
  restrictions,
  objective,
  onSubmit,
}) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    event.persist();

    const data = new FormData(event.target);
    const multiplier = objective === "max" ? -1 : 1;

    const objectiveFunction = Array(variables + restrictions + 1)
      .fill()
      .map((value, index) => {
        if (index < variables) {
          return parseFloat(data.get(`f[${index}]`)) * multiplier;
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
            <Box mr={index < variables - 1 ? 1 : 0} key={`f[${index}]`}>
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
  const [objective, setObjective] = React.useState(null);
  const [impossible, setImpossible] = React.useState(null);

  const handleSubmitVariablesAndRestrictions = ({
    variables,
    restrictions,
    interactions,
    objective,
  }) => {
    const lineSize = parseInt(restrictions) + 1;
    const columnSize = parseInt(variables) + parseInt(restrictions) + 1;

    setVariables(parseInt(variables));
    setRestrictions(parseInt(restrictions));
    setInteractions(parseInt(interactions));
    setObjective(objective);
    setLineSize(lineSize);
    setColumnSize(columnSize);
  };

  const handleSubmitFuncVariablesAndRestrictions = (matriz) => {
    setMatriz(matriz);

    const impossible = simplex.impossibleSolution(matriz, columnSize);

    if (impossible) {
      setImpossible(true);
      return;
    }

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
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={2}
    >
      <Typography variant="h3" align="center">
        SIMPLEX PO20
      </Typography>

      <Box width="100%" maxWidth={600} p={2} component={Paper}>
        {!variables && !restrictions && !objective && (
          <FormVariablesAndRestrictions
            onSubmit={handleSubmitVariablesAndRestrictions}
          />
        )}

        {variables && restrictions && objective && !matriz && (
          <FormFuncVariablesAndRestrictions
            variables={variables}
            restrictions={restrictions}
            objective={objective}
            onSubmit={handleSubmitFuncVariablesAndRestrictions}
          />
        )}

        {impossible && (
          <Typography variant="h5" align="center">
            Solução impossível
          </Typography>
        )}

        {allMatriz &&
          allMatriz.map((matriz, index) => (
            <TableInteractions matriz={matriz} index={index} key={index} />
          ))}
      </Box>
    </Box>
  );
}

export default App;
