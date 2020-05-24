import React from "react";
import createNewMatriz from "./simplex";

const FormVariablesAndRestrictions = ({ onSubmit = () => {} }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    event.persist();

    const data = new FormData(event.target);
    const variables = data.get("variables");
    const restrictions = data.get("restrictions");

    onSubmit({ variables, restrictions });
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>Dados iniciais</p>
      <div>
        <input
          type="number"
          name="variables"
          placeholder="Quantidade de variáveis"
          required
        />
      </div>

      <div>
        <input
          type="number"
          name="restrictions"
          placeholder="Quantidade de restrições"
          required
        />
      </div>

      <button>Criar</button>
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
      <p>Função objetivo</p>
      <div>
        {Array(variables)
          .fill()
          .map((value, index) => (
            <input
              name={`f[${index}]`}
              placeholder={`x${index + 1}`}
              key={`f[${index}]`}
            />
          ))}
      </div>

      <p>Restrições</p>

      {Array(restrictions)
        .fill()
        .map(() => Array(variables + 1).fill())
        .map((variables, line) => (
          <div key={`l${line}`}>
            {variables.map((value, index) => {
              if (index < variables.length - 1) {
                return (
                  <input
                    name={`r[${line}][${index}]`}
                    placeholder={`x${index + 1}`}
                    key={`r[${line}][${index}]`}
                  />
                );
              }

              return (
                <span key={`r[${line}][${index}]`}>
                  =
                  <input name={`r[${line}][${index}]`} />
                </span>
              );
            })}
          </div>
        ))}

      <button>Criar</button>
    </form>
  );
};

function App() {
  const [matriz, setMatriz] = React.useState(null);
  const [lineSize, setLineSize] = React.useState(null);
  const [columnSize, setColumnSize] = React.useState(null);
  const [variables, setVariables] = React.useState(null);
  const [restrictions, setRestrictions] = React.useState(null);

  const handleSubmitVariablesAndRestrictions = ({
    variables,
    restrictions,
  }) => {
    const lineSize = parseInt(restrictions) + 1;
    const columnSize = parseInt(variables) + parseInt(restrictions) + 1;

    setVariables(parseInt(variables));
    setRestrictions(parseInt(restrictions));
    setLineSize(lineSize);
    setColumnSize(columnSize);
  };

  const handleSubmitFuncVariablesAndRestrictions = (matriz) => {
    setMatriz(matriz);
  };

  return (
    <div>
      <FormVariablesAndRestrictions
        onSubmit={handleSubmitVariablesAndRestrictions}
      />

      {variables && restrictions && (
        <FormFuncVariablesAndRestrictions
          variables={variables}
          restrictions={restrictions}
          onSubmit={handleSubmitFuncVariablesAndRestrictions}
        />
      )}
    </div>
  );
}

export default App;
