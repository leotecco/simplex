import React from "react";

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

const FormFuncVariablesAndRestrictions = ({ variables, restrictions }) => {
  const [arrayVariables, setArrayVariables] = React.useState(
    Array(variables).fill()
  );

  const [matrizRestrictions, setmatrizRestrictions] = React.useState(
    Array(restrictions)
      .fill()
      .map(() => Array(variables).fill())
  );

  return (
    <form>
      <div>
        {arrayVariables.map((value, index) => (
          <input
            name={`x${index + 1}`}
            placeholder={`x${index + 1}`}
            key={index}
          />
        ))}
      </div>
    </form>
  );
};

function App() {
  const [matriz, setMatriz] = React.useState(null);
  const [lineSize, setLineSize] = React.useState(null);
  const [columnSize, setColumnSize] = React.useState(null);
  const [variables, setVariables] = React.useState(null);
  const [restrictions, setRestrictions] = React.useState(null);

  const handleSubmit = ({ variables, restrictions }) => {
    setVariables(parseInt(variables));
    setRestrictions(parseInt(restrictions));
    // const lineSize = parseInt(restrictions) + 1;
    // const columnSize = parseInt(variables) + parseInt(restrictions) + 1;
    // setLineSize(lineSize);
    // setColumnSize(columnSize);
    // setMatriz(
    //   Array(lineSize)
    //     .fill()
    //     .map(() => Array(columnSize))
    // );
  };

  return (
    <div>
      <FormVariablesAndRestrictions onSubmit={handleSubmit} />
      {variables && restrictions && (
        <FormFuncVariablesAndRestrictions
          variables={variables}
          restrictions={restrictions}
        />
      )}
    </div>
  );
}

export default App;
