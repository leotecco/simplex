const removeObjectiveFunctionLine = (matriz) =>
  matriz.filter((line, index) => index < matriz.length - 1);

const getLineObjectiveFunction = (matriz, lineSize) => matriz[lineSize - 1];

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

const getLineEnterBase = (matriz, indexColumnGetOffBase, columnSize) => {
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

const createNewMatriz = (matriz, lineSize, columnSize) => {
  const lineObjectiveFunction = getLineObjectiveFunction(matriz, lineSize);
  const columnGetOffBase = getColumnGetOffBase(lineObjectiveFunction);
  const lineEnterBase = getLineEnterBase(
    matriz,
    columnGetOffBase.index,
    columnSize
  );
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

const stopConditionReached = (matriz, lineSize) => {
  const lineObjectiveFunction = getLineObjectiveFunction(matriz, lineSize);

  return lineObjectiveFunction.every((value) => value >= 0);
};

const impossibleSolution = (matriz, columnSize) => {
  return matriz.some((line) => line[columnSize - 1] < 0);
};

export default { createNewMatriz, stopConditionReached, impossibleSolution };
