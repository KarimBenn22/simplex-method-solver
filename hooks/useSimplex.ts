import { paramsType } from "@/app/page"

export interface simplexUrlParams extends paramsType {
    calculate: boolean,
    [key: `x${number}`]: number,
    [key: `C${number}_x${number}`]: number
    [key: `C${number}_b`]: number
}

interface SimplexConstraints {
    coefficients: number[][],
    b: number[]
}

const extractSimplex = (urlParams: simplexUrlParams): {
    objectiveFunction: number[],
    simplexConstraints: SimplexConstraints
} => {
    const { variables, constraints } = urlParams;

    const objectiveFunction = Array.from({ length: variables }, (_, i) =>
        Number(urlParams[`x${i + 1}` as keyof simplexUrlParams] ?? 0)
    );

    const simplexConstraints = {
        coefficients: Array.from({ length: constraints }, (_, constraintIndex) =>
            Array.from({ length: variables }, (_, varIndex) =>
                Number(urlParams[`C${constraintIndex + 1}_x${varIndex + 1}` as keyof simplexUrlParams] ?? 0)
            )
        ),
        b: Array.from({ length: constraints }, (_, i) =>
            Number(urlParams[`C${i + 1}_b` as keyof simplexUrlParams] ?? 0)
        )
    };

    return { objectiveFunction, simplexConstraints };
}

const extractPivotLine = (table: number[][]) => {
    const lastCol = table.map(row => row[row.length - 1]);
    const pivotColIndex = extractPivotColumn(table);

    // Add a check for valid pivot column
    if (pivotColIndex === undefined) {
        console.error('No valid pivot column found');
        return undefined;
    }

    let minRatio = Number.MAX_VALUE;
    let pivotLineIndex = undefined;

    for (let i = 0; i < lastCol.length - 1; i++) { // Exclude the last row (objective function)
        if (table[i][pivotColIndex] > 0) {
            const ratio = lastCol[i] / table[i][pivotColIndex];
            if (ratio >= 0 && ratio < minRatio) {
                minRatio = ratio;
                pivotLineIndex = i;
            }
        }
    }

    return pivotLineIndex;
}
const extractPivotColumn = (table: number[][]) => {
    const lastRow = table[table.length - 1];
    const pivotColIndex = lastRow.slice(0, lastRow.length - 1).reduce((maxIndex, currentValue, currentIndex, array) =>
        currentValue > array[maxIndex] ? currentIndex : maxIndex, 0);
    return pivotColIndex;
}

const isSolution = (table: number[][]) => {
    const lastRow = table[table.length - 1];
    return lastRow.every(value => value <= 0);
}

const solveSimplex = (table: number[][]) => {
    let tables = new Array<number[][]>();
    let tableCopy = [...table];
    tables.push([...tableCopy]);
    while (!isSolution(tableCopy)) {
        const pivoteLineIndex = extractPivotLine(tableCopy);
        const pivotColIndex = extractPivotColumn(tableCopy);

        // Add null checks
        if (pivoteLineIndex === undefined || pivotColIndex === undefined) {
            console.error('Could not find pivot line or column');
            break; // Exit the loop if no valid pivot is found
        }

        const pivot = tableCopy[pivoteLineIndex][pivotColIndex];
        tableCopy[pivoteLineIndex] = tableCopy[pivoteLineIndex].map((value, index) => value / pivot);
        for (let i = 0; i < tableCopy.length; i++) {
            if (i !== pivoteLineIndex) {
                const factor = tableCopy[i][pivotColIndex];
                tableCopy[i] = tableCopy[i].map((value, index) => 
                    value - factor * tableCopy[pivoteLineIndex][index]
                );
            }
        }
        tables.push([...tableCopy]);
    }
    return tables;
}




export const useSimplex = (urlParams: simplexUrlParams) => {
    // Validate input parameters
    if (!urlParams.variables || !urlParams.constraints) {
        throw new Error('Invalid simplex parameters');
    }

    // Extract simplex problem parameters
    const { objectiveFunction, simplexConstraints } = extractSimplex(urlParams);

    // Additional validation
    if (objectiveFunction.length === 0 || simplexConstraints.coefficients.length === 0) {
        throw new Error('Unable to extract valid simplex problem parameters');
    }

    // Get first table ready,
    let sc = [...simplexConstraints.coefficients];

    // Add slack variables to each constraint
    const tableWithSlackVariables = sc.map((constraint, index) => {
        // Create a slack variable row with zeros
        const slackVariables = new Array(sc.length).fill(0);
        // Set the diagonal element to 1 for this constraint's slack variable
        slackVariables[index] = 1;

        // Combine original constraint, slack variables, and b value
        return [...constraint, ...slackVariables, simplexConstraints.b[index]];
    });

    // Add objective function row with zeros for slack variables
    const objectiveFunctionRow = [
        ...objectiveFunction,
        ...new Array(sc.length).fill(0),
        0 // Last column for the constant term
    ];
    const table = [...tableWithSlackVariables, objectiveFunctionRow];
    return {
        tables: solveSimplex(table),
    };
}