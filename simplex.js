const matriz = [
  [0.7, 1, 1, 0, 0, 0, 630],
  [0.5, 0.83, 0, 1, 0, 0, 600],
  [1, 0.66, 0, 0, 1, 0, 700],
  [0.1, 0.25, 0, 0, 0, 1, 135],
  [-10, -9, 0, 0, 0, 0, 0],
];

const lineSize = 5;
const columnSize = 7;

const printMatriz = (matriz) => console.table(matriz);

const removeObjectiveFunctionLine = (matriz) =>
  matriz.filter((line, index) => index < matriz.length - 1);

const getLineObjectiveFunction = (matriz) => matriz[lineSize - 1];

const columnToArray = (matriz, columnIndex) =>
  matriz.map((line) => line[columnIndex]);

const getColumnGetOffBase = (lineObjectiveFunction) =>
  lineObjectiveFunction.reduce(
    (current, value, index) => {
      if (value < 0 && value < current.value) {
        return { index, value };
      }

      return current;
    },
    { index: 0, value: 0 }
  );

const getLineEnterBase = (matriz, indexColumnGetOffBase) => {
  const matrizWithoutObjectiveFunctionLine = removeObjectiveFunctionLine(
    matriz
  );
  const columnResult = columnToArray(
    matrizWithoutObjectiveFunctionLine,
    columnSize - 1
  );
  const columnGetOffBase = columnToArray(
    matrizWithoutObjectiveFunctionLine,
    indexColumnGetOffBase
  );

  const result = columnResult.map(
    (value, index) => value / columnGetOffBase[index]
  );

  return result.reduce(
    (current, value, index) => {
      if (value > 0 && value < current.value) {
        return { index, value };
      }

      return current;
    },
    { index: 0, value: result[0] }
  );
};

const getPivotValue = (matriz, indexLineEnterBase, indexColumnGetOffBase) =>
  matriz[indexLineEnterBase][indexColumnGetOffBase];

const createNewLinePivot = (matriz, indexLinePivot, pivot) =>
  matriz[indexLinePivot].map((value) => value / pivot);

const createNewLine = (
  matriz,
  newLinePivot,
  indexNewLine,
  indexColumnGetOffBase
) => {
  const newLine = matriz[indexNewLine];
  const pivot = matriz[indexNewLine][indexColumnGetOffBase] * -1;

  return newLinePivot.map((value, index) => value * pivot + newLine[index]);
};

const createNewMatriz = (matriz) => {
  const lineObjectiveFunction = getLineObjectiveFunction(matriz);
  const columnGetOffBase = getColumnGetOffBase(lineObjectiveFunction);
  const lineEnterBase = getLineEnterBase(matriz, columnGetOffBase.index);
  const pivot = getPivotValue(
    matriz,
    lineEnterBase.index,
    columnGetOffBase.index
  );
  const newLinePivot = createNewLinePivot(matriz, lineEnterBase.index, pivot);

  const newMatriz = matriz.map((line, index) => {
    if (index === lineEnterBase.index) {
      return newLinePivot;
    }

    return createNewLine(matriz, newLinePivot, index, columnGetOffBase.index);
  });

  return newMatriz;
};

printMatriz(matriz);

const newMatriz = createNewMatriz(matriz);

printMatriz(newMatriz);

const newMatriz2 = createNewMatriz(newMatriz);

printMatriz(newMatriz2);
